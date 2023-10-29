"use strict";

class DAODestinos {
    constructor(pool) {
        this.pool = pool;
    }

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

    searchDestinos(busqueda, callback) {
        console.log("hola")
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback("Error de acceso a la base de datos", null);
            } else {
                connection.query("SELECT * FROM destinos WHERE nombre LIKE ? OR descripcion LIKE ?", [`%${busqueda}%`, `%${busqueda}%`], function (err, destinos) {
                    connection.release();
                    if (err) {
                        callback("Error de acceso a la base de datos", null);
                    } else {
                        console.log(destinos)
                        callback(null, destinos);
                    }
                });
            }
        });
    }

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

    insertarReserva(idDestino, nombreCliente, correoCliente, fechaReserva, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                return callback("Error de acceso a la base de datos", null);
            } else {
                connection.query("INSERT INTO reservas (destino_id, nombre_cliente, correo_cliente, fecha_reserva) VALUES (?, ?, ?, ?)",
                    [idDestino, nombreCliente, correoCliente, fechaReserva],
                    function (err, result) {
                        connection.release();
                        if (err) {
                            return callback("Error de acceso a la base de datos", null);
                        } else {
                            return callback(null, result);
                        }
                    });
            }
        });
    }

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
                            return callback(null);
                        }
                    });
            }
        });
    }

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
