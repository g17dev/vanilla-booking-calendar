// src/state.js
export const state = {
  view: 'monthly',  // Puede ser 'monthly' o 'weekly'
  currentDate: new Date(), // Fecha de referencia para la vista Mensual
  weeklyAnchorDate: new Date()   // Fecha de referencia para la vista Semanal

};

export function setState(newState) {
  Object.assign(state, newState);
}

export function getState() {
  return state;
}