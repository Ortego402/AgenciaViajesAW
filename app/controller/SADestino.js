const DAODestino = require('../dao/DAODestino');

class DestinoSA {

    constructor(pool) {
        this.DAODestino = new DAODestino(pool);
    }

    // Método para mostrar todos los destinos
    mostrarDestinos(req, res, callback) {
        this.DAODestino.getAllDestinos((err, results) => {
            if (err) {
                callback(err);
            } else {
                callback(null, results);
            }
        });
    }

    // Método para mostrar un destino específico con sus imágenes y comentarios
    mostrarDestino(req, res, callback) {
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
    }

    // Método para buscar destinos por nombre o descripción
    buscarDestinos(req, res, callback) {
        const searchTerm = req.query.nombreBuscar;
        this.DAODestino.searchDestinos(searchTerm, (err, destinos) => {
            if (err) {
                callback(err, null);
            }
            callback(null, destinos);
        });
    }

    // Método para reservar un destino
    reservarDestino(req, res, callback) {
        const { fecha_reserva } = req.body;
        const id = req.params.id;
    
        this.DAODestino.insertarReserva(id, req.session.username, fecha_reserva, (err) => {
            if (err) {
                return callback("¡Ups! Algo salió mal, vuelve a intentarlo más tarde.");
            }
            return callback("Reserva realizada con éxito.");
        });
    }

    // Método para dejar un comentario en un destino
    comentarDestino(req, res, callback) {
        const { comentario } = req.body;
        const id = req.params.id;

        this.DAODestino.insertarComentario(id, req.session.username, comentario, (err, result) => {
            if (err) {
                return callback("¡Ups! Algo salió mal, vuelve a intentarlo más tarde.");
            }
            return callback("Comentario realizado con éxito.");
        });
    }
}

module.exports = DestinoSA;
