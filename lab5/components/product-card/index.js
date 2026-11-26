export class ProductCardComponent {
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

    getCategoryLabel(category) {
        const map = {
            tourist:  { label: 'Туристическая', color: 'success' },
            business: { label: 'Деловая',       color: 'warning' },
            student:  { label: 'Студенческая',  color: 'info'    },
            work:     { label: 'Рабочая',       color: 'primary' },
            schengen: { label: 'Шенгенская',    color: 'secondary' }
        };
        return map[category] || { label: category, color: 'secondary' };
    }

    getHTML(data) {
        const cat = this.getCategoryLabel(data.category);
        return `
            <div class="card" style="width: 18rem;">
                <img src="${this.escape(data.src)}" class="card-img-top" alt="${this.escape(data.title)}"
                     onerror="this.onerror=null;this.src='./images/placeholder.svg';">
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title mb-0">${this.escape(data.title)}</h5>
                        <span class="badge text-bg-${cat.color}">${this.escape(cat.label)}</span>
                    </div>
                    <p class="card-text">${this.escape(data.text)}</p>
                    <p class="card-text mb-2">
                        <span class="badge text-bg-danger fs-6">${this.escape(data.price)} ₽</span>
                    </p>
                    <div class="mt-auto d-flex gap-2 flex-wrap">
                        <button class="btn btn-primary btn-sm"
                                id="click-card-${data.id}"
                                data-id="${data.id}">Подробнее</button>
                        <button class="btn btn-outline-primary btn-sm"
                                id="edit-card-${data.id}"
                                data-id="${data.id}">Изменить</button>
                        <button class="btn btn-danger btn-sm"
                                id="delete-card-${data.id}"
                                data-id="${data.id}">Удалить</button>
                    </div>
                </div>
            </div>
        `;
    }

    addListeners(data, clickListener, editListener, deleteListener) {
        document
            .getElementById(`click-card-${data.id}`)
            .addEventListener('click', clickListener);
        document
            .getElementById(`edit-card-${data.id}`)
            .addEventListener('click', editListener);
        document
            .getElementById(`delete-card-${data.id}`)
            .addEventListener('click', deleteListener);
    }

    render(data, clickListener, editListener, deleteListener) {
        this.parent.insertAdjacentHTML('beforeend', this.getHTML(data));
        this.addListeners(data, clickListener, editListener, deleteListener);
    }
}
