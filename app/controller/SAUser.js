"use strict";

const DAOUser = require('../dao/DAOUser');
const bcrypt = require('bcrypt');

class UserSA {
    constructor(pool) {
        this.DAOUser = new DAOUser(pool);
    }


    // Método para obtener las reservas del usuario
    obtenerReservasUser(req, res, callback) {
        const username = req.session.username;

        this.DAOUser.reservasUser(username, (err, reservas) => {
            if (err) {
                return callback(err);
            }

            // Verificar si reservas es null o undefined, y asignar un array vacío si es así
            reservas = reservas || [];

            const destinoIds = reservas.map(reserva => reserva.destino_id);
            // Obtener nombres de destinos correspondientes a los IDs de reservas
            this.DAOUser.getNombresDestinos(destinoIds, (err, nombresDestinos) => {
                if (err) {
                    return callback(err);
                }
                // Combina la información de reserva y nombres de destinos
                let reservasConNombresDestinos = [];
                reservas.forEach(reserva => {
                    const nombreDestino = nombresDestinos.find(destino => destino.id == reserva.destino_id);
                    const fechaReserva = new Date(reserva.fecha_reserva);
                    const fechaFormateada = fechaReserva.toLocaleDateString('en-US'); // 'en-US' representa el formato YYYY/MM/DD, ajusta según tu necesidad

                    reservasConNombresDestinos.push({
                        id: reserva.id,
                        destino_nombre: nombreDestino ? nombreDestino.nombre : 'Nombre de destino no encontrado',
                        fecha_reserva: fechaFormateada
                    });
                });
                return callback(null, reservasConNombresDestinos);
            });
        });
    }



}

module.exports = UserSA;
