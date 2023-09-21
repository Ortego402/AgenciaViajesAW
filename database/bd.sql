
-- Tabla de Destinos Turísticos
CREATE TABLE destinos (
 id INT AUTO_INCREMENT PRIMARY KEY,
 nombre VARCHAR(255) NOT NULL,
 descripcion TEXT,
 imagen VARCHAR(255),
 precio DECIMAL(10, 2)
);

-- Tabla de Reservas de Viajes
CREATE TABLE reservas (
 id INT AUTO_INCREMENT PRIMARY KEY,
 destino_id INT,
 nombre_cliente VARCHAR(255) NOT NULL,
 correo_cliente VARCHAR(255) NOT NULL,
 fecha_reserva DATE NOT NULL,
 FOREIGN KEY (destino_id) REFERENCES destinos(id)
);

-- Tabla de Comentarios en Destinos
CREATE TABLE comentarios (
 id INT AUTO_INCREMENT PRIMARY KEY,
 destino_id INT,
 nombre_usuario VARCHAR(255) NOT NULL,
 comentario TEXT NOT NULL,
 fecha_comentario TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (destino_id) REFERENCES destinos(id)
);

-- Insertar datos en la Tabla de Destinos Turísticos
INSERT INTO destinos (nombre, descripcion, imagen, precio) VALUES
('Playa de Cancún', 'Hermosa playa en México', 'cancun.jpg', 500.00),
('Torre Eiffel', 'Icono de París', 'eiffel.jpg', 75.50),
('Machu Picchu', 'Antigua ciudad inca en Perú', 'machu_picchu.jpg', 200.00),
('Gran Cañón', 'Impresionante cañón en Estados Unidos', 'gran_canon.jpg', 120.75);

-- Insertar datos en la Tabla de Reservas de Viajes
INSERT INTO reservas (destino_id, nombre_cliente, correo_cliente, fecha_reserva) VALUES
(1, 'Juan Pérez', 'juan@example.com', '2023-09-25'),
(2, 'María González', 'maria@example.com', '2023-10-10'),
(3, 'Pedro Ramírez', 'pedro@example.com', '2023-11-05'),
(4, 'Luisa Torres', 'luisa@example.com', '2023-12-20');

-- Insertar datos en la Tabla de Comentarios en Destinos
INSERT INTO comentarios (destino_id, nombre_usuario, comentario) VALUES
(1, 'Ana López', 'Me encantó la playa de Cancún. Definitivamente volveré.'),
(1, 'Carlos Rodríguez', 'El clima en Cancún es perfecto para unas vacaciones relajantes.'),
(2, 'Elena Martínez', 'La Torre Eiffel es impresionante, especialmente de noche.'),
(3, 'Javier Sánchez', 'Machu Picchu es un lugar mágico, vale la pena visitarlo.'),
(4, 'Sofía Fernández', 'El Gran Cañón es asombroso, las vistas son espectaculares.');
