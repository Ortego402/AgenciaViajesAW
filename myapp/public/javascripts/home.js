$(document).ready(function () {
    var $menuBtn = $('.menu-btn');
    var $menuContent = $('.menu-content');
    var $navbarLinks = $('.navbar a');

    // Función para generar las opciones del menú desplegable
    function generateDropdownOptions() {
        $menuContent.html(''); // Limpiar las opciones existentes

        $navbarLinks.each(function () {
            var $option = $('<a>').attr('href', $(this).attr('href')).text($(this).text()).addClass('dropdown-item');
            $menuContent.append($option);
        });
    }

    $menuBtn.click(function () {
        if ($menuContent.is(':visible')) {
            $menuContent.hide();
        } else {
            $menuContent.show();
            generateDropdownOptions();
        }
    });

    $(window).resize(function () {
        // Ocultar el menú desplegable cuando la pantalla es lo suficientemente grande
        if ($(window).width() > 768) {
            $menuContent.hide();
        }
    });
});


// Función para validar la contraseña
function validatePassword(input) {
    var password = input.value;
    var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
    var errorMessage = $('#passwordError');

    if (!regex.test(password)) {
        errorMessage.text('La contraseña debe tener mínimo 8 caracteres, 1 mayúscula, 1 número y 1 carácter especial.');
        input.setCustomValidity('Invalid');
    } else {
        errorMessage.text('');
        input.setCustomValidity('');
    }
}

// Función para validar la confirmación de la contraseña
function validateConfirmPassword(input) {
    var password = $('#password').val();
    var confirmPassword = input.value;
    var errorMessage = $('#confirmPasswordError');

    if (password !== confirmPassword) {
        errorMessage.text('Las contraseñas no coinciden.');
        input.setCustomValidity('Invalid');
    } else {
        errorMessage.text('');
        input.setCustomValidity('');
    }
}

// Función para alternar la visibilidad de la contraseña
function togglePassword(inputId, buttonId) {
    var passwordInput = $('#' + inputId);
    var showPasswordBtn = $('#' + buttonId);

    if (passwordInput.attr('type') === 'password') {
        passwordInput.attr('type', 'text');
        showPasswordBtn.text('Ocultar');
    } else {
        passwordInput.attr('type', 'password');
        showPasswordBtn.text('Mostrar');
    }
}

$(document).ready(function () {
    $("#searchForm").submit(function (e) {
        e.preventDefault();
        searchDestinos();
    });

    function searchDestinos() {
        var searchTerm = $("#busquedaGlobal").val();
        $.ajax({
            type: "GET",
            url: "/buscar",
            data: { nombreBuscar: searchTerm },
            success: function (data) {
                // Update the destinos-grid div with the received partial HTML
                console.log(data);
                $("#searchResultsContainer").empty();

                // Use append instead of html to add the new content without removing existing
                $("#searchResultsContainer").append(data);

                $("#searchResultsContainer").toggleClass('destinos-grid', $(data).find('.card').length > 0);
            },
            error: function (error) {
                console.error("Error:", error);
            }
        });
    }
});


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
        success: function (data) {
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
        error: function (error) {
            console.error('Error:', error);
            mostrarMensaje('error', '¡Ups! Ha ocurrido un error al realizar la acción.');
        }
    });
}

function realizarLogout() {
    // Realizar la petición AJAX con jQuery
    $.ajax({
        type: 'GET',
        url: '/users/logout',
        success: function () {
            console.log('Logout exitoso');
            // Redirigir a la página de inicio de sesión después del logout
            window.location.href = '/';
        },
        error: function (error) {
            console.error('Error al realizar la solicitud de logout', error);
            // Mostrar un mensaje de error en caso de fallo en el logout
            mostrarMensaje('error', '¡Ups! Ha ocurrido un error al cerrar sesión.');
        }
    });
}

// Función para cargar contenido mediante Ajax
function cargarContenido(url) {
    console.log(url)
    $.ajax({
        type: 'GET',
        url: url,
        success: function (data) {
            console.log(data)
            // Actualizar el contenido principal con la respuesta del servidor
            $('html').html(data);
        },
        error: function (error) {
            console.error('Error al cargar la página', error);
        }
    });
}

// Asociar la función de logout al evento de clic en el enlace de logout
$(document).ready(function () {
    $('#logoutLink').on('click', function (e) {
        e.preventDefault();
        realizarLogout();
    });

    // Asociar la función al evento de clic en el enlace de perfil
    $('#perfilLink').on('click', function (e) {
        e.preventDefault();
        cargarContenido('/users/perfil');
    });

    // Asociar la función al evento de clic en el enlace de reservas
    $('#reservasLink').on('click', function (e) {
        e.preventDefault();
        cargarContenido('/users/reservas_usuario');
    });
});