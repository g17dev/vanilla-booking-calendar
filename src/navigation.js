// src/navigation.js
import { setState, getState } from './state.js';
import { render } from './render.js';

// Mapa de meses (lo ideal sería importarlo de utils para no repetirlo)
const nameMonthsMap = new Map([[0, "Enero"], [1, "Febrero"], [2, "Marzo"], [3, "Abril"], [4, "Mayo"], [5, "Junio"], [6, "Julio"], [7, "Agosto"], [8, "Septiembre"], [9, "Octubre"], [10, "Noviembre"], [11, "Diciembre"]]);

export function navigateMonth(direction, root) {
  const { currentDate } = getState();
  const newDate = new Date(currentDate);

  if (direction === 'next') {
    newDate.setMonth(newDate.getMonth() + 1);
  } else if (direction === 'prev') {
    newDate.setMonth(newDate.getMonth() - 1);
  }

  setState({ currentDate: newDate });

  // Buscamos el elemento dentro del Shadow DOM pasado como root
  const dateDisplay = root.getElementById("dateDisplay");
  if (dateDisplay) {
      dateDisplay.textContent = `${nameMonthsMap.get(newDate.getMonth())} ${newDate.getFullYear()}`;
  }
  
  // Pasamos el root al render para que sepa dónde dibujar
  render(root);
}

export function navigateWeek(direction, root) {
  const { weeklyAnchorDate } = getState();
  const newDate = new Date(weeklyAnchorDate);
  const daysContainer = root.getElementById("daysContainer");

  if (!daysContainer) return;

  if (direction === 'next') {
    const scrollRestante = daysContainer.scrollWidth - (daysContainer.scrollLeft + daysContainer.clientWidth);

    if (scrollRestante > 50) { 
      daysContainer.scrollBy({ left: 300, behavior: 'smooth' });
    } 
    else {
      newDate.setDate(newDate.getDate() + 7);
      setState({ weeklyAnchorDate: newDate });
      render(root);
    }
  } 
  else if (direction === 'prev') {
    if (daysContainer.scrollLeft > 10) {
      daysContainer.scrollBy({ left: -300, behavior: 'smooth' });
    } 
  }
}
