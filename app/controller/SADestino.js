const DAODestino = require('../dao/DAODestino');

class DestinoSA {

    constructor(pool) {
        this.DAODestino = new DAODestino(pool);
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


}

module.exports = DestinoSA;
