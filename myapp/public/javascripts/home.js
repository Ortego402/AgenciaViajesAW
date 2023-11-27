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