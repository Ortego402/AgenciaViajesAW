const express = require('express');
const session = require('express-session');
const router = require('./app/router/router'); // Importa el enrutador principal
const path = require("path");

const app = express();
const port = 3000;

app.use(session({
  secret: 'Epicscape',
  resave: false,
  saveUninitialized: true
}));

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "/app/views"));
app.use(express.static('public'));
app.use('/', router); // Usa el enrutador principal en la ruta raíz

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
