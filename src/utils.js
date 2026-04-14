// src/utils.js

export function getCurrentDate() {
    return new Date();
}

export function anchorDate(year, month, day) {
  const date = new Date(year, month, day);
  const lastDayMonthCurrent = new Date(year, month + 1, 0).getDate();

  // Forzar a que la semana empiece en LUNES
  const dayOfWeek = (date.getDay() + 6) % 7;

  let dias = Array.from({ length: 7 }, (_, i) => day - dayOfWeek + i)
    .filter(valor => valor > 0 && valor <= lastDayMonthCurrent);

  if (dias.length < 7) {
    const diasFaltantes = 7 - dias.length;
    
    if (dias[0] === 1) {
      const lastDayPrevMonth = new Date(year, month, 0).getDate();
      const missingDays = Array.from({ length: diasFaltantes }, (_, i) =>
        lastDayPrevMonth - (diasFaltantes - 1 - i)
      );

      dias = [...missingDays, ...dias];
    } else if (dias[dias.length - 1] >= 28 && dias[dias.length - 1] <= 31) {
      const firstDayNextMonth = new Date(year, month + 1, 1).getDate();

      const missingDays = Array.from({ length: diasFaltantes }, (_, i) =>
        firstDayNextMonth + i
      );

      dias = [...dias, ...missingDays];
    }
  }

  return dias;
}