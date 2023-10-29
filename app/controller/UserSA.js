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
            callback(err, result);
        });
    }

    actualizarPerfil(req, res, callback) {
        const { nombre, apellidos, correo, username } = req.body;

        this.DAOUser.updateUser(req, username, nombre, apellidos, correo, (err, result) => {
            if (err) {
                callback(err, null);
            }
            req.session.username = username;
            callback("Perfil actualizado.", result);
        });
    }

    checkUsername(username, callback) {
        this.DAOUser.checkUsername(username, (err, result) => {
            callback(err, result);
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
                callback(err);
            } else {
                bcrypt.compare(password, user.password, (bcryptErr, result) => {
                    if (bcryptErr) {
                        callback('Error al comparar contraseñas.');
                    } else if (result) {
                        req.session.username = username;
                        req.session.email = user.correo;
                        callback(null); // Pasa null si no hay errores
                    } else {
                        callback('Contraseña incorrecta.');
                    }
                });
            }
        });
    }

}



module.exports = UserSA;
