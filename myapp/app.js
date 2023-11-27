var createError = require('http-errors');
const config = require("./config/dbConfig");
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var mysqlsession = require("express-mysql-session");
var MySQLStore = mysqlsession(session);
var sessionStore = new MySQLStore(config.mysqlConfig);

const destinoRouter = require('./routes/destinos');
var usersRouter = require('./routes/users');

const app = express();
const port = 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // Parse application/x-www-form-urlencoded
app.use(cookieParser());

// Configuración de la sesión
app.use(session({
  secret: 'Epicscape', // Secreto para firmar la cookie de sesión
  resave: false,
  saveUninitialized: true,
  store: sessionStore
}));

// Configuración del motor de vistas y carpeta de vistas
app.set('view engine', 'ejs'); // Motor de vistas EJS
app.set("views", path.join(__dirname, 'views')); // Carpeta de vistas

// Middleware para archivos estáticos (CSS, imágenes, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Usa los enrutadores
app.use('/', destinoRouter); // Ruta raíz ahora manejada por el enrutador de destinos
app.use('/users', usersRouter); // Cambiado a '/users' para evitar conflictos

// Captura el error 404 y lo pasa al manejador de errores
app.use(function (req, res, next) {
  next(createError(404));
});

// Manejador de errores
app.use(function (err, req, res, next) {
  // Establece las variables locales, solo proporcionando el error en desarrollo
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Renderiza la página de error
  res.status(err.status || 500);
  res.render('error.ejs');
});

// Inicia el servidor en el puerto especificado
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

module.exports = app;
