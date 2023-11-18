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
  const searchTerm = req.query.nombreBuscar;
  daoDestino.searchDestinos(searchTerm, (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'Error de la base de datos' });
      }
      return res.render('home', { results: results, session: req.session });
  });
});

// Publicar comentario en un destino específico
router.post('/:id/comentarios', (req, res) => {
  const { comentario } = req.body;
  const id = req.params.id;

  daoDestino.insertarComentario(id, req.session.username, comentario, (err) => {
      daoDestino.getComentariosByDestinoId(id, (err, comentarios) => {
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
  const { fecha_reserva } = req.body;
  const id = req.params.id;
  
  daoDestino.insertarReserva(id, req.session.username, fecha_reserva, (err) => {
      return res.redirect(`/${req.params.id}?mensaje=${encodeURIComponent(err)}`);
  });
});

// Mostrar un destino específico
router.get('/:id', (req, res) => {

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

  // Obtener información del destino
  this.DAODestino.getDestinoById(id, (err, result) => {
      if (err) {
          callback(err, null, null, null, null);
      }

      // Obtener imágenes del destino
      this.DAODestino.getImagenesByDestinoId(id, (err, results) => {
          if (err) {
              callback(err, null, null, null, null);
          }

          // Obtener comentarios del destino
          this.DAODestino.getComentariosByDestinoId(id, (err, comentarios) => {
              if (err) {
                  callback(err, null, null, null, null);
              }
              else{
                  callback(null, result, results, comentarios, mensaje);
              }
          });
      });
  });

  daoDestino.getDestinoById(id, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error de la base de datos' });
      }
      
      // Obtener imágenes del destino
      this.DAODestino.getImagenesByDestinoId(id, (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Error de la base de datos' });
        }

        // Obtener comentarios del destino
        this.DAODestino.getComentariosByDestinoId(id, (err, comentarios) => {
          if (err) {
            return res.status(500).json({ error: 'Error de la base de datos' });
          }
          else{
            return res.render('destino', { result: result, results: results, comentarios: comentarios, session: req.session, mensaje: mensaje });
          }
        });
      });
    });
  });

module.exports = router;
