
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
INSERT INTO `destinos` (`id`, `nombre`, `descripcion`, `imagen`, `precio`) VALUES
(1, 'Playa de Cancún', 'Hermosa playa en México', 'https://www.barcelo.com/guia-turismo/wp-content/uploads/2021/03/riviera-maya-cancun-pal.jpg', '500.00'),
(2, 'Torre Eiffel', 'Icono de París', 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Paris_-_Eiffelturm_und_Marsfeld2.jpg', '75.50'),
(3, 'Machu Picchu', 'Antigua ciudad inca en Perú', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Machu_Picchu%2C_Peru_%282018%29.jpg/400px-Machu_Picchu%2C_Peru_%282018%29.jpg', '200.00'),
(4, 'Gran Cañón', 'Impresionante cañón en Estados Unidos', 'https://grandcanyonwest.com/wp-content/uploads/SkwalkHero_B.jpg', '120.75'),
(5, 'Santorini, Grecia', 'Isla con arquitectura única', 'https://cdn-3.expansion.mx/dims4/default/ea8e170/2147483647/strip/true/crop/900x580+0+0/resize/1200x773!/format/webp/quality/60/?url=https%3A%2F%2Fcdn-3.expansion.mx%2F92%2F921b3e3b832955a23cc7baf7dfc74aae%2FSantorini-Grecia.jpg', '350.00'),
(6, 'La Gran Muralla China', 'Maravilla arquitectónica histórica', 'https://static.nationalgeographicla.com/files/styles/image_3200/public/nationalgeographic2710344.jpg?w=1900&h=1272', '180.25'),
(7, 'Bora Bora, Polinesia Francesa', 'Paraíso tropical en el Pacífico', 'https://imagenes.elpais.com/resizer/AL_nzRr8ImurbojoC6T2q4QYoPU=/1960x1470/filters:focal(734x629:744x639)/cloudfront-eu-central-1.images.arcpublishing.com/prisa/KAJZQ2KMBZH35BKMXIOIMD23X4.jpg', '750.00'),
(8, 'Marrakech, Marruecos', 'Ciudad llena de colores y cultura', 'https://images.musement.com/cover/0153/55/marrakech-jpg_header-15254531.jpg?w=1200&h=630&q=95&fit=crop', '280.00'),
(9, 'Egipto', 'Las piramides lo mas iconico del pais', 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Egypt.Giza.Sphinx.02.jpg', '280.00'),
(10, 'Nueva York, Estados Unidos', 'La Gran Manzana', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg/1200px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg', '450.00'),
(11, 'Roma, Italia', 'Cuna de la civilización', 'https://img2.rtve.es/i/?w=1600&i=1674749554354.jpg', '300.00'),
(12, 'Bangkok, Tailandia', 'La ciudad de los templos', 'https://content.r9cdn.net/rimg/dimg/26/5b/01e97574-city-26166-1592813274a.jpg?width=1366&height=768&xhint=1038&yhint=725&crop=true', '220.00'),
(13, 'Sidney, Australia', 'Maravilla en Oceanía', 'https://gostudyaus.es/wp-content/uploads/2018/09/SYD_header.jpg', '550.00'),
(14, 'Dubái, Emiratos Árabes Unidos', 'Lujo y modernidad en el desierto', 'https://enkanaservices.es/wp-content/uploads/2023/01/destacada-vivir-trabajar-dubai.jpg.webp', '700.00'),
(15, 'Kioto, Japón', 'Cultura y tradición japonesa', 'https://cdn.getyourguide.com/img/location/5d079d304c0d5.jpeg/99.jpg', '350.00'),
(16, 'Barcelona, España', 'Arte y arquitectura en cada esquina', 'https://media.traveler.es/photos/63838947050e0f92cd80c982/16:9/w_2560%2Cc_limit/GettyImages-1392907424.jpg', '280.00'),
(17, 'Cairo, Egipto', 'Historia antigua y misterio', 'https://www.egipto.net/f/egipto/egipto/guia/el-cairo.jpg', '320.00'),
(18, 'Praga, República Checa', 'La ciudad de las cien torres', 'https://images.hola.com/imagenes/viajes/20210915196086/praga-experiencias-ciudad-alrededores/0-994-736/panoramica-praga-m.jpg?tx=w_680', '260.00');

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