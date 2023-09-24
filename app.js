const express = require('express');
const dbConnection = require('./js/dbConfig'); // Importa la conexión a la base de datos

const app = express();
const port = 3000;

// Configura Express para usar EJS como motor de plantillas
app.set('view engine', 'ejs');

app.use(express.static('public'));

// Ruta para servir la página HTML
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

app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});

busqueda = async(req, res) => {
  const buscar = req.query.nombreBuscar; // Obtén el término de búsqueda de la consulta GET

  console.log("llegó la búsqueda");
  console.log(buscar);

  if (!buscar) {
    // Si no se proporciona un término de búsqueda, muestra una página sin resultados
    res.render('index', { results: [] });
  } else {
    // Realiza la consulta a la base de datos con el término de búsqueda
    const query = 'SELECT * FROM destinos WHERE nombre LIKE ? OR descripcion LIKE ?';
    const searchTerm = `%${buscar}%`;

    dbConnection.query(query, [searchTerm, searchTerm], (err, results) => {
      if (err) {
        console.error('Error al ejecutar la consulta:', err);
        res.status(500).json({ error: 'Error de la base de datos' });
        return;
      }

      // Renderiza la vista "index.ejs" con los resultados de la búsqueda
      res.render('index', { results: results });
    });
  }
}