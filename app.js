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

      res.render('destino', { result: result[0], results: results, reservaConfirmada: reservaConfirmada });
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
          res.redirect(`/destino/${id}?reserva=confirmada`);
    }

    // La reserva se insertó correctamente
    res.redirect(`/destino/${id}?reserva=null`);
    // return res.status(200).send('Reserva realizada con éxito');
  });
});

app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
