import { render } from './render.js';
import { initCalendar } from './calendar.js';
import { setState } from './state.js';

class BookingCalendar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    // Método público para cambiar la vista desde JS externo
    set view(value) {
        const calendar = this.shadowRoot.querySelector('.booking-calendar');
        if (calendar) {
            calendar.dataset.view = value;
            setState({view: value});
            if (calendar === 'weekly') {
                setState({weeklyAnchorDate: new Date()});
                console.log("Reenderizando vista semanal...");
            }
            initCalendar(this.shadowRoot);
        }
    }

    async connectedCallback() {
        // 1. Cargamos la estructura HTML y el CSS primero
        await this.setupComponent();
        
        // 2. Inicializamos la lógica de eventos y el primer renderizado
        // Importante: initCalendar ya llama a render(root) internamente
        initCalendar(this.shadowRoot); 
    }

    async setupComponent() {
        let cssText = '';
        try {
            // Usar import.meta.url asegura que la ruta sea relativa al archivo JS
            const cssResponse = await fetch(new URL('./styles/calendar.css', import.meta.url));
            if (!cssResponse.ok) throw new Error("CSS no encontrado");
            cssText = await cssResponse.text();
        } catch (e) {
            console.error("Error cargando estilos del calendario:", e);
        }

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block; 
                    width: 100%;
                    /* Evita que el layout salte cuando el CSS carga */
                    min-height: 400px; 
                }
                ${cssText}
            </style>
            <div class="booking-calendar" data-view="monthly">
                <div class="calendar-header">
                    <button id="btnPrevious" type="button">&lt;</button>
                    <span id="dateDisplay"></span>
                    <button id="btnNext" type="button">&gt;</button>
                </div>
                <div class="calendar-body">
                    <div class="day-names"></div>
                    <div id="daysContainer" class="days-grid"></div>
                </div>
            </div>
        `;
    }
}

// Verifica que no se haya definido antes (evita errores en Hot Module Replacement)
if (!customElements.get('booking-calendar')) {
    customElements.define('booking-calendar', BookingCalendar);
}