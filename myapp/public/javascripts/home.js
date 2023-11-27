document.addEventListener('DOMContentLoaded', function () {
    var menuBtn = document.querySelector('.menu-btn');
    var menuContent = document.querySelector('.menu-content');
    var navbarLinks = document.querySelectorAll('.navbar a');

    // Función para generar las opciones del menú desplegable
    function generateDropdownOptions() {
        menuContent.innerHTML = ''; // Limpiar las opciones existentes

        navbarLinks.forEach(function (link) {
            var option = document.createElement('a');
            console.log(option)
            option.href = link.href;
            option.textContent = link.textContent;
            option.classList.add('dropdown-item');

            // Agregar cada opción al menú desplegable
            menuContent.appendChild(option);
        });
    }

    menuBtn.addEventListener('click', function () {
        if (menuContent.style.display === 'block') {
            menuContent.style.display = 'none';
        } else {
            menuContent.style.display = 'block';
            generateDropdownOptions();
        }
    });

    window.addEventListener('resize', function () {
        // Ocultar el menú desplegable cuando la pantalla es lo suficientemente grande
        if (window.innerWidth > 768) {
            menuContent.style.display = 'none';
        }
    });
});

