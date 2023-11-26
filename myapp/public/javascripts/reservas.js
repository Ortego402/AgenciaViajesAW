// Función eliminar reserva con Ajax
function eliminarReserva() {
    // Obtener el ID de la reserva desde el campo de entrada
    const reservaId = $('#reservaIdInput').val();

    // Realizar la petición AJAX con jQuery
    $.ajax({
        url: `/users/reservas_usuario`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ reservaId: reservaId }),
        success: function(data) {
            // Manejar la respuesta del servidor
            if (data.error) {
                mostrarMensaje('error', data.error);
            } else {
                mostrarMensaje('success', 'Reserva eliminada correctamente.');
                // Cerrar el modal después de eliminar la reserva
                $('#confirmarEliminarReservaModal').modal('hide');
            }
        },
        error: function(error) {
            console.error('Error:', error);
            mostrarMensaje('error', '¡Ups! Ha ocurrido un error al eliminar la reserva.');
        }
    });
}

// Agregar un evento al formulario para manejar la solicitud de eliminación
$('#eliminarReservaForm').submit(function(event) {
    event.preventDefault(); // Evitar que el formulario se envíe normalmente
    eliminarReserva(); // Llamar a la función para eliminar la reserva
});

function confirmarEliminarReserva(idReserva) {
    var inputReservaId = document.getElementById('reservaIdInput');
    inputReservaId.value = idReserva;

    var modal = new bootstrap.Modal(document.getElementById('confirmarEliminarReservaModal'));
    modal.show();
}

function cerrarModal() {
    $('#confirmarEliminarReservaModal').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
}