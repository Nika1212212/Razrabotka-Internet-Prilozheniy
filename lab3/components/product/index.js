export class ProductComponent {
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
            <div class="card mb-3" style="max-width: 720px;">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${data.src}" class="img-fluid rounded-start" alt="${data.title}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <div class="d-flex align-items-center gap-2 mb-2 flex-wrap">
                                <h5 class="card-title mb-0">${data.title}</h5>
                                <span class="badge text-bg-${cat.color}">${cat.label}</span>
                                <span class="badge text-bg-danger fs-6">${data.price} ₽</span>
                            </div>
                            <p class="card-text">${data.text}</p>
                            <p class="card-text category-line">
                                <small>Тип визы (технически): <code>${data.category}</code></small>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    render(data) {
        this.parent.insertAdjacentHTML('beforeend', this.getHTML(data));
    }
}