const express = require('express');
const router = express.Router();
const mysql = require("mysql");
const config = require("../../config/dbConfig");
const UserSA = require("../controller/SAUser");
const DestinoSA = require("../controller/SADestino");

// Crear un pool de conexiones a la base de datos de MySQL 
const pool = mysql.createPool(config.mysqlConfig);
const userSA = new UserSA(pool);
const destinoSA = new DestinoSA(pool);

// Rutas para mostrar diferentes vistas

// Página principal
router.get('/', (req, res) => {
    destinoSA.mostrarDestinos(req, res, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error de la base de datos' });
        }
        return res.render('home', { results: results, session: req.session });
    });
});

// Página de búsqueda de destinos
router.get('/buscar', (req, res) => {
    destinoSA.buscarDestinos(req, res, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error de la base de datos' });
        }
        return res.render('home', { results: results, session: req.session });
    });
});

// Página de destinos populares
router.get('/populares', (req, res) => {
    return res.render("populares", { session: req.session });
});

// Página "Nosotros"
router.get('/nosotros', (req, res) => {
    return res.render("nosotros", { session: req.session });
});

// Página de servicios
router.get('/servicios', (req, res) => {
    return res.render("servicios", { session: req.session });
});

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
    userSA.eliminarReserva(idReserva, (err) => {
        if (err) {
            return res.status(500).send('Error al eliminar la reserva');
        }
        return res.redirect('/reservas_usuario');
    });
});

// Mostrar reservas del usuario
router.get('/reservas_usuario', (req, res) => {
    userSA.obtenerReservasUser(req, res, (err, results) => {
        return res.render('reservas', { session: req.session, results: results });
    });
});

// Página de perfil del usuario
router.get('/perfil', (req, res) => {
    const mensaje = req.query.mensaje || "";
    userSA.mostrarPerfil(req, res, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error de la base de datos' });
        }
        return res.render('perfil', { result: result[0], session: req.session, mensaje: mensaje });
    });
});

// Actualizar perfil del usuario
router.post('/actualizar_perfil', (req, res) => {
    userSA.actualizarPerfil(req, res, (err) => {
        res.redirect('/perfil?mensaje=' + encodeURIComponent(err));
    });
});

// Registrar nuevo usuario
router.post('/registrar', (req, res) => {
    const { nombre, apellido, username, password, confirmPassword } = req.body;

    userSA.checkUsername(username, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        if (result.length > 0) {
            return res.render('registro', { mensaje: 'El nombre de usuario ya existe.', username, nombre, apellido });
        }

        if (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password) || !/\W/.test(password) || password !== confirmPassword) {
            return res.render('registro', { mensaje: 'Las credenciales no cumplen con los requisitos.', username, nombre, apellido });
        }

        userSA.registerUser(nombre, apellido, username, password, (err, result) => {
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
    userSA.iniciarSesion(req, res, (err) => {
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

// Publicar comentario en un destino específico
router.post('/:id/comentarios', (req, res) => {
    destinoSA.comentarDestino(req, res, (err) => {
        return res.redirect(`/${req.params.id}?mensaje=${encodeURIComponent(err)}`);
    });
});

// Reservar un destino específico
router.post('/:id/reservar', (req, res) => {
    destinoSA.reservarDestino(req, res, (err) => {
        return res.redirect(`/${req.params.id}?mensaje=${encodeURIComponent(err)}`);
    });
});

// Mostrar un destino específico
router.get('/:id', (req, res) => {
    const mensaje = req.query.mensaje || '';
    destinoSA.mostrarDestino(req, res, (err, result, results, comentarios, mensajeDestino) => {
        if (err) {
            return res.status(500).json({ error: 'Error de la base de datos' });
        }
        return res.render('destino', { result: result, results: results, comentarios: comentarios, session: req.session, mensaje: mensaje });
    });
});

module.exports = router;
