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
      console.error('Error al ejecutar la consulta:', err);
      res.status(500).json({ error: 'Error de la base de datos' });
      return;
    }

    // Renderiza la vista "index.ejs" con los resultados como datos
    res.render('index', { results: results });
  });
});

app.get('/reserva', (req, res) => {
      res.render('reserva');
});

app.get('/destino/:id', (req, res) => {
  const id = req.params.id;
  const reservaConfirmada = req.query.reserva === `confirmada`;
  const comentarioConfirmado = req.query.comentario === `confirmada`;

  dbConnection.query('SELECT * FROM destinos WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      return res.status(500).json({ error: 'Error de la base de datos' });
    }

    if (result.length === 0) {
      console.log('No se encontraron resultados para el ID:', id);
      return res.status(404).send('Destino no encontrado');
    }

    
    // Consulta para obtener las imágenes del destino
    dbConnection.query('SELECT * FROM imagenes_destino WHERE destino_id = ?', [id], (err, results) => {
      if (err) {
        console.error('Error al ejecutar la consulta de imágenes:', err);
        return res.status(500).json({ error: 'Error de la base de datos' });
      }

      dbConnection.query('SELECT * FROM comentarios WHERE destino_id = ?', [id], (err, comentarios) => {
        if (err) {
            console.error('Error al ejecutar la consulta de comentarios:', err);
            return res.status(500).json({ error: 'Error de la base de datos' });
        }
        res.render('destino', { result: result[0], results: results, comentarios: comentarios, reservaConfirmada: reservaConfirmada, comentarioConfirmado: comentarioConfirmado });
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
      console.error('Error al ejecutar la consulta:', err);
      res.status(500).json({ error: 'Error de la base de datos' });
      return;
    }
    // Renderiza la vista "index.ejs" con los resultados como datos
    res.render('index', { results: results });
  });
});

// Ruta para manejar la reserva
app.post('/destino/:id/reservar', (req, res) => {
  const { nombre, email, fecha_reserva } = req.body;
  const id = req.params.id;

  // Inserta los datos en la base de datos
  dbConnection.query('INSERT INTO reservas (destino_id, nombre_cliente, correo_cliente, fecha_reserva) VALUES (?, ?, ?, ?)', [id, nombre, email, fecha_reserva], (err, result) => {
    if (err) {
      console.error('Error al insertar reserva:', err);
      return res.redirect(`/destino/${id}?reserva=null`);
    }

    console.log('Reserva insertada correctamente en la base de datos.');
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
      console.error('Error al insertar comentario:', err);
      return res.redirect(`/destino/${id}?comentario=null`);
    }

    console.log('Comentario insertado correctamente en la base de datos.');
    res.redirect(`/destino/${id}?comentario=confirmada`);
  });
});


app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});

app.get('/registro', (req, res) => {
  res.render('registro');
});

app.post('/registro', (req, res) => {
  const { nombre, apellidos, correo, username, password } = req.body;

  const checkUsernameQuery = 'SELECT * FROM usuarios WHERE username = ?';
  db.query(checkUsernameQuery, [username], (checkUsernameErr, checkUsernameResult) => {
    if (checkUsernameErr) {
      console.error('Error al comprobar el nombre de usuario:', checkUsernameErr);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    if (checkUsernameResult.length > 0) {
      console.error('Error al insertar comentario:', err);
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
      console.error('Error al insertar en la base de datos:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    console.log('Usuario registrado correctamente en la base de datos');
    return res.status(200).json({ message: 'Registro exitoso.' });
  });
  
});
