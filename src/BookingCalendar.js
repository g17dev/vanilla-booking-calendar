import { render } from './render.js';
import { initCalendar } from './calendar.js';
import { setState } from './state.js';

class BookingCalendar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    _dispatchCurrentSelection() {
        setTimeout(() => {
            const initial = this.shadowRoot.querySelector('.day.selected');
            if (initial && initial.dataset.date) {
                this.dispatchEvent(new CustomEvent('date-change', {
                    detail: { date: initial.dataset.date, element: initial },
                    bubbles: true,
                    composed: true
                }));
                console.log("Evento disparado:", initial.dataset.date);
            }
        }, 50);
    }

    set view(value) {
        const calendar = this.shadowRoot.querySelector('.booking-calendar');
        if (calendar) {
            calendar.dataset.view = value;
            setState({ view: value });
            
            // CORRECCIÓN: Usar 'value' para comparar, no 'calendar'
            if (value === 'weekly') {
                setState({ weeklyAnchorDate: new Date() });
            }
            
            initCalendar(this.shadowRoot);
            
            // CORRECCIÓN: Forzar el evento al cambiar de vista
            this._dispatchCurrentSelection();
        }
    }

    async connectedCallback() {
        await this.setupComponent();
        const daysContainer = this.shadowRoot.querySelector('#daysContainer');

        const observerDaySelected = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class' && 
                    mutation.target.classList.contains('selected')) {
                    const target = mutation.target;
                    const dateValue = target.dataset.date;
                    if (dateValue) {
                        this.dispatchEvent(new CustomEvent('date-change', {
                            detail: { date: dateValue, element: target },
                            bubbles: true,
                            composed: true
                        }));
                    }
                }
            });
        });

        observerDaySelected.observe(daysContainer, {
            attributes: true,
            subtree: true,
            attributeFilter: ['class']
        });
        
        initCalendar(this.shadowRoot);

        // CORRECCIÓN: Una sola llamada al inicio es suficiente
        this._dispatchCurrentSelection();
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