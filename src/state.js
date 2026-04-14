// src/state.js
export const state = {
  view: 'monthly',  // Puede ser 'monthly' o 'weekly'
  currentDate: new Date() // Fecha de referencia
};

export function setState(newState) {
  Object.assign(state, newState);
}

export function getState() {
  return state;
}