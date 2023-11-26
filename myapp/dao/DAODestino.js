"use strict";

// Clase DAODestinos para interactuar con la base de datos de destinos
class DAODestinos {
    constructor(pool) {
        this.pool = pool;
    }

    // Método para obtener todos los destinos desde la base de datos
    getAllDestinos(callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback("Error de acceso a la base de datos", null);
            } else {
                connection.query("SELECT * FROM destinos", function (err, destinos) {
                    connection.release();
                    if (err) {
                        callback("Error de acceso a la base de datos", null);
                    } else {
                        callback(null, destinos);
                    }
                });
            }
        });
    }

    // Método para buscar destinos por nombre o descripción desde la base de datos
    searchDestinos(busqueda, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback("Error de acceso a la base de datos", null);
            } else {
                connection.query("SELECT * FROM destinos WHERE nombre LIKE ? OR descripcion LIKE ?", [`%${busqueda}%`, `%${busqueda}%`], function (err, destinos) {
                    connection.release();
                    if (err) {
                        callback("Error de acceso a la base de datos", null);
                    } else {
                        callback(null, destinos);
                    }
                });
            }
        });
    }

    // Método para obtener un destino por su ID desde la base de datos
    getDestinoById(id, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback("Error de acceso a la base de datos", null);
            } else {
                connection.query("SELECT * FROM destinos WHERE id = ?", [id], function (err, destino) {
                    connection.release();
                    if (err) {
                        return callback("Error de acceso a la base de datos", null);
                    } else {
                        return callback(null, destino[0]);
                    }
                });
            }
        });
    }

    // Método para insertar una nueva reserva en la base de datos
    insertarReserva(idDestino, usuarioCliente, fechaReserva, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                return callback("Error de acceso a la base de datos");
            } else {
                connection.query("INSERT INTO reservas (destino_id, usuario_cliente, fecha_reserva) VALUES (?, ?, ?)",
                    [idDestino, usuarioCliente, fechaReserva],
                    function (err, result) {
                        connection.release();
                        if (err) {
                            return callback("Error de acceso a la base de datos");
                        } else {
                            return callback("confirmada");
                        }
                    });
            }
        });
    }

    // Método para insertar un nuevo comentario en la base de datos
    insertarComentario(idDestino, nombreUsuario, comentario, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                return callback("Error de acceso a la base de datos");
            } else {
                connection.query("INSERT INTO comentarios (destino_id, nombre_usuario, comentario) VALUES (?, ?, ?)",
                    [idDestino, nombreUsuario, comentario],
                    function (err, result) {
                        connection.release();
                        if (err) {
                            return callback("Error de acceso a la base de datos");
                        } else {
                            return callback("confirmada");
                        }
                    });
            }
        });
    }

    // Método para obtener las imágenes asociadas a un destino por su ID desde la base de datos
    getImagenesByDestinoId(idDestino, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                return callback("Error de acceso a la base de datos", null);
            } else {
                connection.query("SELECT * FROM imagenes_destino WHERE destino_id = ?", [idDestino], function (err, imagenes) {
                    connection.release();
                    if (err) {
                        return callback("Error de acceso a la base de datos", null);
                    } else {
                        return callback(null, imagenes);
                    }
                });
            }
        });
    }

    // Método para obtener los comentarios asociados a un destino por su ID desde la base de datos
    getComentariosByDestinoId(idDestino, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                return callback("Error de acceso a la base de datos", null);
            } else {
                connection.query("SELECT * FROM comentarios WHERE destino_id = ?", [idDestino], function (err, comentarios) {
                    connection.release();
                    if (err) {
                        return callback("Error de acceso a la base de datos", null);
                    } else {
                        return callback(null, comentarios);
                    }
                });
            }
        });
    }

}

module.exports = DAODestinos;
