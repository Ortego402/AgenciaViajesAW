const mysql = require('mysql');

const dbConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'practicavoluntaria'
});

// Conecta a la base de datos
dbConnection.connect((err) => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos');
});

// Exporta el objeto de conexión y otras funciones relacionadas con la base de datos
module.exports = dbConnection;
