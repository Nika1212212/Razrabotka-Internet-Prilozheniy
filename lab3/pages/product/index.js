import { HeaderComponent } from '../../components/header/index.js';

export class ProductPage {
    constructor(parent, id, totalCount) {
        this.parent = parent;
        this.id = id;
        this.totalCount = totalCount; // Принимаем реальное количество
    }

    // Загружаем конкретную визу с сервера по ID
    async fetchVisa() {
        try {
            const response = await fetch(`http://localhost:3000/visas/${this.id}`);
            if (!response.ok) throw new Error('Не найдено');
            return await response.json();
        } catch (error) {
            console.error('Ошибка при загрузке визы:', error);
            return null;
        }
    }

    // Возврат на главную
    async clickHome() {
        // Динамический импорт, чтобы избежать циклической зависимости
        const { MainPage } = await import('../main/index.js');
        const mainPage = new MainPage(this.parent);
        mainPage.render();
    }

    getHTML(visa) {
        return `
            <div class="container pb-4">
                <div class="card mb-3 mt-4" style="max-width: 720px; margin: 0 auto;">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="${visa.src}" class="img-fluid rounded-start" alt="${visa.title}" style="height: 100%; object-fit: cover;">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${visa.title}</h5>
                                <p class="card-text">${visa.text}</p>
                                <p class="card-text">
                                    <span class="badge text-bg-danger fs-6">${visa.price} ₽</span>
                                </p>
                                <div class="category-line">
                                    <small>Тип визы (технически): <code>${visa.visaType}</code></small>
                                </div>
                                <button id="back-btn" class="btn btn-primary mt-2">Домой</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async render() {
        this.parent.innerHTML = '<p class="text-center mt-5">Загрузка...</p>';

        const visa = await this.fetchVisa();

        if (!visa) {
            this.parent.innerHTML = '<p class="text-center mt-5 text-danger">Заявка не найдена</p>';
            return;
        }

        this.parent.innerHTML = '';

        const header = new HeaderComponent(this.parent);
        // Передаем в шапку this.totalCount вместо mockApplications.length
        header.render(this.clickHome.bind(this), this.totalCount);

        this.parent.insertAdjacentHTML('beforeend', this.getHTML(visa));

        document.getElementById('back-btn').addEventListener('click', this.clickHome.bind(this));
    }
}