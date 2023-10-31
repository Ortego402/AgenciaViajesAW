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
                return callback('El nombre de usuario no existe.', null);
            } else {
                return callback(null, results[0]);
            }
        });
    }
    

    checkUsername(username, callback) {
        const checkUsernameQuery = 'SELECT * FROM usuarios WHERE username = ?';
        this.pool.query(checkUsernameQuery, [username], (err, result) => {
            return callback(err, result);
        });
    }

    insertUser(nombre, apellidos, correo, username, hash, callback) {

        this.pool.getConnection(function (err, connection) {
            if (err) {
                return callback('Error de acceso a la base de datos', null);
            }

            connection.query('INSERT INTO usuarios (nombre, apellidos, correo, username, password) VALUES (?, ?, ?, ?, ?)', [nombre, apellidos, correo, username, hash], (err, result) => {
                connection.release();
                if (err) {
                    return callback('Error al insertar usuario en la base de datos', null);
                }
                return callback(null, result);
            });
        });
        
    }

    updateUser(req, username, nombre, apellidos, correo, callback) {
        const checkUsernameQuery = 'SELECT * FROM usuarios WHERE username = ?';
        this.pool.getConnection(function (err, connection) {
            if (err) {
                return callback('Error de acceso a la base de datos');
            }

            connection.query(checkUsernameQuery, [username], (checkUsernameErr, checkUsernameResult) => {
                connection.release();
                if (checkUsernameErr) {
                    return callback('Error de acceso a la base de datos');
                }
                // Comprobar el user name según sus requisitos
                if (checkUsernameResult.length > 0 && username !== req.session.username) {
                    return callback('El nombre de usuario ya existe.');
                }
                // Actualizar datos en la base de datos
                connection.query('UPDATE usuarios SET nombre = ?, apellidos = ?, correo = ?, username = ? WHERE username = ?', [nombre, apellidos, correo, username, req.session.username], (err, result) => {
                    if (err) {
                        return callback('Error al actualizar usuario en la base de datos');
                    }
                    else{
                        return callback(null);
                    }
                });
            });
        });
    }

    reservasUser(username, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                return callback("Error de acceso a la base de datos", null);
            } else {
                connection.query("SELECT * FROM reservas WHERE nombre_cliente = ?", [username], function (err, results) {
                    connection.release();
                    if (err) {
                        return callback("Error de acceso a la base de datos", null);
                    } else {
                        return callback(null, results);
                    }
                });
            }
        });
    }

    getNombresDestinos(id_destino, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                return callback("Error de acceso a la base de datos", null);
            } else {
                connection.query("SELECT id, nombre FROM destinos WHERE id IN (?)", [id_destino], function (err, results) {
                    connection.release();
                    if (err) {
                        return callback("Error de acceso a la base de datos", null);
                    } else {
                        return callback(null, results);
                    }
                });
            }
        });
    }

    eliminarReserva(idReserva, callback) {
        const query = 'DELETE FROM reservas WHERE id = ?';
        this.pool.query(query, [idReserva], (err, result) => {
            if (err) {
                return callback('Error al eliminar la reserva', null);
            }
            return callback(null, 'Reserva eliminada correctamente');
        });
    }
}

module.exports = DAOUsuarios;
