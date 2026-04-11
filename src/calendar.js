let monthCurrent;
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


// SELECTORES
const dateDisplay = document.getElementById("dateDisplay");
const btnPrevious = document.getElementById("btnPrevious");
const btnNext = document.getElementById("btnNext");

// FUNCIONES

function getDate(month, year) {
    // Manejo de Fecha actual
    const newMonth = nameMonthsMap.get(month);
    return `${newMonth} ${year}`;
}

function nextMonth(id) {
    const dateCurrent = dateDisplay.textContent.split(' ');
    monthCurrent = [...nameMonthsMap.entries()].find(([_, nombre]) => nombre === dateCurrent[0])?.[0];
    let yearCurrent = dateCurrent[1];

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

// EVENTOS
btnPrevious.addEventListener("click", () => nextMonth("btnPrevious"));
btnNext.addEventListener("click", () => nextMonth("btnNext"));


// INICIALIZACION
dateDisplay.textContent = `${nameMonthsMap.get(date.getMonth())} ${date.getFullYear()}`;