const express = require('express');
const router = express.Router();
const mysql = require("mysql");
const config = require("../config/dbConfig");
const DAODestino = require("../dao/DAODestino");

// Crear un pool de conexiones a la base de datos de MySQL 
const pool = mysql.createPool(config.mysqlConfig);

daoDestino = new DAODestino(pool);

// Página principal
router.get('/', (req, res) => {
  daoDestino.mostrarDestinos(req, res, (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'Error de la base de datos' });
      }
      return res.render('home', { results: results, session: req.session });
  });
});

// Página de destinos populares
router.get('/populares', (req, res) => {
  return res.render("populares", { session: req.session });
});

// Página "Nosotros"
router.get('/nosotros', (req, res) => {
  return res.render("nosotros", { session: req.session });
});

// Página de servicios
router.get('/servicios', (req, res) => {
  return res.render("servicios", { session: req.session });
});


// Página de búsqueda de destinos
router.get('/buscar', (req, res) => {
  daoDestino.buscarDestinos(req, res, (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'Error de la base de datos' });
      }
      return res.render('home', { results: results, session: req.session });
  });
});

// Publicar comentario en un destino específico
router.post('/:id/comentarios', (req, res) => {
  daoDestino.comentarDestino(req, res, (err) => {
      daoDestino.obtenerComentarios(req.params.id, (err, comentarios) => {
          if (err) {
              console.error('Error de la base de datos:', err);
              return res.status(500).json({ error: 'Error de la base de datos' });
          }

          // Renderizar solo la lista de comentarios si la solicitud es AJAX
          if (req.xhr) {
              return res.render('comentarios-lista', { comentarios: comentarios }, (err, html) => {
                  if (err) {
                      console.error('Error al renderizar la vista parcial:', err);
                      return res.status(500).json({ error: 'Error al renderizar la vista parcial' });
                  }

                  // Enviar solo el HTML de la vista parcial
                  return res.send(html);
              });
          }

          return res.redirect(`/${req.params.id}?mensaje=${encodeURIComponent(err)}`);
      });
  });
});

// Reservar un destino específico
router.post('/:id/reservar', (req, res) => {
  daoDestino.reservarDestino(req, res, (err) => {
      return res.redirect(`/${req.params.id}?mensaje=${encodeURIComponent(err)}`);
  });
});

// Mostrar un destino específico
router.get('/:id', (req, res) => {
  const mensaje = req.query.mensaje || '';
  daoDestino.mostrarDestino(req, res, (err, result, results, comentarios, mensajeDestino) => {
      if (err) {
          return res.status(500).json({ error: 'Error de la base de datos' });
      }
      return res.render('destino', { result: result, results: results, comentarios: comentarios, session: req.session, mensaje: mensaje });
  });
});

module.exports = router;
