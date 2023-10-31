const express = require('express');
const router = express.Router();
const mysql = require("mysql");
const bcrypt = require('bcrypt');
const config = require("../../config/dbConfig");
const UserSA = require("../controller/UserSA");
const DestinoSA = require("../controller/DestinoSA");

// Crear un pool de conexiones a la base de datos de MySQL 
const pool = mysql.createPool(config.mysqlConfig);
const userSA = new UserSA(pool);
const destinoSA = new DestinoSA(pool);

router.get('/', (req, res) => {
    destinoSA.mostrarDestinos(req, res, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error de la base de datos' });
        }
        return res.render('home', { results: results, session: req.session });
    });
});

router.get('/buscar', (req, res) => {
    destinoSA.buscarDestinos(req, res, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error de la base de datos' });
        }
        return res.render('home', { results: results, session: req.session });
    });
});

router.get('/populares', (req, res) => {
    return res.render("populares", { session: req.session });
});

router.get('/nosotros', (req, res) => {
    return res.render("nosotros", { session: req.session });
});

router.get('/servicios', (req, res) => {
    return res.render("servicios", { session: req.session });
});

router.get('/login', (req, res) => {
    let mensaje = "";
    return res.render("login", { session: req.session, mensaje: mensaje });
});

router.get('/registro', (req, res) => {
    let mensaje = "";
    return res.render("registro", { session: req.session, mensaje: mensaje });
});

router.post('/reservas_usuario', (req, res) => {
    userSA.eliminarReserva(req, res, (err, mensaje) => {
        if (err) {
            return res.status(500).send('Error al eliminar la reserva');
        }
        return res.redirect('/reservas_usuario');
    });
});

router.get('/reservas_usuario', (req, res) => {
    userSA.obtenerReservasUser(req, res, (err, results) => {
        return res.render('reservas', { session: req.session, results: results });
    });
});

router.get('/perfil', (req, res) => {
    const mensaje = req.query.mensaje || ""; // Recupera el mensaje de la consulta, si está presente
    userSA.mostrarPerfil(req, res, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error de la base de datos' });
        }
        return res.render('perfil', { result: result[0], session: req.session, mensaje: mensaje });
    });
});

router.post('/actualizar_perfil', (req, res) => {
    userSA.actualizarPerfil(req, res, (err) => {
        res.redirect('/perfil?mensaje=' + encodeURIComponent(err));
    });
});

router.post('/registrar', (req, res) => {
    const { nombre, apellido, correo, username, password, confirmPassword } = req.body;

    userSA.checkUsername(username, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        if (result.length > 0) {
            return res.render('registro', { mensaje: 'El nombre de usuario ya existe.', username, nombre, apellido, correo });
        }

        if (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password) || !/\W/.test(password) || password !== confirmPassword) {
            return res.render('registro', { mensaje: 'Las credenciales no cumplen con los requisitos.', username, nombre, apellido, correo });
        }

        userSA.registerUser(nombre, apellido, correo, username, password, (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error interno del servidor' });
            }
            req.session.username = username;
            req.session.email = correo;

            return res.redirect('/');
        });
    });
});

router.post('/inicio_sesion', (req, res) => {
    userSA.iniciarSesion(req, res, (err) => {
        if (err) {
            return res.render('login', { mensaje: err }); // Muestra el mensaje de error
        }
        return res.redirect('/'); // Redirige a la página principal si no hay errores
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error interno del servidor');
        }
        return res.redirect('/');
    });
});

// Ruta para manejar la publicación de comentarios en un destino específico
router.post('/:id/comentarios', (req, res) => {
    destinoSA.comentarDestino(req, res, (err) => {
        return res.redirect(`/${req.params.id}?mensaje=${encodeURIComponent(err)}`);
    });
});

// Ruta para manejar la reserva de un destino específico
router.post('/:id/reservar', (req, res) => {
    destinoSA.reservarDestino(req, res, (err) => {
        return res.redirect(`/${req.params.id}?mensaje=${encodeURIComponent(err)}`);
    });
  });

router.get('/:id', (req, res) => {
    const mensaje = req.query.mensaje || ''; // Recupera el mensaje de la consulta, si está presente
    destinoSA.mostrarDestino(req, res, (err, result, results, comentarios, mensajeDestino) => {
        if (err) {
            return res.status(500).json({ error: 'Error de la base de datos' });
        }
        return res.render('destino', { result: result, results: results, comentarios: comentarios, session: req.session, mensaje: mensaje });
    });
});




module.exports = router;
