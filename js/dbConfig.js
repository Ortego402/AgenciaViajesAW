// Importa el módulo mysql
const mysql = require('mysql');

// Configuración de la conexión a la base de datos utilizando un pool
const dbConnection = mysql.createPool({
  connectionLimit: 10,     // Límite de conexiones en el pool
  host: 'localhost',       // Dirección del servidor de la base de datos
  user: 'root',            // Nombre de usuario de la base de datos
  password: '',            // Contraseña de la base de datos
  database: 'viajes'       // Nombre de la base de datos a la que conectarse
});

// Exporta el objeto del pool de conexiones y otras funciones relacionadas con la base de datos
module.exports = dbConnection;
