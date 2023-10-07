
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

CREATE TABLE `imagenes_destino` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  destino_id INT PRIMARY KEY,
  url varchar(255) PRIMARY KEY
);


-- Insertar datos en la Tabla de Destinos Turísticos
INSERT INTO `destinos` (`id`, `nombre`, `descripcion`, `imagen`, `precio`) VALUES
(1, 'Playa de Cancún', 'Disfruta de la suave arena blanca y las aguas turquesas del Caribe en la hermosa playa de Cancún. Relájate bajo el sol tropical y explora la vibrante vida nocturna de la ciudad. Además, puedes descubrir la rica cultura maya en las cercanías, visitando antiguas ruinas y cenotes ocultos.', 'https://www.barcelo.com/guia-turismo/wp-content/uploads/2021/03/riviera-maya-cancun-pal.jpg', '500.00'),
(2, 'Torre Eiffel', 'La majestuosa Torre Eiffel, un ícono de París, te ofrece vistas panorámicas de la ciudad de la luz. Sumérgete en la historia del arte y la cultura parisina mientras paseas por los encantadores bulevares, disfrutas de la deliciosa cocina francesa y exploras museos de renombre mundial como el Louvre.', 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Paris_-_Eiffelturm_und_Marsfeld2.jpg', '75.50'),
(3, 'Machu Picchu', 'Embárcate en una aventura arqueológica en Machu Picchu, la antigua ciudad inca enclavada en los Andes peruanos. Maravíllate con la arquitectura ingeniosa y disfruta de la belleza natural que la rodea. Explora los misterios de la civilización inca mientras te sumerges en la energía única de este lugar.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Machu_Picchu%2C_Peru_%282018%29.jpg/400px-Machu_Picchu%2C_Peru_%282018%29.jpg', '200.00'),
(4, 'Gran Cañón', 'Contempla la grandeza de la naturaleza en el impresionante Gran Cañón en Estados Unidos. Las majestuosas formaciones rocosas y los paisajes deslumbrantes te dejarán sin aliento. Explora senderos escénicos, realiza emocionantes actividades al aire libre y captura vistas inolvidables en este espectacular destino.', 'https://grandcanyonwest.com/wp-content/uploads/SkwalkHero_B.jpg', '120.75'),
(5, 'Santorini, Grecia', 'Descubre la magia de Santorini, una isla con arquitectura única en Grecia. Explora encantadores pueblos blancos con tejados azules, disfruta de impresionantes vistas al mar Egeo y relájate en playas de arena volcánica. Admira hermosos atardeceres y sumérgete en la rica historia y cultura de esta isla cautivadora.', 'https://cdn-3.expansion.mx/dims4/default/ea8e170/2147483647/strip/true/crop/900x580+0+0/resize/1200x773!/format/webp/quality/60/?url=https%3A%2F%2Fcdn-3.expansion.mx%2F92%2F921b3e3b832955a23cc7baf7dfc74aae%2FSantorini-Grecia.jpg', '350.00'),
(6, 'La Gran Muralla China', 'Embárcate en un viaje a través de la historia en la Gran Muralla China, una maravilla arquitectónica histórica. Recorre kilómetros de murallas antiguas, torres de vigilancia y paisajes impresionantes. Sumérgete en la riqueza cultural de China mientras exploras este icónico sitio, testigo de siglos de civilización.', 'https://static.nationalgeographicla.com/files/styles/image_3200/public/nationalgeographic2710344.jpg?w=1900&h=1272', '180.25'),
(7, 'Bora Bora, Polinesia Francesa', 'Sumérgete en un paraíso tropical en el Pacífico con una escapada a Bora Bora, Polinesia Francesa. Relájate en lujosos bungalows sobre el agua, nada en aguas cristalinas y descubre la rica vida marina. Disfruta de la serenidad de las playas de arena blanca y explora la belleza natural de esta isla paradisíaca.', 'https://imagenes.elpais.com/resizer/AL_nzRr8ImurbojoC6T2q4QYoPU=/1960x1470/filters:focal(734x629:744x639)/cloudfront-eu-central-1.images.arcpublishing.com/prisa/KAJZQ2KMBZH35BKMXIOIMD23X4.jpg', '750.00'),
(8, 'Marrakech, Marruecos', 'Sumérgete en la ciudad de Marrakech, llena de colores y cultura en Marruecos. Explora los bulliciosos zocos, maravíllate con la arquitectura exquisita y descubre la rica tradición culinaria del norte de África. Visita palacios antiguos, mezquitas impresionantes y jardines exuberantes mientras te sumerges en la esencia de Marrakech.', 'https://images.musement.com/cover/0153/55/marrakech-jpg_header-15254531.jpg?w=1200&h=630&q=95&fit=crop', '280.00'),
(9, 'Egipto', 'Descubre las pirámides, lo más icónico de Egipto. Explora la antigua civilización egipcia mientras te maravillas con las maravillas arquitectónicas como las pirámides de Giza y la Esfinge. Sumérgete en la historia antigua y explora los tesoros de los faraones en los museos y sitios arqueológicos de este país fascinante.', 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Egypt.Giza.Sphinx.02.jpg', '280.00'),
(10, 'Nueva York, Estados Unidos', 'Descubre la energía inigualable de la Gran Manzana en Nueva York, Estados Unidos. Explora rascacielos emblemáticos, disfruta de espectáculos en Broadway, pasea por Central Park y visita museos de clase mundial como el Museo Metropolitano de Arte. Vive el estilo de vida vibrante de Nueva York en cada esquina.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg/1200px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg', '450.00'),
(11, 'Roma, Italia', 'Explora la cuna de la civilización en Roma, Italia. Sumérgete en la historia antigua mientras visitas el Coliseo, el Foro Romano y el Panteón. Disfruta de la deliciosa comida italiana, maravíllate con el arte renacentista y lánzate a la Fontana di Trevi para cumplir tus deseos en esta ciudad eterna.', 'https://img2.rtve.es/i/?w=1600&i=1674749554354.jpg', '300.00'),
(12, 'Bangkok, Tailandia', 'Embárcate en una experiencia cultural en Bangkok, la ciudad de los templos en Tailandia. Explora templos impresionantes como el Wat Arun y el Wat Pho, disfruta de la animada escena nocturna en Khao San Road y prueba la deliciosa comida callejera. Sumérgete en la espiritualidad y la autenticidad de esta fascinante ciudad asiática.', 'https://content.r9cdn.net/rimg/dimg/26/5b/01e97574-city-26166-1592813274a.jpg?width=1366&height=768&xhint=1038&yhint=725&crop=true', '220.00'),
(13, 'Sidney, Australia', 'Maravíllate con la belleza de Sidney, una maravilla en Oceanía. Explora la famosa Ópera de Sídney, relájate en las playas de arena dorada y descubre la fauna única de Australia en el Zoológico Taronga. Sumérgete en la vibrante cultura australiana mientras disfrutas de la vida urbana y la naturaleza exuberante de esta ciudad costera.', 'https://gostudyaus.es/wp-content/uploads/2018/09/SYD_header.jpg', '550.00'),
(14, 'Dubái, Emiratos Árabes Unidos', 'Descubre el lujo y la modernidad en el desierto de Dubái, Emiratos Árabes Unidos. Maravíllate con los rascacielos futuristas, disfruta de compras en lujosos centros comerciales y relájate en playas de arena blanca. Explora el desierto en safaris emocionantes y admira la arquitectura innovadora en esta ciudad cosmopolita.', 'https://enkanaservices.es/wp-content/uploads/2023/01/destacada-vivir-trabajar-dubai.jpg.webp', '700.00'),
(15, 'Kioto, Japón', 'Sumérgete en la rica cultura y tradición japonesa en Kioto, Japón. Explora antiguos templos, jardines zen y santuarios sagrados. Disfruta de la ceremonia del té, maravíllate con las geishas y admira los cerezos en flor en primavera. Kioto te invita a un viaje en el tiempo, donde la esencia de Japón cobra vida.', 'https://cdn.getyourguide.com/img/location/5d079d304c0d5.jpeg/99.jpg', '350.00'),
(16, 'Barcelona, España', 'Descubre el arte y la arquitectura en cada esquina de Barcelona, España. Visita la famosa Sagrada Familia de Gaudí, pasea por Las Ramblas y explora los encantadores barrios como El Gótico y El Born. Disfruta de la deliciosa comida catalana, maravíllate con las obras maestras de Picasso y Gaudí, y sumérgete en la vida nocturna vibrante de esta ciudad costera.', 'https://media.traveler.es/photos/63838947050e0f92cd80c982/16:9/w_2560%2Cc_limit/GettyImages-1392907424.jpg', '280.00'),
(17, 'Cairo, Egipto', 'Explora la historia antigua y el misterio en Cairo, Egipto. Visita las pirámides de Giza, la Esfinge y el Museo Egipcio. Sumérgete en el encanto caótico de los zocos y disfruta de la auténtica cocina egipcia. Cairo te transportará a la época de los faraones mientras te sumerges en la rica cultura e historia de este fascinante país.', 'https://www.egipto.net/f/egipto/egipto/guia/el-cairo.jpg', '320.00'),
(18, 'Praga, República Checa', 'Descubre la ciudad de las cien torres en Praga, República Checa. Explora el encanto medieval del casco antiguo, maravíllate con el Puente de Carlos y visita el imponente Castillo de Praga. Disfruta de la cerveza checa en acogedores bares y descubre la rica herencia cultural de esta ciudad europea única.', 'https://hips.hearstapps.com/hmg-prod/images/praga-portada-1540732106.jpg')


--
-- Volcado de datos para la tabla `imagenes_destino`
--
INSERT INTO `imagenes_destino` (`id`, `destino_id`, `url`) VALUES
(1, 1, 'https://www.barcelo.com/guia-turismo/wp-content/uploads/2021/03/riviera-maya-cancun-pal.jpg'),
(2, 2, 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Paris_-_Eiffelturm_und_Marsfeld2.jpg'),
(3, 3, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Machu_Picchu%2C_Peru_%282018%29.jpg/400px-Machu_Picchu%2C_Peru_%282018%29.jpg'),
(4, 4, 'https://grandcanyonwest.com/wp-content/uploads/SkwalkHero_B.jpg'),
(5, 5, 'https://cdn-3.expansion.mx/92/921b3e3b832955a23cc7baf7dfc74aae/Santorini-Grecia.jpg'),
(6, 6, 'https://static.nationalgeographicla.com/files/styles/image_3200/public/nationalgeographic2710344.jpg?w=1900&h=1272'),
(7, 7, 'https://imagenes.elpais.com/resizer/AL_nzRr8ImurbojoC6T2q4QYoPU=/1960x1470/filters:focal(734x629:744x639)/cloudfront-eu-central-1.images.arcpublishing.com/prisa/KAJZQ2KMBZH35BKMXIOIMD23X4.jpg'),
(8, 8, 'https://images.musement.com/cover/0153/55/marrakech-jpg_header-15254531.jpg?w=1200&h=630&q=95&fit=crop'),
(9, 9, 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Egypt.Giza.Sphinx.02.jpg'),
(10, 10, 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg/1200px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg'),
(11, 11, 'https://img2.rtve.es/i/?w=1600&i=1674749554354.jpg'),
(12, 12, 'https://content.r9cdn.net/rimg/dimg/26/5b/01e97574-city-26166-1592813274a.jpg?width=1366&height=768&xhint=1038&yhint=725&crop=true'),
(13, 13, 'https://gostudyaus.es/wp-content/uploads/2018/09/SYD_header.jpg'),
(14, 14, 'https://enkanaservices.es/wp-content/uploads/2023/01/destacada-vivir-trabajar-dubai.jpg.webp'),
(15, 15, 'https://cdn.getyourguide.com/img/location/5d079d304c0d5.jpeg/99.jpg'),
(16, 16, 'https://media.traveler.es/photos/63838947050e0f92cd80c982/16:9/w_2560%2Cc_limit/GettyImages-1392907424.jpg'),
(17, 17, 'https://www.egipto.net/f/egipto/egipto/guia/el-cairo.jpg'),
(18, 18, 'https://images.hola.com/imagenes/viajes/20210915196086/praga-experiencias-ciudad-alrededores/0-994-736/panoramica-praga-m.jpg?tx=w_680'),
(19, 1, 'https://blog.vivaaerobus.com/wp-content/uploads/2019/12/Mejores-Playas-de-Canc%C3%BAn.jpg'),
(20, 1, 'https://res.cloudinary.com/simpleview/image/upload/v1660238572/clients/quintanaroo/DJI_0184_e430b49c-47d3-4bfc-8403-9fc2df2ac133.jpg'),
(1, 1, 'https://www.barcelo.com/guia-turismo/wp-content/uploads/2021/03/riviera-maya-cancun-pal.jpg'),
(2, 2, 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Paris_-_Eiffelturm_und_Marsfeld2.jpg'),
(3, 3, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Machu_Picchu%2C_Peru_%282018%29.jpg/400px-Machu_Picchu%2C_Peru_%282018%29.jpg'),
(4, 4, 'https://grandcanyonwest.com/wp-content/uploads/SkwalkHero_B.jpg'),
(5, 5, 'https://cdn-3.expansion.mx/92/921b3e3b832955a23cc7baf7dfc74aae/Santorini-Grecia.jpg'),
(6, 6, 'https://static.nationalgeographicla.com/files/styles/image_3200/public/nationalgeographic2710344.jpg?w=1900&h=1272'),
(7, 7, 'https://imagenes.elpais.com/resizer/AL_nzRr8ImurbojoC6T2q4QYoPU=/1960x1470/filters:focal(734x629:744x639)/cloudfront-eu-central-1.images.arcpublishing.com/prisa/KAJZQ2KMBZH35BKMXIOIMD23X4.jpg'),
(8, 8, 'https://images.musement.com/cover/0153/55/marrakech-jpg_header-15254531.jpg?w=1200&h=630&q=95&fit=crop'),
(9, 9, 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Egypt.Giza.Sphinx.02.jpg'),
(10, 10, 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg/1200px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg'),
(11, 11, 'https://img2.rtve.es/i/?w=1600&i=1674749554354.jpg'),
(12, 12, 'https://content.r9cdn.net/rimg/dimg/26/5b/01e97574-city-26166-1592813274a.jpg?width=1366&height=768&xhint=1038&yhint=725&crop=true'),
(13, 13, 'https://gostudyaus.es/wp-content/uploads/2018/09/SYD_header.jpg'),
(14, 14, 'https://enkanaservices.es/wp-content/uploads/2023/01/destacada-vivir-trabajar-dubai.jpg.webp'),
(15, 15, 'https://cdn.getyourguide.com/img/location/5d079d304c0d5.jpeg/99.jpg'),
(16, 16, 'https://media.traveler.es/photos/63838947050e0f92cd80c982/16:9/w_2560%2Cc_limit/GettyImages-1392907424.jpg'),
(17, 17, 'https://www.egipto.net/f/egipto/egipto/guia/el-cairo.jpg'),
(18, 18, 'https://images.hola.com/imagenes/viajes/20210915196086/praga-experiencias-ciudad-alrededores/0-994-736/panoramica-praga-m.jpg?tx=w_680'),
(19, 1, 'https://blog.vivaaerobus.com/wp-content/uploads/2019/12/Mejores-Playas-de-Canc%C3%BAn.jpg'),
(20, 1, 'https://res.cloudinary.com/simpleview/image/upload/v1660238572/clients/quintanaroo/DJI_0184_e430b49c-47d3-4bfc-8403-9fc2df2ac133.jpg'),
(21, 18, 'https://www.disfrutapraga.com/f/republica-checa/praga/guia/praga-m.jpg'),
(22, 18, 'https://fotografias.larazon.es/clipping/cmsimages01/2019/08/09/245E4071-4F4A486FA012D0BC41F99413/98.jpgcrop=2000,1125,x0,y104&width=1900&height=1069&optimize=low&format=webply'),
(23, 17, 'https://passporterapp.com/es/blog/wp-content/uploads/2023/05/que-ver-en-el-cairo-scaled.jpg'),
(24, 17, 'https://static.nationalgeographic.es/files/styles/image_3200/public/resized-gettyimages-1411179963.jpg?w=1600&h=900'),
(25, 2, 'https://www.toureiffel.paris/sites/default/files/styles/mobile_x1_560/public/actualite/image_principale/vue_depuisjardins_webbanner_3.jpg?itok=YjGzrcsL'),
(26, 2, 'https://cdn.culturagenial.com/es/imagenes/torre-eiffel-cke.jpg'),
(27, 3, 'https://static.nationalgeographicla.com/files/styles/image_3200/public/92491.jpg?w=1600&h=900'),
(28, 3, 'https://e00-elmundo.uecdn.es/assets/multimedia/imagenes/2022/04/19/16503736092836.jpg');


