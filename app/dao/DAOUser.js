"use strict";
const bcrypt = require('bcrypt');

class DAOUsuarios {
    constructor(pool) {
        this.pool = pool;
    }

    getUserByUsername(username, callback) {
        const query = 'SELECT * FROM usuarios WHERE username = ?';
        this.pool.query(query, [username], (err, results) => {
            if (err || results.length === 0) {
                callback('El nombre de usuario no existe.', null);
            } else {
                callback(null, results[0]);
            }
        });
    }
    

    checkUsername(username, callback) {
        const checkUsernameQuery = 'SELECT * FROM usuarios WHERE username = ?';
        this.pool.query(checkUsernameQuery, [username], (err, result) => {
            callback(err, result);
        });
    }

    insertUser(nombre, apellidos, correo, username, password, callback) {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                callback('Error al generar el hash de la contraseña', null);
            }

            this.pool.getConnection(function (err, connection) {
                if (err) {
                    callback('Error de acceso a la base de datos', null);
                }

                connection.query('INSERT INTO usuarios (nombre, apellidos, correo, username, password) VALUES (?, ?, ?, ?, ?)', [nombre, apellidos, correo, username, hash], (err, result) => {
                    connection.release();
                    if (err) {
                        callback('Error al insertar usuario en la base de datos', null);
                    }
                    callback(null, result);
                });
            });
        });
    }

    updateUser(req, username, nombre, apellidos, correo, callback) {
        const checkUsernameQuery = 'SELECT * FROM usuarios WHERE username = ?';
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback('Error de acceso a la base de datos', null);
            }

            connection.query(checkUsernameQuery, [username], (checkUsernameErr, checkUsernameResult) => {
                connection.release();
                if (checkUsernameErr) {
                    callback('Error de acceso a la base de datos', null);
                }
                // Comprobar el user name según sus requisitos
                if (checkUsernameResult.length > 0 && username !== req.session.username) {
                    callback('El nombre de usuario ya existe', null);
                }
                // Actualizar datos en la base de datos
                connection.query('UPDATE usuarios SET nombre = ?, apellidos = ?, correo = ?, username = ? WHERE username = ?', [nombre, apellidos, correo, username, req.session.username], (err, result) => {
                    if (err) {
                        callback('Error al actualizar usuario en la base de datos', null);
                    }
                    callback(null, result);
                });
            });
        });
    }
}

module.exports = DAOUsuarios;
