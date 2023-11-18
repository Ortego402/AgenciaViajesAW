const express = require('express');
const router = express.Router();
const mysql = require("mysql");
const config = require("../config/dbConfig");
const DAOUser = require("../dao/DAOUser");

// Crear un pool de conexiones a la base de datos de MySQL 
const pool = mysql.createPool(config.mysqlConfig);

daoUser = new DAOUser(pool);

// Página de inicio de sesión
router.get('/login', (req, res) => {
    let mensaje = "";
    return res.render("login", { session: req.session, mensaje: mensaje });
});

// Página de registro
router.get('/registro', (req, res) => {
    let mensaje = "";
    return res.render("registro", { session: req.session, mensaje: mensaje });
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
    daoUser.reservasUser(req, res, (err, results) => {
        return res.render('reservas', { session: req.session, results: results });
    });
});

// Página de perfil del usuario
router.get('/perfil', (req, res) => {
    const mensaje = req.query.mensaje || "";
    daoUser.getUserByUsername(req.session.username, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error de la base de datos' });
        }
        return res.render('perfil', { result: result[0], session: req.session, mensaje: mensaje });
    });
});

// Actualizar perfil del usuario
router.post('/actualizar_perfil', (req, res) => {
    daoUser.actualizarPerfil(req.body.nombre, req.body.apellidos, req.body.username, (err) => {
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

        daoUser.registerUser(nombre, apellido, username, password, (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error interno del servidor' });
            }
            req.session.username = username;

            return res.redirect('/');
        });
    });
});

// Iniciar sesión del usuario
router.post('/inicio_sesion', (req, res) => {
    daoUser.iniciarSesion(req, res, (err) => {
        if (err) {
            return res.render('login', { mensaje: err }); // Muestra el mensaje de error
        }
        return res.redirect('/'); // Redirige a la página principal si no hay errores
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
