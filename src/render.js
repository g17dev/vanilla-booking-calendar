    // src/render.js
    import { state, setState } from './state.js';
    import { getCurrentDate, anchorDate } from './utils.js';

    // VARIABLES CONSTANTES
    const daysWeekSpanish = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    const nameMonthsMap = new Map([
    [0, "Enero"], [1, "Febrero"], [2, "Marzo"], [3, "Abril"],
    [4, "Mayo"], [5, "Junio"], [6, "Julio"], [7, "Agosto"],
    [8, "Septiembre"], [9, "Octubre"], [10, "Noviembre"], [11, "Diciembre"]
    ]);
    const todayDate = getCurrentDate();

    // 1. Exportamos la función principal aceptando el 'root' (shadowRoot)
    export function render(root) {
        const { view, currentDate, weeklyAnchorDate } = state;

        const daysNames = root.querySelector(".day-names");
        const daysGrid = root.getElementById("daysContainer");
        const calendarElement = root.querySelector('.booking-calendar');

        if (view === 'monthly') {
            if (window.headerObserver) window.headerObserver.disconnect();
            renderMonthly(currentDate, daysNames, daysGrid, root);
        } 
        else if (view === 'weekly') {
            const isFirstWeeklyRender = !daysGrid.querySelector('.day-name');
            
            // Usamos una variable auxiliar para la fecha que vamos a procesar
            let dateToProcess = weeklyAnchorDate;

            if (isFirstWeeklyRender) {
                console.log("Renderizando por primera vez vista semanal");
                if (window.headerObserver) window.headerObserver.disconnect(); 
                
                // 1. Actualizamos la referencia local para este ciclo
                dateToProcess = new Date(); 
                
                // 2. Sincronizamos el estado global para futuras navegaciones
                setState({ weeklyAnchorDate: dateToProcess });
                
                daysGrid.innerHTML = "";
                daysGrid.scrollLeft = 0;
            }

            // 3. Usamos dateToProcess para que la primera carga SIEMPRE use la fecha nueva
            const weekDays = anchorDate(
                dateToProcess.getFullYear(), 
                dateToProcess.getMonth(), 
                dateToProcess.getDate()
            );

            renderWeekly(weekDays, dateToProcess.getMonth(), dateToProcess.getFullYear(), daysGrid);
        }
    }



    // 3. Pasamos las referencias de los contenedores a las sub-funciones
    function renderMonthly(currentDate, daysNames, daysGrid) {
        let monthCurrent = currentDate.getMonth();
        let yearCurrent = currentDate.getFullYear();

        daysNames.innerHTML = "";
        daysGrid.innerHTML = "";

        daysWeekSpanish.forEach(dayName => {
            const dayWeek = document.createElement('div');
            dayWeek.classList.add("day-week");
            dayWeek.textContent = dayName;
            daysNames.appendChild(dayWeek);
        });

        const totalDiasMesAnterior = new Date(Number(yearCurrent), Number(monthCurrent), 0).getDate();
        const primerDiaSemana = new Date(Number(yearCurrent), Number(monthCurrent), 1).getDay();
        const diasMesAnterior = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1;
        
        const totalDiasMesActual = new Date(Number(yearCurrent), Number(monthCurrent) + 1, 0).getDate();    
        const fechaUltimoDiaMesActual = new Date(Number(yearCurrent), Number(monthCurrent) + 1, 0);
        const ultimoDiaMes = fechaUltimoDiaMesActual.getDay();

        for (let day = totalDiasMesAnterior - diasMesAnterior + 1; day <= totalDiasMesAnterior; day++) {
            const nuevoDia = document.createElement('div');
            nuevoDia.classList.add("day-month-before");
            nuevoDia.textContent = day;
            daysGrid.appendChild(nuevoDia);
        }

        for (let day = 1; day <= totalDiasMesActual; day++) {
            const fechaGenerada = new Date(yearCurrent, monthCurrent, day);
            const nuevoDia = document.createElement('div');
            nuevoDia.textContent = day;

            // --- NUEVO: Formatear la fecha como YYYY-MM-DD ---
            const isoDate = fechaGenerada.toISOString().split('T')[0];
            nuevoDia.dataset.date = isoDate; // <--- ESTO ES LO QUE FALTA

            // Atributos para el Observer
            nuevoDia.dataset.monthName = nameMonthsMap.get(monthCurrent);
            nuevoDia.dataset.year = yearCurrent;

            if (todayDate.toDateString() === fechaGenerada.toDateString()) {            
                nuevoDia.classList.add("day", "selected");
                const etiquetaToday = document.createElement('span');
                etiquetaToday.textContent = "HOY";
                nuevoDia.appendChild(etiquetaToday);
            }
            else if (fechaGenerada > todayDate) {
                nuevoDia.classList.add("day");
            }
            else {
                nuevoDia.classList.add("day-deactive");
            }

            daysGrid.appendChild(nuevoDia);

            // Activamos el observador (el root del observer ya está configurado en calendar.js)
            if (window.headerObserver) {
                window.headerObserver.observe(nuevoDia);
            }
        }

        const diasProximosMes = 7 - ultimoDiaMes === 7 ? 0 : 7 - ultimoDiaMes;
        for (let day = 1; day <= diasProximosMes; day++) {
            const nuevoDia = document.createElement('div');
            nuevoDia.classList.add("day-month-after");
            nuevoDia.textContent = day;
            daysGrid.appendChild(nuevoDia);
        }
    }

    function renderWeekly(weekDays, month, year, daysGrid) {
        weekDays.forEach((dayNumber, index) => {

            // Ajuste para que Lunes sea 0 (0=Lun, 1=Mar, ..., 6=Dom)
            const dayOfWeekIndex = daysWeekSpanish[index];

            const nuevoDia = document.createElement('div');
            
            const fechaGenerada = new Date(year, month, dayNumber);
            const isoDate = fechaGenerada.toISOString().split('T')[0]; 
            nuevoDia.dataset.date = isoDate;

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
            
            // Solo vinculamos el observador al primer día de la semana que se está renderizando
            // o al primer día de cada mes si la semana cruza meses.
            if (index === 0 && window.headerObserver) {
                window.headerObserver.observe(nuevoDia);
            }
            
            // Opcional: Si quieres que sea más preciso al cruzar meses, 
            // observa el día 1 de cada mes:
            if (dayNumber === 1 && window.headerObserver) {
                window.headerObserver.observe(nuevoDia);
            }
        });
    }