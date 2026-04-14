// src/render.js
import { state, setState } from './state.js';
import { getCurrentDate, anchorDate } from './utils.js';

// SELECTORES
const daysNames = document.querySelector(".day-names");
const daysGrid = document.getElementById("daysContainer");
const bookingCalendar = document.querySelector('.booking-calendar');

// VARIABLES
const daysWeekSpanish = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const nameMonthsMap = new Map([
  [0, "Enero"],
  [1, "Febrero"],
  [2, "Marzo"],
  [3, "Abril"],
  [4, "Mayo"],
  [5, "Junio"], 
  [6, "Julio"],
  [7, "Agosto"],
  [8, "Septiembre"],
  [9, "Octubre"],
  [10, "Noviembre"],
  [11, "Diciembre"]
]);
const todayDate = getCurrentDate();

export function render() {
  const { view, currentDate } = state;
  if (window.headerObserver) {
      window.headerObserver.disconnect();
  }

  if (view === 'monthly') {
    bookingCalendar.dataset.view = 'monthly';
    renderMonthly(currentDate);
  } else if (view === 'weekly') {
    // Cambiamos el atributo 'data-view' a 'monthly' usando dataset
    bookingCalendar.dataset.view = 'weekly';
    const weekDays = anchorDate(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    renderWeekly(weekDays, currentDate.getMonth(), currentDate.getFullYear());
  }
}

function renderMonthly(currentDate) {
    let monthCurrent = currentDate.getMonth();
    let yearCurrent = currentDate.getFullYear();

    daysNames.innerHTML = "";
    daysGrid.innerHTML = "";

    // Dias de la semana (en español)
    daysWeekSpanish.forEach(dayName => {
        const dayWeek = document.createElement('div');
        dayWeek.classList.add("day-week");
        dayWeek.textContent = dayName;
        daysNames.appendChild(dayWeek);
    });

    // Datos del mes anterior
    const totalDiasMesAnterior = new Date(Number(yearCurrent), Number(monthCurrent), 0).getDate(); // Total días del mes anterior
    const primerDiaSemana = new Date(Number(yearCurrent), Number(monthCurrent), 1).getDay(); // Día de la semana del primer día
    const diasMesAnterior = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1; // Ajuste para comenzar en lunes
    
    // Datos del mes actual
    const diaActual = todayDate.getDate();
    const totalDiasMesActual = new Date(Number(yearCurrent), Number(monthCurrent) + 1, 0).getDate();    
    const fechaUltimoDiaMesActual = new Date(Number(yearCurrent), Number(monthCurrent) + 1, 0);
    const ultimoDiaMes = fechaUltimoDiaMesActual.getDay();

    // Bucle para los días del mes anterior
    for (let day = totalDiasMesAnterior - diasMesAnterior + 1; day <= totalDiasMesAnterior; day++) {
        const nuevoDia = document.createElement('div');
        nuevoDia.classList.add("day-month-before");
        nuevoDia.textContent = day;
        daysGrid.appendChild(nuevoDia);
    }

    // Bucle para los días del mes actual
    for (let day = 1; day <= totalDiasMesActual; day++) {
        const fechaGenerada = new Date(yearCurrent, monthCurrent, day);
        
        const nuevoDia = document.createElement('div');
        nuevoDia.textContent = day;

        // Si es el día actual, añades la clase 'selected' y etiquetas "HOY"
        if (todayDate.toDateString() === fechaGenerada.toDateString()) {            
            nuevoDia.classList.add("day", "selected");
        
            const etiquetaToday = document.createElement('span');
            etiquetaToday.textContent = "HOY";
            nuevoDia.appendChild(etiquetaToday);
        }
        // Si el día es posterior al actual, solo añades la clase 'day'
        else if (fechaGenerada > todayDate) {
            nuevoDia.classList.add("day");
        }
        // Si el día es anterior al actual, lo desactivas
        else {
            nuevoDia.classList.add("day-deactive");
        }

        daysGrid.appendChild(nuevoDia);
    }

    // Bucle para los días del próximo mes
    const diasProximosMes = 7 - ultimoDiaMes === 7 ? 0 : 7 - ultimoDiaMes;

    for (let day = 1; day <= diasProximosMes; day++) {
        const nuevoDia = document.createElement('div');
        nuevoDia.classList.add("day-month-after");
        nuevoDia.textContent = day;
        daysGrid.appendChild(nuevoDia);
    }
}

function renderWeekly(weekDays, month, year) {
    weekDays.forEach((dayNumber, index) => {

        // Ajuste para que Lunes sea 0 (0=Lun, 1=Mar, ..., 6=Dom)
        const dayOfWeekIndex = daysWeekSpanish[index];

        const nuevoDia = document.createElement('div');
        nuevoDia.classList.add("day");

        const spanName = document.createElement('span');
        spanName.classList.add("day-name");
        spanName.textContent = dayOfWeekIndex; 

        const spanNum = document.createElement('span');
        spanNum.classList.add("day-number");
        spanNum.textContent = dayNumber;

        // Guardamos el mes y año en el elemento HTML
        nuevoDia.dataset.monthName = nameMonthsMap.get(month); 
        nuevoDia.dataset.year = year;

        nuevoDia.appendChild(spanName);
        nuevoDia.appendChild(spanNum);

        // Lógica de "Hoy"
        if (todayDate.getDate() === dayNumber && month === todayDate.getMonth() && year === todayDate.getFullYear()) {
            nuevoDia.classList.add("selected");
            const etiquetaToday = document.createElement('span');
            etiquetaToday.textContent = "HOY";
            nuevoDia.appendChild(etiquetaToday);
        }

        daysGrid.appendChild(nuevoDia);
        
        // Notificamos al observador que vigile este nuevo día
        if (window.headerObserver) {
            window.headerObserver.observe(nuevoDia);
        }
    });
}

