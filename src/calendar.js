// Variables
const monthInitial = new Date().getMonth();
let monthCurrent = new Date().getMonth();
let yearCurrent = new Date().getFullYear()
const date = new Date();
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
const daysWeekSpanish = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

// SELECTORES
const calendar = document.querySelector('.booking-calendar');
const dateDisplay = document.getElementById("dateDisplay");
const btnPrevious = document.getElementById("btnPrevious");
const btnNext = document.getElementById("btnNext");
const daysNames = document.querySelector(".day-names");
const daysGrid = document.getElementById("daysContainer");
const bodyCalendar = document.querySelector(".calendar-body");

// FUNCIONES

function initCalendar() {
    // Leer el modo actual ('monthly' o 'weekly')
    const currentView = calendar.getAttribute('data-view');
    
    if (currentView === 'monthly') {
        console.log("renderizar vista mensual");
        renderMonthly();
    } else if (currentView === 'weekly') {
        const weekDays = anchorDate(yearCurrent, monthInitial, date.getDate());
        renderWeekly(weekDays);
    }
}

function renderMonthly() {

    daysNames.innerHTML = "";
    daysGrid.innerHTML = "";
    
    // Dias de la semanas
    daysWeekSpanish.forEach(dayName => {
        const dayWeek = document.createElement('div');
        dayWeek.classList.add("day-week");
        dayWeek.textContent = dayName;
        daysNames.appendChild(dayWeek);
    });

    // datos mes anterior
    const totalDiasMesAnterior = new Date(Number(yearCurrent), Number(monthCurrent-1) + 1, 0).getDate();
    const primerDiaSemana = new Date(Number(yearCurrent), Number(monthCurrent), 1).getDay();
    const diasMesAnterior = primerDiaSemana - 2;
    
    // datos mes actual
    const diaActual = date.getDate();
    const totalDiasMesActual = new Date(Number(yearCurrent), Number(monthCurrent) + 1, 0).getDate();    
    const fechaUltimoDiaMesActual = new Date(Number(yearCurrent), Number(monthCurrent) + 1, 0);
    const ultimoDiaMes = fechaUltimoDiaMesActual.getDay();

    // Bucle para dias del mes anterior
    for (day = totalDiasMesAnterior-diasMesAnterior; day <= totalDiasMesAnterior; day++) {
        const nuevoDia = document.createElement('div');
        nuevoDia.classList.add("day-month-before");
        nuevoDia.textContent = day;
        daysGrid.appendChild(nuevoDia);
    }

    // Bucle insertar dias
    for (day = 1; day <= totalDiasMesActual; day++) {

        if (day === diaActual && monthInitial === monthCurrent) {
            const nuevoDia = document.createElement('div');
            nuevoDia.classList.add("day");
            nuevoDia.classList.add("selected");
            nuevoDia.textContent = day;
            
            const etiquetaToday = document.createElement('span');
            etiquetaToday.textContent = "HOY";
            nuevoDia.appendChild(etiquetaToday);

            daysGrid.appendChild(nuevoDia);
        }
        else if (day > diaActual ) {
            const nuevoDia = document.createElement('div');
            nuevoDia.classList.add("day");
            nuevoDia.textContent = day;
            daysGrid.appendChild(nuevoDia);
        }
        else {
            const nuevoDia = document.createElement('div');
            nuevoDia.classList.add("day-deactive");
            nuevoDia.textContent = day;
            daysGrid.appendChild(nuevoDia);
        }
    }

    const diasProximosMes = 7 - ultimoDiaMes;

    // Bucle para dias del proximo mes
    for (day = 1; day <= diasProximosMes; day++) {
        const nuevoDia = document.createElement('div');
        nuevoDia.classList.add("day-month-after");
        nuevoDia.textContent = day;
        daysGrid.appendChild(nuevoDia);
    }
}

function renderWeekly(weekDays) {
    // Forzar cambio
    document.querySelector('.booking-calendar').setAttribute('data-view', 'weekly');

    console.log("Rendirizando vista semanal");

    daysGrid.innerHTML = "";

    const diaActual = date.getDate();

    for (day = 0; day <= 6; day++) {
        if (weekDays[day] === diaActual && monthInitial === monthCurrent) {
            const nuevoDia = document.createElement('div');
            nuevoDia.classList.add("day");
            nuevoDia.classList.add("selected");

            const dayName = document.createElement('span');
            dayName.classList.add("day-name");
            dayName.textContent = daysWeekSpanish[day];
            nuevoDia.appendChild(dayName);

            const dayNumber = document.createElement('span');
            dayNumber.classList.add("day-number");
            dayNumber.textContent = weekDays[day];
            nuevoDia.appendChild(dayNumber);

            const etiquetaToday = document.createElement('span');
            etiquetaToday.textContent = "HOY";
            nuevoDia.appendChild(etiquetaToday);

            daysGrid.appendChild(nuevoDia);
        }
        else if (weekDays[day] > diaActual ) {
            const nuevoDia = document.createElement('div');
            nuevoDia.classList.add("day");

            const dayName = document.createElement('span');
            dayName.classList.add("day-name");
            dayName.textContent = daysWeekSpanish[day];
            nuevoDia.appendChild(dayName);

            const dayNumber = document.createElement('span');
            dayNumber.classList.add("day-number");
            dayNumber.textContent = weekDays[day];
            nuevoDia.appendChild(dayNumber);

            daysGrid.appendChild(nuevoDia);
        }
        else {
            const nuevoDia = document.createElement('div');
            nuevoDia.classList.add("day-deactive");

            const dayName = document.createElement('span');
            dayName.classList.add("day-name");
            dayName.textContent = daysWeekSpanish[day];
            nuevoDia.appendChild(dayName);

            const dayNumber = document.createElement('span');
            dayNumber.classList.add("day-number");
            dayNumber.textContent = weekDays[day];
            nuevoDia.appendChild(dayNumber);

            daysGrid.appendChild(nuevoDia);
        }
    }

}

function anchorDate(year, month, day) {

    const date = new Date(year, month, day);
    const lastDayMonthCurrent = new Date(year, month+1, 0).getDate(); 

    // Forzar a que la semana empiece en LUNES
    const dayOfWeek = (date.getDay() + 6) % 7;

    let dias = Array.from({length: 7}, (_, i) => day - dayOfWeek + i).filter(valor => valor > 0 && valor <= lastDayMonthCurrent);
    
    if (dias.length < 7) {
        // Verificar cuantos días faltan
        const diasFaltantes = (7 - dias.length);

        // Verificar sí es principio o fin de mes
        if (dias.at(0) === 1) {
            // Obtener los dias faltantes del mes anterior
            const lastDayPrevMonth = new Date(year, month, 0).getDate();
            const missingDays = Array.from({ length: diasFaltantes }, (_, i) =>
                lastDayPrevMonth - (diasFaltantes - 1 - i)
            );

            dias = [...missingDays, ...dias];
        }
        else if (dias.at(-1) >= 28 || dias.at(-1) <= 31) {
            // Obtener los dias faltantes del mes proximo
            const firstDayNextMonth = new Date(year, month+1, 1).getDate();

            const missingDays = Array.from({ length: diasFaltantes }, (_, i) =>
                firstDayNextMonth + i
            );

            dias = [...dias, ...missingDays];
        }
    }
    return dias;
}

function getDate(month, year) {
    const newMonth = nameMonthsMap.get(month);
    return `${newMonth} ${year}`;
}

function nextMonth(id) {
    const dateCurrent = dateDisplay.textContent.split(' ');
    monthCurrent = [...nameMonthsMap.entries()].find(([_, nombre]) => nombre === dateCurrent[0])?.[0];
    yearCurrent = dateCurrent[1];

    if (id === 'btnPrevious') {
        monthCurrent -= 1;
        if (monthCurrent === -1)
        {
            yearCurrent = Number(yearCurrent);
            yearCurrent -= 1;
            yearCurrent = String(yearCurrent);
            monthCurrent = 11;
            dateDisplay.textContent = getDate(monthCurrent, yearCurrent);
            renderMonthly();
        }
        dateDisplay.textContent = getDate(monthCurrent, yearCurrent);
        renderMonthly();
    }
    else {
        monthCurrent += 1;
        if (monthCurrent === 12) {
            yearCurrent = Number(yearCurrent);
            yearCurrent += 1;
            yearCurrent = String(yearCurrent);
            monthCurrent = 0;
            dateDisplay.textContent = getDate(monthCurrent, yearCurrent);
            renderMonthly();
        }
        dateDisplay.textContent = getDate(monthCurrent, yearCurrent);
        renderMonthly();
    }
}

// EVENTOS
btnPrevious.addEventListener("click", () => nextMonth("btnPrevious"));
btnNext.addEventListener("click", () => nextMonth("btnNext"));

daysGrid.addEventListener("click", (e) => {
    const day = e.target.closest(".day")

    if (day) {
        const seleccionadoPrevio = daysGrid.querySelector(".day.selected");

        if (seleccionadoPrevio) {
            seleccionadoPrevio.classList.remove("selected");
        }

        day.classList.add("selected");
    }
});

// INICIALIZACION
dateDisplay.textContent = `${nameMonthsMap.get(date.getMonth())} ${date.getFullYear()}`;

initCalendar();