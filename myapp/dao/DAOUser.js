"use strict";
const bcrypt = require('bcrypt');

// Clase DAOUsuarios para interactuar con la base de datos de usuarios
class DAOUsuarios {
    constructor(pool) {
        this.pool = pool;
    }

    // Método para obtener un usuario por su nombre de usuario
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
    
    // Método para comprobar si un nombre de usuario ya existe en la base de datos
    checkUsername(username, callback) {
        const checkUsernameQuery = 'SELECT * FROM usuarios WHERE username = ?';
        this.pool.query(checkUsernameQuery, [username], (err, result) => {
            return callback(err, result);
        });
    }

    // Método para insertar un nuevo usuario en la base de datos
    insertUser(nombre, apellidos, username, hash, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                return callback('Error de acceso a la base de datos', null);
            }

            connection.query('INSERT INTO usuarios (nombre, apellidos, username, password) VALUES (?, ?, ?, ?)', [nombre, apellidos, username, hash], (err, result) => {
                connection.release();
                if (err) {
                    return callback('Error al insertar usuario en la base de datos', null);
                }
                return callback(null, result);
            });
        });
    }

    // Método para actualizar los datos de un usuario en la base de datos
    updateUser(req, username, nombre, apellidos, callback) {
        const checkUsernameQuery = 'SELECT * FROM usuarios WHERE username = ?';
        const updateReservasQuery = 'UPDATE reservas SET usuario_cliente = ? WHERE usuario_cliente = ?';
        this.pool.getConnection(function (err, connection) {
            if (err) {
                return callback('Error de acceso a la base de datos');
            }
    
            connection.query(checkUsernameQuery, [username], (checkUsernameErr, checkUsernameResult) => {
                if (checkUsernameErr) {
                    connection.release();
                    return callback('Error de acceso a la base de datos');
                }
    
                // Comprobar el nombre de usuario según sus requisitos
                if (checkUsernameResult.length > 0 && username !== req.session.username) {
                    connection.release();
                    return callback('El nombre de usuario ya existe.');
                }
    
                // Obtener las reservas asociadas al usuario antes de modificar el nombre de usuario
                connection.query('SELECT * FROM reservas WHERE usuario_cliente = ?', [req.session.username], (reservasErr, reservasResult) => {
                    if (reservasErr) {
                        connection.release();
                        return callback('Error al obtener las reservas del usuario');
                    }
    
                    // Actualizar datos en la base de datos
                    connection.query('UPDATE usuarios SET nombre = ?, apellidos = ?, username = ? WHERE username = ?', [nombre, apellidos, username, req.session.username], (updateUserErr, updateUserResult) => {
                        if (updateUserErr) {
                            connection.release();
                            return callback('Error al actualizar usuario en la base de datos');
                        }
    
                        // Actualizar el atributo usuario_cliente en la tabla de reservas
                        connection.query(updateReservasQuery, [username, req.session.username], (updateReservasErr, updateReservasResult) => {
                            connection.release();
                            if (updateReservasErr) {
                                return callback('Error al actualizar el atributo usuario_cliente en las reservas');
                            }
    
                            return callback("Perfil actualizado correctamente.");
                        });
                    });
                });
            });
        });
    }

    // Método para obtener las reservas de un usuario específico
    reservasUser(username, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                return callback("Error de acceso a la base de datos", null);
            } else {
                connection.query("SELECT * FROM reservas WHERE usuario_cliente = ? ORDER BY fecha_reserva asc", [username], function (err, results) {
                    connection.release();
                    if (err) {
                        console.log("--------------------------------------aqui");
                        console.log(err);
                        return callback("Error de acceso a la base de datos", null);
                    } else {
                        return callback(null, results);
                    }
                });
            }
        });
    }

    // Método para obtener los nombres de los destinos asociados a un ID específico
    getNombresDestinos(id_destino, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                return callback("Error al conectarse a la base de datos", null);
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

    // Método para eliminar una reserva por su ID
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
