// Importa las bibliotecas y módulos necesarios
const express = require('express'); // Importa Express
const dbConnection = require('./js/dbConfig'); // Importa la configuración de la base de datos
// const bcrypt = require('bcrypt'); // Importa la biblioteca bcrypt para el hashing de contraseñas

// Crea una instancia de Express
const app = express();
const router = express.Router();
const bcrypt = require('bcrypt'); //guarda la contraseña en forma de hash instalar => npm install bcrypt
const session = require('express-session'); //para manejar los incios de seseion es necesario instalarse =>npm install express express-session
app.use(session({
  secret: 'Epicscape',
  resave: false,
  saveUninitialized: true
}));
const port = 3000; // Puerto en el que se ejecutará el servidor

// Configura Express para usar bodyParser y EJS como motor de plantillas
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Configura Express para servir archivos estáticos desde el directorio 'public'
app.use(express.static('public'));

// Ruta para mostrar todos los destinos
app.get('/', (req, res) => {
  //console.log('Username almacenado en la sesión:', req.session.username);
  // Realiza una consulta a la base de datos para obtener todos los destinos
  dbConnection.query('SELECT * FROM destinos', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error de la base de datos' });
      return;
    }
    // Renderiza la vista "home.ejs" con los resultados obtenidos de la base de datos
    res.render('home', { results: results, session: req.session });
  });
});

// Rutas para otras páginas
app.get('/servicios', (req, res) => {
  res.render('servicios', { session: req.session });
});

app.get('/nosotros', (req, res) => {
  res.render('nosotros', { session: req.session });
});

app.get('/populares', (req, res) => {
  res.render('populares', { session: req.session });
});

app.get('/reserva', (req, res) => {
  res.render('reserva', { session: req.session });
});

app.get('/login', (req, res) => {
  let mensaje = "";
  res.render('login', { session: req.session, mensaje: mensaje });
});

app.get('/registro', (req, res) => {
  let mensaje = "";
  res.render('registro', { session: req.session, mensaje: mensaje });
});

app.get('/perfil', (req, res) => {
  const cambiosConfirmada = req.query.cambios === 'confirmado';
  let mensaje = "";
  if(cambiosConfirmada){
    mensaje = "Cambios realizados.";
  }
  else if(req.query.cambios === 'null'){
    mensaje = "El usuario ya existe, prueba con otro.";
  }
  dbConnection.query('SELECT * FROM usuarios WHERE username like ?', [req.session.username], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error de la base de datos' });
      return;
    }
    // Renderiza la vista "home.ejs" con los resultados obtenidos de la base de datos
    res.render('perfil', { results: results[0], session: req.session, mensaje: mensaje});
  });
});

app.post('/actualizar_perfil', (req, res) => {
  const { nombre, apellidos, correo, username} = req.body;

  const checkUsernameQuery = 'SELECT * FROM usuarios WHERE username = ?';
  dbConnection.query(checkUsernameQuery, [username], (checkUsernameErr, checkUsernameResult) => {
    if (checkUsernameErr) {
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    // Comprobar el user name según sus requisitos
    if (checkUsernameResult.length > 0 && username != req.session.username) {
      return res.redirect('perfil?cambios=null');
    }
    // Insertar datos en la base de datos
    dbConnection.query('UPDATE usuarios SET nombre = ?, apellidos = ?, correo = ?, username = ? WHERE username = ?', [nombre, apellidos, correo, username, req.session.username], (err, result) => {
      if (err) {
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    // Las credenciales son válidas, almacenar información del usuario en la sesión
    req.session.username = username;
    // Puedes almacenar más información en la sesión según tus necesidades
    return res.redirect('/perfil?cambios=confirmado');
  });
  });
});

// Ruta para mostrar detalles de un destino específico
app.get('/destino/:id', (req, res) => {
  const id = req.params.id;
  const reservaConfirmada = req.query.reserva === 'confirmada';
  const comentarioConfirmado = req.query.comentario === 'confirmada';

  // Mensaje que se mostrará en función de la confirmación de reserva o comentario
  let mensaje = '';
  if (reservaConfirmada) {
    mensaje = '¡Reserva completada! Gracias por realizar la reserva.';
  } else if (comentarioConfirmado) {
    mensaje = 'Comentario realizado correctamente.';
  } else if (req.query.reserva === 'null' || req.query.comentario === 'null') {
    mensaje = '¡Ups! Ha ocurrido un error al realizar la acción.';
  }

  // Realiza una consulta a la base de datos para obtener detalles del destino y sus imágenes y comentarios asociados
  dbConnection.query('SELECT * FROM destinos WHERE id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error de la base de datos' });
    }

    if (result.length === 0) {
      return res.status(404).send('Destino no encontrado');
    }

    // Consultas para obtener imágenes y comentarios del destino específico
    dbConnection.query('SELECT * FROM imagenes_destino WHERE destino_id = ?', [id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error de la base de datos' });
      }

      dbConnection.query('SELECT * FROM comentarios WHERE destino_id = ?', [id], (err, comentarios) => {
        if (err) {
          return res.status(500).json({ error: 'Error de la base de datos' });
        }
        // Renderiza la vista "destino.ejs" con los detalles del destino, imágenes y comentarios
        res.render('destino', { result: result[0], results: results, comentarios: comentarios, mensaje: mensaje, session: req.session});
      });
    });
  });
});

// Ruta para buscar destinos por nombre o descripción
app.get('/buscar', (req, res) => {
  const searchTerm = req.query.nombreBuscar; // Obtiene el término de búsqueda del parámetro de consulta
  // Realiza una consulta a la base de datos para buscar destinos por nombre o descripción
  dbConnection.query('SELECT * FROM destinos WHERE nombre LIKE ? OR descripcion LIKE ?', [`%${searchTerm}%`, `%${searchTerm}%`], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error de la base de datos' });
      return;
    }
    // Renderiza la vista "home.ejs" con los resultados de la búsqueda
    res.render('home', { results: results, session: req.session});
  });
});

// Ruta para manejar la reserva de un destino específico
app.post('/destino/:id/reservar', (req, res) => {
  const { email, fecha_reserva } = req.body;
  const id = req.params.id;

  // Inserta los datos de la reserva en la base de datos
  dbConnection.query('INSERT INTO reservas (destino_id, nombre_cliente, correo_cliente, fecha_reserva) VALUES (?, ?, ?, ?)', [id, req.session.username, email, fecha_reserva], (err, result) => {
    if (err) {
      return res.redirect(`/destino/${id}?reserva=null`);
    }
    // Redirige a la página del destino con confirmación de reserva
    res.redirect(`/destino/${id}?reserva=confirmada`);
  });
});

// Ruta para manejar la publicación de comentarios en un destino específico
app.post('/destino/:id/comentarios', (req, res) => {
  const { comentario } = req.body;
  const id = req.params.id;

  // Inserta los datos del comentario en la base de datos
  dbConnection.query('INSERT INTO comentarios (destino_id, nombre_usuario, comentario) VALUES (?, ?, ?)', [id, req.session.username, comentario], (err, result) => {
    if (err) {
      return res.redirect(`/destino/${id}?comentario=null`);
    }
    // Redirige a la página del destino con confirmación de comentario
    res.redirect(`/destino/${id}?comentario=confirmada`);
  });
});


app.post('/registrar', (req, res) => {
  const { nombre, apellido, correo, username, password, confirmPassword } = req.body;
  let mensaje = null;

  const checkUsernameQuery = 'SELECT * FROM usuarios WHERE username = ?';
  
  dbConnection.query(checkUsernameQuery, [username], (checkUsernameErr, checkUsernameResult) => {
    if (checkUsernameErr) {
      console.error(checkUsernameErr);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    // Comprobar el user name según sus requisitos
    if (checkUsernameResult.length > 0) {
      mensaje = 'El nombre de usuario ya existe.';
    }
    // Comprobar la contraseña según sus requisitos
    else if (!mensaje && password.length < 8) {
      mensaje = 'La contraseña debe tener al menos 8 caracteres.';
    } else if (!mensaje && !/[A-Z]/.test(password)) {
      mensaje = 'La contraseña debe tener una letra mayúscula.';
    } else if (!mensaje && !/\d/.test(password)) {
      mensaje = 'La contraseña debe tener al menos un número.';
    } else if (!mensaje && !/\W/.test(password)) {
      mensaje = 'La contraseña debe contener al menos un carácter especial.';
    } else if (!mensaje && password !== confirmPassword) {
      mensaje = 'Las contraseñas deben coincidir.';
    }

    // Devuelve si hay algun error
    if (mensaje) {
      return res.render('registro', { mensaje: mensaje , username: username, nombre: nombre, apellido: apellido, correo: correo, password: password});
    }
    else{
       // Insertar datos en la base de datos
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.error('Error al generar el hash de la contraseña:', err);
        return res.status(500).json({ error: 'Error al hashear la contraseña' });
      }

      dbConnection.query('INSERT INTO usuarios (nombre, apellidos, correo, username, password) VALUES (?, ?, ?, ?, ?)', [nombre, apellido, correo, username, hash], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Error interno del servidor' });
        }

        // Las credenciales son válidas, almacenar información del usuario en la sesión
        req.session.username = username;
        // Puedes almacenar más información en la sesión según tus necesidades

        return res.redirect('/');
      });
    });
    }
  });
});


app.post('/InicioSesion', (req, res) => {
  const { username, password } = req.body;
  
  const checkUsernameQuery = 'SELECT * FROM usuarios WHERE username = ?';
  dbConnection.query(checkUsernameQuery, [username], (checkUsernameErr, checkUsernameResult) => {
    if (checkUsernameErr) {
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    let mensaje = null;
    if (checkUsernameResult.length === 0) {
      // Nombre de usuario no existe, asignar un mensaje de error
      mensaje = 'El nombre de usuario no existe';
      return res.render('login', { mensaje: mensaje });
    } else {
      // Verificar la contraseña utilizando bcrypt
      const storedPasswordHash = checkUsernameResult[0].password; // asumiendo que el campo en la base de datos se llama "password"
      bcrypt.compare(password, storedPasswordHash, (compareErr, compareResult) => {
        if (compareErr) {
          return res.status(500).json({ error: 'Error interno del servidor' });
        }

        if (!compareResult) {
          // Contraseña incorrecta, asignar un mensaje de error
          mensaje = 'Contraseña incorrecta';
          return res.render('login', { mensaje: mensaje });
        }

        // Las credenciales son válidas, almacenar información del usuario en la sesión
        req.session.username = username;
        return res.redirect('/');
      });
    }
  });
});


app.get('/logout', (req, res) => {
  // Destruir la sesión
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      return res.status(500).send('Error interno del servidor');
    }

    // Redirigir a la página de inicio de sesión o a donde desees
    res.redirect('/');
  });
});


// Inicia el servidor y escucha en el puerto especificado
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});