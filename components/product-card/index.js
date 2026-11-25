export class ProductCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getCategoryLabel(category) {
        const map = {
            tourist:  { label: 'Туристическая', color: 'success' },
            business: { label: 'Деловая',       color: 'warning' },
            student:  { label: 'Студенческая',  color: 'info'    },
            work:     { label: 'Рабочая',       color: 'primary' }
        };
        return map[category] || { label: category, color: 'secondary' };
    }

    getHTML(data) {
        const cat = this.getCategoryLabel(data.category);
        return `
            <div class="card" style="width: 18rem;">
                <img src="${data.src}" class="card-img-top" alt="${data.title}">
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title mb-0">${data.title}</h5>
                        <span class="badge text-bg-${cat.color}">${cat.label}</span>
                    </div>
                    <p class="card-text">${data.text}</p>
                    <p class="card-text mb-2">
                        <span class="badge text-bg-danger fs-6">${data.price} ₽</span>
                    </p>
                    <div class="mt-auto d-flex gap-2">
                        <button class="btn btn-primary btn-sm"
                                id="click-card-${data.id}"
                                data-id="${data.id}">Подробнее</button>
                        <button class="btn btn-danger btn-sm"
                                id="delete-card-${data.id}"
                                data-id="${data.id}">Удалить</button>
                    </div>
                </div>
            </div>
        `;
    }

    addListeners(data, clickListener, deleteListener) {
        document
            .getElementById(`click-card-${data.id}`)
            .addEventListener('click', clickListener);
        document
            .getElementById(`delete-card-${data.id}`)
            .addEventListener('click', deleteListener);
    }

    render(data, clickListener, deleteListener) {
        this.parent.insertAdjacentHTML('beforeend', this.getHTML(data));
        this.addListeners(data, clickListener, deleteListener);
    }
}