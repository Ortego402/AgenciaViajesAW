function enviarComentario() {
    const destinoId = $('#destinoId').val();
    const comentarioInput = $('#comentario');
    const comentario = comentarioInput.val();

    // Realizar la petición AJAX con jQuery
    $.ajax({
        url: `/${destinoId}/comentarios`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ comentario: comentario }),
        success: function(data) {
            // Manejar la respuesta del servidor
            if (data.error) {
                mostrarMensaje('error', data.error);
            } else {
                // Actualizar la lista de comentarios en el DOM
                actualizarListaComentarios(data.comentarios);
                mostrarMensaje('success', 'Comentario publicado correctamente.');
                // Limpiar el campo de comentario
                comentarioInput.val('');
            }
        },
        error: function(error) {
            console.error('Error:', error);
            mostrarMensaje('error', '¡Ups! Ha ocurrido un error al realizar la acción.');
        }
    });
}

// Reemplaza tu función mostrarMensaje
function mostrarMensaje(tipo, mensaje) {
    const mensajeContainer = $('#mensaje-container');

    // Limpia cualquier mensaje previo
    mensajeContainer.html('');

    // Crea un elemento div para el mensaje utilizando jQuery
    const mensajeElemento = $('<div></div>').addClass(`alert alert-${tipo} bg-gradient text-dark`).attr('role', 'alert').text(mensaje);

    // Agrega el mensaje al contenedor
    mensajeContainer.append(mensajeElemento);
}

// Reemplaza tu función actualizarListaComentarios
function actualizarListaComentarios(comentarios) {
    const comentariosLista = $('.comentarios-lista');
    comentariosLista.html(''); // Limpiar la lista actual

    if (comentarios.length === 0) {
        const mensaje = $('<h6></h6>').addClass('comentario-text m-3').text('¡Sé el primero en comentar tu opinión sobre el viaje!');
        comentariosLista.append(mensaje);
    } else {
        $.each(comentarios, function(index, comentario) {
            const comentarioElemento = $('<div></div>').addClass('comentario border border-dark bg-secondary bg-opacity-25 mb-2 rounded-2').hide();

            const contenidoComentario = $('<p></p>').addClass('comentario-text').html(`
                <strong>${comentario.nombre_usuario}:</strong> ${comentario.comentario}<br>
                <small class="fecha-comentario">${comentario.fecha_comentario}</small>
            `);

            comentarioElemento.append(contenidoComentario);
            comentariosLista.append(comentarioElemento);

            // Aplicar fadeIn al comentario recién añadido
            comentarioElemento.fadeIn('slow');
        });
    }
}

// Función para mostrar la ventana emergente
function mostrarPopup() {
    document.getElementById('popup').style.display = 'block';
}

// Función para cerrar la ventana emergente
function cerrarPopup() {
    document.getElementById('popup').style.display = 'none';
}

// Función para validar el formulario de reserva
function validarFormulario() {
    var fechaReserva = new Date(document.getElementById('fecha_reserva').value);
    var fechaActual = new Date();
    // Compara las fechas
    if (fechaReserva < fechaActual) {
        alert('La fecha de reserva debe ser posterior a la fecha actual.');
        return false; // Evita que el formulario se envíe
    }
    return true; // Permite que el formulario se envíe
}