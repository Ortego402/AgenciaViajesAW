"use strict";

const DAOUser = require('../dao/DAOUser');
const bcrypt = require('bcrypt');

class UserSA {
    constructor(pool) {
        this.DAOUser = new DAOUser(pool);
    }

    mostrarPerfil(req, res, callback) {
        const username = req.session.username;
        this.DAOUser.checkUsername(username, (err, result) => {
            return callback(err, result);
        });
    }

    actualizarPerfil(req, res, callback) {
        const { nombre, apellidos, correo, username } = req.body;

        this.DAOUser.updateUser(req, username, nombre, apellidos, correo, (err) => {
            if (err) {
                return callback(err);
            }
            else {
                req.session.username = username;
                return callback("Perfil actualizado.");
            }
        });
    }

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

    eliminarReserva(req, res, callback) {
        const idReserva = req.body.reservaId;
        this.DAOUser.eliminarReserva(idReserva, (err, mensaje) => {
            if (err) {
                return callback(err);
            }
            return callback(null, mensaje);
        });
    }

    checkUsername(username, callback) {
        this.DAOUser.checkUsername(username, (err, result) => {
            return callback(err, result);
        });
    }

    registerUser(nombre, apellido, correo, username, password, callback) {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return callback('Error al hashear la contraseña', null);
            }

            this.DAOUser.insertUser(nombre, apellido, correo, username, hash, (err, result) => {
                return callback(err, result);
            });
        });
    }

    iniciarSesion(req, res, callback) {
        const { username, password } = req.body;

        this.DAOUser.getUserByUsername(username, (err, user) => {
            if (err) {
                return callback(err);
            } else {
                bcrypt.compare(password, user.password, (bcryptErr, result) => {
                    if (bcryptErr) {
                        return callback('Error al comparar contraseñas.');
                    } else if (result) {
                        req.session.username = username;
                        req.session.email = user.correo;
                        return callback(null); // Pasa null si no hay errores
                    } else {
                        return callback('Contraseña incorrecta.');
                    }
                });
            }
        });
    }

}



module.exports = UserSA;
