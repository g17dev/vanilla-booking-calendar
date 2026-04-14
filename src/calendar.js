// src/calendar.js
import { render } from "./render.js";
import { navigateMonth, navigateWeek } from './navigation.js';

// SELECTORES
const btnPrevious = document.getElementById("btnPrevious");
const btnNext = document.getElementById("btnNext");
const daysGrid = document.getElementById("daysContainer");
const contenedor = document.querySelector('.days-grid');

// Configuración del observador
const observerOptions = {
    root: document.getElementById("daysContainer"), // El contenedor del scroll
    threshold: 0.6 // El día debe verse un 60% para que cuente como "activo"
};

// Definimos el observador globalmente para que render.js lo vea
window.headerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // Cuando un día entra en la zona de visualización principal
        if (entry.isIntersecting) {
            const { monthName, year } = entry.target.dataset;
            
            // Actualizamos el display del calendario
            if (monthName && year) {
                const dateDisplay = document.getElementById("dateDisplay");
                dateDisplay.textContent = `${monthName} ${year}`;
            }
        }
    });
}, observerOptions);


// FUNCIONES

function initCalendar() {
    render();
    updateNavigationButtons();
}

function updateNavigationButtons() {
    const btnPrevious = document.getElementById("btnPrevious");
    const daysContainer = document.getElementById("daysContainer");

    // Si el scroll está casi al inicio (menos de 10px)
    if (daysContainer.scrollLeft < 10) {
        btnPrevious.style.opacity = "0.3";
        btnPrevious.style.pointerEvents = "none"; // Desactiva clics
        btnPrevious.style.cursor = "default";
    } else {
        btnPrevious.style.opacity = "1";
        btnPrevious.style.pointerEvents = "auto"; // Activa clics
        btnPrevious.style.cursor = "pointer";
    }
}


// EVENTOS
btnPrevious.addEventListener("click", () => {
  const currentView = document.querySelector('.booking-calendar').dataset.view;
  if (currentView === 'monthly') {
    navigateMonth('prev');
  } else if (currentView === 'weekly') {
    //navigateWeek('prev');
    contenedor.scrollBy({ left: -865, behavior: 'smooth' });
  }
});

btnNext.addEventListener("click", () => {
  const currentView = document.querySelector('.booking-calendar').dataset.view;
  if (currentView === 'monthly') {
    navigateMonth('next');
  } else if (currentView === 'weekly') {
    navigateWeek('next');
    contenedor.scrollBy({ left: 865, behavior: 'smooth' });
  }
});

daysGrid.addEventListener("click", (e) => {
  const day = e.target.closest(".day");

  if (day) {
    const seleccionadoPrevio = daysGrid.querySelector(".day.selected");

    if (seleccionadoPrevio) {
      seleccionadoPrevio.classList.remove("selected");
    }

    day.classList.add("selected");
  }
});

daysGrid.addEventListener('scroll', () => {
    // Si el usuario llega al final del scroll a la derecha
    if (daysContainer.scrollLeft + daysContainer.offsetWidth >= daysContainer.scrollWidth) {
        navigateWeek('next');
    }
    
    // Si llega al principio a la izquierda
    if (daysContainer.scrollLeft === 0){

    }
    
    updateNavigationButtons();
});

// INICIALIZACION
initCalendar();