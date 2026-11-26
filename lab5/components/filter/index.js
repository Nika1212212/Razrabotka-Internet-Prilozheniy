/**
 * Компонент фильтрации карточек по названию (title).
 * Значение уходит в GET-запрос как query-параметр ?title=... (см. modules/visaUrls.js).
 */
export class FilterComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(value = '') {
        return `
            <label class="form-label mb-0" for="filter-input">Фильтр по названию:</label>
            <input type="text" id="filter-input" class="form-control filter-input"
                   value="${this.escape(value)}"
                   placeholder="Например, Турция" style="max-width: 300px;">
            <button id="filter-button" class="btn btn-sm">Применить</button>
            <button id="reset-button" class="btn btn-sm">Сбросить</button>
        `;
    }

    escape(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    getValue() {
        return document.getElementById('filter-input').value.trim();
    }

    addListeners(onApply, onReset) {
        document.getElementById('filter-button').addEventListener('click', () => {
            onApply(this.getValue());
        });

        document.getElementById('reset-button').addEventListener('click', () => {
            document.getElementById('filter-input').value = '';
            onReset();
        });

        document.getElementById('filter-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                onApply(this.getValue());
            }
        });
    }

    render(value, onApply, onReset) {
        this.parent.insertAdjacentHTML('beforeend', this.getHTML(value));
        this.addListeners(onApply, onReset);
    }
}
