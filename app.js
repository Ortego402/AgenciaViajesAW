const express = require('express');
const dbConnection = require('./js/dbConfig'); // Importa la conexión a la base de datos

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

// Configura Express para usar EJS como motor de plantillas
app.set('view engine', 'ejs');

app.use(express.static('public'));


// Mostrar todos los destinos
app.get('/', (req, res) => {
  // Realiza la consulta a la base de datos
  dbConnection.query('SELECT * FROM destinos', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error de la base de datos' });
      return;
    }

    // Renderiza la vista "index.ejs" con los resultados como datos
    res.render('home', { results: results });
  });
});

app.get('/servicios', (req, res) => {
  res.render('servicios');
});

app.get('/nosotros', (req, res) => {
  res.render('nosotros');
});

app.get('/populares', (req, res) => {
  res.render('populares');
});

app.get('/reserva', (req, res) => {
      res.render('reserva');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/registro', (req, res) => {
    res.render('registro');
});

app.get('/destino/:id', (req, res) => {
  const id = req.params.id;
  const reservaConfirmada = req.query.reserva === `confirmada`;
  const comentarioConfirmado = req.query.comentario === `confirmada`;

  let mensaje = "";
  if(reservaConfirmada){
    mensaje = "¡Reserva completada! Gracias por realizar la reserva."
  }
  else if(comentarioConfirmado){
    mensaje = "Comentario realizado correctamente.";
  }
  else if(req.query.reserva == "null" || req.query.comentario == "null"){
    mensaje = "¡Ups! Ha ocurrido un error al realizar la acción.";
  }

  dbConnection.query('SELECT * FROM destinos WHERE id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error de la base de datos' });
    }

    if (result.length === 0) {
      return res.status(404).send('Destino no encontrado');
    }

    
    // Consulta para obtener las imágenes del destino
    dbConnection.query('SELECT * FROM imagenes_destino WHERE destino_id = ?', [id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error de la base de datos' });
      }

      dbConnection.query('SELECT * FROM comentarios WHERE destino_id = ?', [id], (err, comentarios) => {
        if (err) {
            return res.status(500).json({ error: 'Error de la base de datos' });
        }
        res.render('destino', { result: result[0], results: results, comentarios: comentarios, mensaje: mensaje });
      });
    });
  });
}); 


app.get('/buscar', (req, res) => {
  // Obtiene el término de búsqueda del parámetro de consulta (query parameter)
  const searchTerm = req.query.nombreBuscar;
  // Realiza la consulta a la base de datos para buscar destinos por nombre o descripción
  dbConnection.query('SELECT * FROM destinos WHERE nombre LIKE ? OR descripcion LIKE ?', [`%${searchTerm}%`, `%${searchTerm}%`], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error de la base de datos' });
      return;
    }
    // Renderiza la vista "index.ejs" con los resultados como datos
    res.render('home', { results: results });
  });
});

// Ruta para manejar la reserva
app.post('/destino/:id/reservar', (req, res) => {
  const { nombre, email, fecha_reserva } = req.body;
  const id = req.params.id;

  //comprueba que el correo tenga el formato adecuado de correo
  if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.email)){
    return res.status(400).json({ error: 'El correo no es valido' });
  }

  // Inserta los datos en la base de datos
  dbConnection.query('INSERT INTO reservas (destino_id, nombre_cliente, correo_cliente, fecha_reserva) VALUES (?, ?, ?, ?)', [id, nombre, email, fecha_reserva], (err, result) => {
    if (err) {
      return res.redirect(`/destino/${id}?reserva=null`);
    }

    res.redirect(`/destino/${id}?reserva=confirmada`);
  });
});

// Ruta para manejar el comentario
app.post('/destino/:id/comentarios', (req, res) => {
  const { nombre_usuario, comentario} = req.body;
  const id = req.params.id;
  
  // Inserta los datos en la base de datos
  dbConnection.query('INSERT INTO comentarios (destino_id, nombre_usuario, comentario) VALUES (?, ?, ?)', [id, nombre_usuario, comentario], (err, result) => {
    if (err) {
      return res.redirect(`/destino/${id}?comentario=null`);
    }
    res.redirect(`/destino/${id}?comentario=confirmada`);
  });
});

app.post('/registro', (req, res) => {
  const { nombre, apellidos, correo, username, password } = req.body;

  const checkUsernameQuery = 'SELECT * FROM usuarios WHERE username = ?';
  db.query(checkUsernameQuery, [username], (checkUsernameErr, checkUsernameResult) => {
    if (checkUsernameErr) {
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    if (checkUsernameResult.length > 0) {
      return res.status(400).json({ error: 'El nombre de usuario ya está en uso, elije' });
    }
  });

  if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)){
    return res.status(400).json({ error: 'El correo no es valido' });
  }

  // Comprobar la contraseña según tus requisitos
  if (/[A-Z]/.test(password)) {
    return res.status(400).json({ error: 'La contraseña no es valida' });
  }
  if (/\d/.test(password)) {
    return res.status(400).json({ error: 'La contraseña debete tener almenos un numero' });
  }
  if (password.length >= 10) {
    return res.status(400).json({ error: 'La contraseña debe tener almenos 10 caracteres' });
  }

  // Insertar datos en la base de datos
  const query = 'INSERT INTO usuarios (nombre, apellidos, correo, username, password) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [username, bcrypt.hash(password, 10)], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    return res.status(200).json({ message: 'Registro exitoso.' });
  });
  
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});