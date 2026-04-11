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
const dateDisplay = document.getElementById("dateDisplay");
const btnPrevious = document.getElementById("btnPrevious");
const btnNext = document.getElementById("btnNext");
const daysNames = document.querySelector(".day-names"); // Nota el punto (.) antes de la clase
const daysGrid = document.getElementById("daysContainer");

// FUNCIONES

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
        }
        dateDisplay.textContent = getDate(monthCurrent, yearCurrent);
    }
    else {
        monthCurrent += 1;
        if (monthCurrent === 12) {
            yearCurrent = Number(yearCurrent);
            yearCurrent += 1;
            yearCurrent = String(yearCurrent);
            monthCurrent = 0;
            dateDisplay.textContent = getDate(monthCurrent, yearCurrent);
        }
        dateDisplay.textContent = getDate(monthCurrent, yearCurrent);
    }
}

function renderDayWeek() {
    daysWeekSpanish.forEach(dayName => {
        const dayWeek = document.createElement('div');
        dayWeek.classList.add("day-week");
        dayWeek.textContent = dayName;
        daysNames.appendChild(dayWeek);
    });
}

function renderCalendar() {
    daysContainer.innerHTML = "";

    const primerDiaSemana = new Date(Number(yearCurrent), Number(monthCurrent), 1).getDay();
    
    const diaActual = date.getDate();

    const ultimoDia = new Date(Number(yearCurrent), Number(monthCurrent) + 1, 0).getDate();
        
    // Bucle para dias vacios
    for (day = 1; day < primerDiaSemana; day++) {
        const nuevoDia = document.createElement('div');
        nuevoDia.classList.add("day-empty");
        daysGrid.appendChild(nuevoDia);
    }

    // Bucle insertar dias
    for (day = 1; day <= ultimoDia; day++) {
        if (day === diaActual) {
            const nuevoDia = document.createElement('div');
            nuevoDia.classList.add("day");
            nuevoDia.classList.add("selected");
            nuevoDia.textContent = day;
            
            const etiquetaToday = document.createElement('span');
            etiquetaToday.textContent = "Today";
            nuevoDia.appendChild(etiquetaToday);

            daysGrid.appendChild(nuevoDia);
        }
        const nuevoDia = document.createElement('div');
        nuevoDia.classList.add("day");
        nuevoDia.textContent = day;
        daysGrid.appendChild(nuevoDia);
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
renderDayWeek();
renderCalendar();