const express = require('express');
const router = express.Router();
const mysql = require("mysql");
const config = require("../config/dbConfig");
const DAOUser = require("../dao/DAOUser");
const bcrypt = require('bcrypt'); // Agrega esta línea para requerir bcrypt

// Crear un pool de conexiones a la base de datos de MySQL 
const pool = mysql.createPool(config.mysqlConfig);

daoUser = new DAOUser(pool);

// Página de inicio de sesión
router.get('/login', (req, res) => {
    let mensaje = "";
    return res.render('login.ejs', { session: req.session, mensaje: mensaje });
});

// Página de registro
router.get('/registro', (req, res) => {
    let mensaje = "";
    return res.render('registro.ejs', { session: req.session, mensaje: mensaje });
});

// Eliminar reserva del usuario
router.post('/reservas_usuario', (req, res) => {
    const idReserva = req.body.reservaId;
    daoUser.eliminarReserva(idReserva, (err) => {
        if (err) {
            return res.status(500).send('Error al eliminar la reserva');
        }
        return res.redirect('/reservas_usuario');
    });
});

// Mostrar reservas del usuario
router.get('/reservas_usuario', (req, res) => {
    const username = req.session.username;
    daoUser.reservasUser(username, (err, reservas) => {        
        if (err) {
            return res.status(500).send('Error en la base de datos 123');
        }
        
        // Verificar si reservas es null o undefined, y asignar un array vacío si es así
        reservas = reservas || [];
        const destinoIds = reservas.map(reserva => reserva.destino_id);
        // Obtener nombres de destinos correspondientes a los IDs de reservas
        daoUser.getNombresDestinos(destinoIds, (err, nombresDestinos) => {
            if (err) {
                return res.status(500).send(err);
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
            return res.render('reservas.ejs', { session: req.session, results: reservasConNombresDestinos });
        });
    });
});

// Página de perfil del usuario
router.get('/perfil', (req, res) => {
    const mensaje = req.query.mensaje || "";
    daoUser.checkUsername(req.session.username, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error de la base de datos' });
        }
        return res.render('perfil.ejs', { result: result[0], session: req.session, mensaje: mensaje });
    });
});

// Actualizar perfil del usuario
router.post('/actualizar_perfil', (req, res) => {
    const { nombre, apellidos, username } = req.body;

    daoUser.updateUser(req, username, nombre, apellidos, (err)  => {
        res.redirect('/perfil?mensaje=' + encodeURIComponent(err));
    });
});

// Registrar nuevo usuario
router.post('/registrar', (req, res) => {
    const { nombre, apellido, username, password, confirmPassword } = req.body;

    daoUser.checkUsername(username, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        if (result.length > 0) {
            return res.render('registro', { mensaje: 'El nombre de usuario ya existe.', username, nombre, apellido });
        }

        if (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password) || !/\W/.test(password) || password !== confirmPassword) {
            return res.render('registro', { mensaje: 'Las credenciales no cumplen con los requisitos.', username, nombre, apellido });
        }

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return callback('Error al hashear la contraseña', null);
            }

            daoUser.insertUser(nombre, apellido, username, hash, (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Error interno del servidor' });
                }
                req.session.username = username;
    
                return res.redirect('/');
            });
        });
    });
});

// Iniciar sesión del usuario
router.post('/inicio_sesion', (req, res) => {
    const { username, password } = req.body;

    daoUser.getUserByUsername(username, (err, user) => {
        if (err) {
            return res.render('login.ejs', { mensaje: 'Usuario no encontrado.' });
        }
        else{
            bcrypt.compare(password, user.password, (bcryptErr, result) => {
                if (bcryptErr) {
                    return res.render('login.ejs', { mensaje: 'Error al comparar contraseñas.' });
                } else if (result) {
                    req.session.username = username;
                    return res.redirect('/'); // Redirige a la página principal si no hay errores
                } else {
                    return res.render('login.ejs', { mensaje: 'Contraseña incorrecta.' });
                }
            });
        }
    });
});

// Cerrar sesión del usuario
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error interno del servidor');
        }
        return res.redirect('/');
    });
});

module.exports = router;
