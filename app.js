const express = require('express');
const session = require('express-session');
const router = require('./app/router/router'); // Importa el enrutador principal
const path = require("path");

const app = express();
const port = 3000;

// Configuración de la sesión
app.use(session({
  secret: 'Epicscape', // Secreto para firmar la cookie de sesión
  resave: false,
  saveUninitialized: true
}));

// Middleware para manejar datos de formularios
app.use(express.urlencoded({ extended: true }));

// Configuración del motor de vistas y carpeta de vistas
app.set('view engine', 'ejs'); // Motor de vistas EJS
app.set("views", path.join(__dirname, "/app/views")); // Carpeta de vistas

// Middleware para archivos estáticos (CSS, imágenes, etc.)
app.use(express.static('public'));

// Usa el enrutador principal en la ruta raíz
app.use('/', router);

// Inicia el servidor en el puerto especificado
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
