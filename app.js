// Importa el módulo Express
const express = require('express');
// Importa el objeto de conexión a la base de datos desde './js/dbConfig'
const dbConnection = require('./js/dbConfig');

// Crea una instancia de Express
const app = express();
const port = 3000; // Puerto en el que se ejecutará el servidor

// Middleware para analizar las solicitudes con datos en formato de formulario
app.use(express.urlencoded({ extended: true }));

// Configura Express para usar EJS como motor de plantillas
app.set('view engine', 'ejs');

// Middleware para servir archivos estáticos desde el directorio 'public'
app.use(express.static('public'));

// Ruta para mostrar todos los destinos
app.get('/', (req, res) => {
    // Realiza una consulta a la base de datos para obtener todos los destinos
    dbConnection.query('SELECT * FROM destinos', (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error de la base de datos' });
            return;
        }
        // Renderiza la vista "home.ejs" con los resultados como datos
        res.render('home', { results: results });
    });
});

// Rutas para otras páginas
app.get('/servicios', (req, res) => {
    res.render('servicios');
});

app.get('/nosotros', (req, res) => {
    res.render('nosotros');
});

app.get('/populares', (req, res) => {
    res.render('populares');
});

app.get('/reserva', (req, res) => {
    res.render('reserva');
});

// Ruta para mostrar detalles de un destino específico
app.get('/destino/:id', (req, res) => {
    // Obtiene el ID del destino de los parámetros de la URL
    const id = req.params.id;

    // Realiza consultas a la base de datos para obtener detalles del destino y otros datos relacionados (imágenes y comentarios)
    dbConnection.query('SELECT * FROM destinos WHERE id = ?', [id], (err, result) => {
        // Maneja errores de la base de datos
        if (err) {
            return res.status(500).json({ error: 'Error de la base de datos' });
        }

        // Maneja caso donde el destino no se encuentra en la base de datos
        if (result.length === 0) {
            return res.status(404).send('Destino no encontrado');
        }

        // Consulta para obtener imágenes del destino
        dbConnection.query('SELECT * FROM imagenes_destino WHERE destino_id = ?', [id], (err, results) => {
            // Maneja errores de la base de datos
            if (err) {
                return res.status(500).json({ error: 'Error de la base de datos' });
            }

            // Consulta para obtener comentarios del destino
            dbConnection.query('SELECT * FROM comentarios WHERE destino_id = ?', [id], (err, comentarios) => {
                // Maneja errores de la base de datos
                if (err) {
                    return res.status(500).json({ error: 'Error de la base de datos' });
                }

                // Renderiza la vista 'destino.ejs' con los datos del destino, imágenes y comentarios
                res.render('destino', { result: result[0], results: results, comentarios: comentarios });
            });
        });
    });
});

// Ruta para buscar destinos por nombre o descripción
app.get('/buscar', (req, res) => {
    // Obtiene el término de búsqueda del parámetro de consulta (query parameter)
    const searchTerm = req.query.nombreBuscar;
    // Realiza la consulta a la base de datos para buscar destinos por nombre o descripción
    dbConnection.query('SELECT * FROM destinos WHERE nombre LIKE ? OR descripcion LIKE ?', [`%${searchTerm}%`, `%${searchTerm}%`], (err, results) => {
        // Maneja errores de la base de datos
        if (err) {
            res.status(500).json({ error: 'Error de la base de datos' });
            return;
        }
        // Renderiza la vista "home.ejs" con los resultados como datos
        res.render('home', { results: results });
    });
});

// Ruta para manejar la reserva de un destino específico
app.post('/destino/:id/reservar', (req, res) => {
    // Obtiene los datos del formulario de reserva
    const { nombre, email, fecha_reserva } = req.body;
    const id = req.params.id;

    // Inserta los datos de reserva en la base de datos
    dbConnection.query('INSERT INTO reservas (destino_id, nombre_cliente, correo_cliente, fecha_reserva) VALUES (?, ?, ?, ?)', [id, nombre, email, fecha_reserva], (err, result) => {
        // Maneja errores de la base de datos y redirige a la página del destino con un parámetro de consulta para mostrar mensajes al usuario
        if (err) {
            return res.redirect(`/destino/${id}?reserva=null`);
        }

        // Redirige a la página del destino con un parámetro de consulta para mostrar un mensaje de reserva confirmada al usuario
        res.redirect(`/destino/${id}?reserva=confirmada`);
    });
});

// Ruta para manejar la creación de comentarios en un destino específico
app.post('/destino/:id/comentarios', (req, res) => {
    // Obtiene los datos del formulario de comentarios
    const { nombre_usuario, comentario } = req.body;
    const id = req.params.id;

    // Inserta los datos de comentarios en la base de datos
    dbConnection.query('INSERT INTO comentarios (destino_id, nombre_usuario, comentario) VALUES (?, ?, ?)', [id, nombre_usuario, comentario], (err, result) => {
        // Maneja errores de la base de datos y redirige a la página del destino con un parámetro de consulta para mostrar mensajes al usuario
        if (err) {
            return res.redirect(`/destino/${id}?comentario=null`);
        }

        // Redirige a la página del destino con un parámetro de consulta para mostrar un mensaje de comentario confirmado al usuario
        res.redirect(`/destino/${id}?comentario=confirmado`);
    });
});

// Rutas para la página de registro
app.get('/registro', (req, res) => {
    res.render('registro');
});

// Ruta para manejar el proceso de registro de usuarios
app.post('/registro', (req, res) => {
    // Obtiene los datos del formulario de registro
    const { nombre, apellidos, correo, username, password } = req.body;

    // Realiza comprobaciones de validez para los datos del formulario (por ejemplo, si el correo tiene un formato válido, si la contraseña cumple con ciertos requisitos, etc.)

    // Inserta los datos de usuario en la base de datos (actualmente, el código contiene errores y no insertará datos correctamente)
    const query = 'INSERT INTO usuarios (nombre, apellidos, correo, username, password) VALUES (?, ?, ?, ?, ?)';
    dbConnection.query(query, [nombre, apellidos, correo, username, password], (err, result) => {
        // Maneja errores de la base de datos y envía respuestas JSON con mensajes de error o éxito
        if (err) {
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        return res.status(200).json({ message: 'Registro exitoso.' });
    });
});

// Inicia el servidor y escucha en el puerto especificado
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
