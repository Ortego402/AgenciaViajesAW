
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
(1, 'Playa de Cancún', 'Descubre la hermosa Playa de Cancún en México, un paraíso de aguas cristalinas y arena blanca que te dejará sin aliento. Disfruta del sol, las actividades acuáticas y la vibrante vida nocturna. ¡Un destino inolvidable!', 'https://www.barcelo.com/guia-turismo/wp-content/uploads/2021/03/riviera-maya-cancun-pal.jpg', '500.00'),
(2, 'Torre Eiffel', 'Visita la icónica Torre Eiffel en París y disfruta de vistas panorámicas impresionantes de la Ciudad de la Luz. Sumérgete en la rica cultura parisina, prueba deliciosas crepes y explora sus encantadoras calles.', 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Paris_-_Eiffelturm_und_Marsfeld2.jpg', '75.50'),
(3, 'Machu Picchu', 'Embárcate en una aventura única explorando la antigua ciudad inca de Machu Picchu en Perú. Descubre los secretos de esta maravilla arqueológica y disfruta de la belleza de los Andes peruanos.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Machu_Picchu%2C_Peru_%282018%29.jpg/400px-Machu_Picchu%2C_Peru_%282018%29.jpg', '200.00'),
(4, 'Gran Cañón', 'Contempla la majestuosidad del Gran Cañón en Estados Unidos, una maravilla natural esculpida por el tiempo. Realiza emocionantes rutas de senderismo y disfruta de impresionantes vistas panorámicas.', 'https://grandcanyonwest.com/wp-content/uploads/SkwalkHero_B.jpg', '120.75'),
(5, 'Santorini, Grecia', 'Sumérgete en la arquitectura única y las vistas panorámicas de la isla de Santorini en Grecia. Explora sus pintorescos pueblos blancos, disfruta de la deliciosa comida mediterránea y relájate en sus playas de aguas cristalinas.', 'https://cdn-3.expansion.mx/dims4/default/ea8e170/2147483647/strip/true/crop/900x580+0+0/resize/1200x773!/format/webp/quality/60/?url=https%3A%2F%2Fcdn-3.expansion.mx%2F92%2F921b3e3b832955a23cc7baf7dfc74aae%2FSantorini-Grecia.jpg', '350.00'),
(6, 'La Gran Muralla China', 'Explora la maravilla arquitectónica histórica de la Gran Muralla China. Camina por siglos de historia y admira los paisajes montañosos mientras te sumerges en la cultura china.', 'https://static.nationalgeographicla.com/files/styles/image_3200/public/nationalgeographic2710344.jpg?w=1900&h=1272', '180.25'),
(7, 'Bora Bora, Polinesia Francesa', 'Relájate en el paraíso tropical de Bora Bora en la Polinesia Francesa. Disfruta de bungalows sobre el agua, aguas cristalinas, actividades de snorkel y una experiencia inolvidable en el Pacífico.', 'https://imagenes.elpais.com/resizer/AL_nzRr8ImurbojoC6T2q4QYoPU=/1960x1470/filters:focal(734x629:744x639)/cloudfront-eu-central-1.images.arcpublishing.com/prisa/KAJZQ2KMBZH35BKMXIOIMD23X4.jpg', '750.00'),
(8, 'Marrakech, Marruecos', 'Descubre la vibrante ciudad de Marrakech en Marruecos, llena de colores y cultura. Explora los zocos, visita los palacios históricos y disfruta de la hospitalidad marroquí en este destino fascinante.', 'https://images.musement.com/cover/0153/55/marrakech-jpg_header-15254531.jpg?w=1200&h=630&q=95&fit=crop', '280.00'),
(9, 'Egipto', 'Viaja en el tiempo y explora las icónicas pirámides de Egipto, el legado de una antigua civilización. Descubre la historia, la cultura y los tesoros del antiguo Egipto en este emocionante viaje.', 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Egypt.Giza.Sphinx.02.jpg', '280.00'),
(10, 'Nueva York, Estados Unidos', 'Sumérgete en la energía de la Gran Manzana, Nueva York. Visita el Empire State Building, pasea por Central Park y disfruta de la diversidad cultural en esta ciudad que nunca duerme.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg/1200px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg', '450.00'),
(11, 'Roma, Italia', 'Explora la cuna de la civilización en Roma, Italia. Visita el Coliseo, admira el arte renacentista y disfruta de la deliciosa comida italiana en las calles de esta ciudad llena de historia.', 'https://img2.rtve.es/i/?w=1600&i=1674749554354.jpg', '300.00'),
(12, 'Bangkok, Tailandia', 'Descubre la ciudad de los templos en Bangkok, Tailandia. Visita los impresionantes templos budistas, disfruta de la comida callejera y explora la vida nocturna en esta metrópolis asiática.', 'https://content.r9cdn.net/rimg/dimg/26/5b/01e97574-city-26166-1592813274a.jpg?width=1366&height=768&xhint=1038&yhint=725&crop=true', '220.00'),
(13, 'Sidney, Australia', 'Maravíllate con la belleza de Sídney, Australia, en Oceanía. Explora la Ópera de Sídney, relájate en las playas de arena dorada y sumérgete en la cultura australiana en este emocionante destino.', 'https://gostudyaus.es/wp-content/uploads/2018/09/SYD_header.jpg', '550.00'),
(14, 'Dubái, Emiratos Árabes Unidos', 'Sumérgete en el lujo y la modernidad en el desierto de Dubái, Emiratos Árabes Unidos. Visita rascacielos impresionantes, disfruta de compras de alta gama y vive una experiencia única en Medio Oriente.', 'https://enkanaservices.es/wp-content/uploads/2023/01/destacada-vivir-trabajar-dubai.jpg.webp', '700.00'),
(15, 'Kioto, Japón', 'Explora la cultura y la tradición japonesa en Kioto, Japón. Visita templos antiguos, admira los cerezos en flor y sumérgete en la serenidad de esta encantadora ciudad japonesa.', 'https://cdn.getyourguide.com/img/location/5d079d304c0d5.jpeg/99.jpg', '350.00'),
(16, 'Barcelona, España', 'Descubre el arte y la arquitectura en cada esquina de Barcelona, España. Visita las obras maestras de Gaudí, disfruta de la comida catalana y sumérgete en la animada vida de la ciudad.', 'https://media.traveler.es/photos/63838947050e0f92cd80c982/16:9/w_2560%2Cc_limit/GettyImages-1392907424.jpg', '280.00'),
(17, 'Cairo, Egipto', 'Explora la historia antigua y el misterio en El Cairo, Egipto. Visita las pirámides de Giza, el Museo Egipcio y sumérgete en la cultura faraónica en este emocionante destino.', 'https://www.egipto.net/f/egipto/egipto/guia/el-cairo.jpg', '320.00'),
(18, 'Praga, República Checa', 'Descubre la ciudad de las cien torres en Praga, República Checa. Explora el casco antiguo, visita el famoso Reloj Astronómico y disfruta de la rica historia y la arquitectura gótica de la ciudad.', 'https://images.hola.com/imagenes/viajes/20210915196086/praga-experiencias-ciudad-alrededores/0-994-736/panoramica-praga-m.jpg?tx=w_680', '260.00');

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