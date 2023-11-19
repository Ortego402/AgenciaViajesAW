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
  daoDestino.getAllDestinos((err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error de la base de datos' });
    }

    return res.render('home.ejs', { results: results, session: req.session });
  });
});

// Página de destinos populares
router.get('/populares', (req, res) => {

  return res.render("populares.ejs", { session: req.session });

});

// Página "Nosotros"
router.get('/nosotros', (req, res) => {
  return res.render("nosotros.ejs", { session: req.session });
});

// Página de servicios
router.get('/servicios', (req, res) => {

  return res.render("servicios.ejs", { session: req.session });

});


// Página de búsqueda de destinos
router.get('/buscar', (req, res) => {
  const searchTerm = req.query.nombreBuscar;
  daoDestino.searchDestinos(searchTerm, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error de la base de datos' });
    }
    return res.render('home.ejs', { results: results, session: req.session });

  });
});

// Publicar comentario en un destino específico
router.post('/:id/comentarios', (req, res) => {
  const { comentario } = req.body;
  const id = req.params.id;
  daoDestino.insertarComentario(id, req.session.username, comentario, (err) => {
      return res.redirect(`/${req.params.id}?comentario=${encodeURIComponent(err)}`);
    });
  });

// Reservar un destino específico
router.post('/:id/reservar', (req, res) => {
  const { fecha_reserva } = req.body;
  const id = req.params.id;

  daoDestino.insertarReserva(id, req.session.username, fecha_reserva, (err) => {
    return res.redirect(`/${req.params.id}?reserva=${encodeURIComponent(err)}`);
  });
});

// Mostrar un destino específico
router.get('/:id', (req, res) => {
  console.log(req.query.reserva)
  console.log(req.query.comentario)
  const id = req.params.id;
  const reservaConfirmada = req.query.reserva === 'confirmada';
  const comentarioConfirmado = req.query.comentario === 'confirmada';

  let mensaje = '';
  if (reservaConfirmada) {
    mensaje = '¡Reserva completada! Gracias por realizar la reserva.';
  } else if (comentarioConfirmado) {
    mensaje = 'Comentario realizado correctamente.';
  } else if (req.query.reserva === 'null' || req.query.comentario === 'null') {
    mensaje = '¡Ups! Ha ocurrido un error al realizar la acción.';
  }

    daoDestino.getDestinoById(id, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error de la base de datos 1' });
      }

      // Obtener imágenes del destino
      daoDestino.getImagenesByDestinoId(id, (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Error de la base de datos 2' });
        }

        // Obtener comentarios del destino
        daoDestino.getComentariosByDestinoId(id, (err, comentarios) => {

          if (err) {
            return res.status(500).json({ error: 'Error de la base de datos 3' });
          }
          else {
            return res.render('destino.ejs', { result: result, results: results, comentarios: comentarios, session: req.session, mensaje: mensaje });
          }
        });
      });
    });
  });


module.exports = router;
