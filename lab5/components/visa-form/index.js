/**
 * Форма добавления/редактирования заявки.
 * В ЛР5 поля доступны для ввода и предзаполняются для существующих карточек,
 * но кнопки «Сохранить» нет — она появится только в ЛР6.
 */
export class VisaFormComponent {
    constructor(parent) {
        this.parent = parent;
    }

    escape(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    getVisaTypes(current) {
        const types = ['tourist', 'business', 'student', 'work', 'schengen'];
        return types
            .map(type => `
                <option value="${type}"${type === current ? ' selected' : ''}>${type}</option>
            `)
            .join('');
    }

    getHTML(visa = null) {
        const data = visa || {};

        return `
            <form class="card visa-form mx-auto" id="visa-form">
                <div class="card-body">
                    <p class="text-muted small mb-3">
                        ${visa ? `Редактирование заявки #${this.escape(data.id)}` : 'Новая заявка'}
                    </p>

                    <div class="mb-3">
                        <label for="field-src" class="form-label">Ссылка на изображение (src)</label>
                        <input type="text" class="form-control" id="field-src"
                               value="${this.escape(data.src)}"
                               placeholder="https://flagcdn.com/w320/fr.png">
                    </div>

                    <div class="mb-3">
                        <label for="field-title" class="form-label">Название (title)</label>
                        <input type="text" class="form-control" id="field-title"
                               value="${this.escape(data.title)}"
                               placeholder="Например, Франция">
                    </div>

                    <div class="mb-3">
                        <label for="field-text" class="form-label">Описание (text)</label>
                        <textarea class="form-control" id="field-text" rows="3"
                                  placeholder="Срок оформления, условия и т. д.">${this.escape(data.text)}</textarea>
                    </div>

                    <div class="row g-3 mb-3">
                        <div class="col-sm-6">
                            <label for="field-price" class="form-label">Стоимость (price)</label>
                            <input type="number" class="form-control" id="field-price"
                                   value="${this.escape(data.price)}" placeholder="0">
                        </div>
                        <div class="col-sm-6">
                            <label for="field-visaType" class="form-label">Тип визы (visaType)</label>
                            <select class="form-select" id="field-visaType">
                                ${this.getVisaTypes(data.visaType)}
                            </select>
                        </div>
                    </div>

                    <p class="text-muted small mb-0">
                        Поля доступны для ввода. Сохранение данных появится в ЛР6 —
                        в ЛР5 кнопки «Сохранить» нет.
                    </p>
                </div>
            </form>
        `;
    }

    render(visa = null) {
        this.parent.insertAdjacentHTML('beforeend', this.getHTML(visa));
    }
}
