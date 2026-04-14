// src/navigation.js
import { setState, getState } from './state.js';
import { render } from './render.js';

// SELECTORES (Asegúrate de que daysContainer esté disponible)
const dateDisplay = document.getElementById("dateDisplay");
const daysContainer = document.getElementById("daysContainer");

export function navigateMonth(direction) {
  const { currentDate } = getState();
  const newDate = new Date(currentDate);

  if (direction === 'next') {
    newDate.setMonth(newDate.getMonth() + 1);
  } else if (direction === 'prev') {
    newDate.setMonth(newDate.getMonth() - 1);
  }

  setState({ currentDate: newDate });
  // El Observer se encargará del texto si hay scroll, pero en vista mensual lo mantenemos:
  const nameMonthsMap = new Map([[0, "Enero"], [1, "Febrero"], [2, "Marzo"], [3, "Abril"], [4, "Mayo"], [5, "Junio"], [6, "Julio"], [7, "Agosto"], [8, "Septiembre"], [9, "Octubre"], [10, "Noviembre"], [11, "Diciembre"]]);
  dateDisplay.textContent = `${nameMonthsMap.get(newDate.getMonth())} ${newDate.getFullYear()}`;
  render();
}

export function navigateWeek(direction) {
  const { currentDate } = getState();
  const newDate = new Date(currentDate);

  if (direction === 'next') {
    // Calcular cuánto scroll queda a la derecha
    const scrollRestante = daysContainer.scrollWidth - (daysContainer.scrollLeft + daysContainer.clientWidth);

    if (scrollRestante > 50) { 
      daysContainer.scrollBy({ left: 300, behavior: 'smooth' });
    } 
    // Si llega al final, carga 7 días nuevos
    else {
      newDate.setDate(newDate.getDate() + 7);
      setState({ currentDate: newDate });
      render();
    }
  } 
  
  else if (direction === 'prev') {

    if (daysContainer.scrollLeft > 10) {
      daysContainer.scrollBy({ left: -300, behavior: 'smooth' });
    } 
  }
}
