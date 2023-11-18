var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
const cookieParser = require("cookie-parser");

var destinoRouter = require('./routes/destinos');
var usersRouter = require('./routes/users');

const app = express();
const port = 3000;

app.use(cookieParser());

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
app.set("views", path.join(__dirname, 'views')); // Carpeta de vistas

// Middleware para archivos estáticos (CSS, imágenes, etc.)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Usa los enrutadores
app.use('/', destinoRouter);
app.use('/users', usersRouter);


// Inicia el servidor en el puerto especificado
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

module.exports = app;