// src/calendar.js
import { render } from "./render.js";
import { navigateMonth, navigateWeek } from './navigation.js';
import { getCurrentDate, getCurrentMonth } from './utils.js';

// 1. Exportamos la función aceptando el shadowRoot como 'root'
export function initCalendar(root) {
    
    // 2. Selectores locales (cambiamos document por root)
    const btnPrevious = root.getElementById("btnPrevious");
    const btnNext = root.getElementById("btnNext");
    const daysGrid = root.getElementById("daysContainer");
    const dateDisplay = root.getElementById("dateDisplay");
    const calendarElement = root.querySelector('.booking-calendar');

    // 3. El Observador debe configurarse con el nuevo root
    const observerOptions = {
        root: daysGrid, 
        threshold: 0.6
    };

    // Definimos el observador globalmente para que render.js lo vea
    window.headerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Cuando un día entra en la zona de visualización principal
            if (entry.isIntersecting) {
                const { monthName, year } = entry.target.dataset;
                
                // Actualizamos el display del calendario
                if (monthName && year) {
                    const dateDisplay = root.getElementById("dateDisplay");
                    dateDisplay.textContent = `${monthName} ${year}`;
                }
            }
        });
    }, observerOptions);

    // 4. Funciones internas actualizadas
    function updateNavigationButtons() {
        const currentView = calendarElement.dataset.view;

        btnPrevious.style.opacity = "1";
        btnPrevious.style.pointerEvents = "auto";

        if (currentView === 'weekly') {
            // Solo deshabilitar si estamos al inicio del scroll en la semana
            if (daysGrid.scrollLeft < 10) {
                btnPrevious.style.opacity = "0.3";
                btnPrevious.style.pointerEvents = "none";
            }
        }
    }

    // 5. Eventos vinculados a los elementos locales
    btnPrevious.addEventListener("click", () => {
        const currentView = calendarElement.dataset.view;
        if (currentView === 'monthly') {
            navigateMonth('prev', root);
        } else {
            daysGrid.scrollBy({ left: -865, behavior: 'smooth' });
        }
    });

    btnNext.addEventListener("click", () => {
        const currentView = calendarElement.dataset.view;
        if (currentView === 'monthly') {
            navigateMonth('next', root);
        } else {
            navigateWeek('next', root);
            daysGrid.scrollBy({ left: 865, behavior: 'smooth' });
        }
    });

    daysGrid.addEventListener("click", (e) => {
        const day = e.target.closest(".day");
        if (day) {
            const seleccionadoPrevio = daysGrid.querySelector(".day.selected");
            if (seleccionadoPrevio) seleccionadoPrevio.classList.remove("selected");
            day.classList.add("selected");
        }
    });

    daysGrid.addEventListener('scroll', () => {
        if (daysGrid.scrollLeft + daysGrid.offsetWidth >= daysGrid.scrollWidth) {
            navigateWeek('next', root);
        }
        updateNavigationButtons();
    });

    // 6. Ejecución inicial
    const initialDate = getCurrentDate();
    dateDisplay.textContent = `${getCurrentMonth(initialDate.getMonth())} ${initialDate.getFullYear()}`;
    
    // Pasamos el root también al render
    render(root); 
    updateNavigationButtons();
}
