import { HeaderComponent }      from '../../components/header/index.js';
import { ProductCardComponent } from '../../components/product-card/index.js';
import { ProductPage }          from '../product/index.js';

export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.filter = 'all';
        this.visas = []; // Данные с сервера
    }

    get pageRoot() {
        return document.getElementById('main-page');
    }

    // Загрузка данных с бэкенда
    async fetchVisas() {
        try {
            const response = await fetch('http://localhost:3000/visas');
            if (!response.ok) throw new Error('Ошибка сети');
            const data = await response.json();

            // Адаптируем visaType под category
            this.visas = data.map(visa => ({
                ...visa,
                category: visa.visaType 
            }));
        } catch (error) {
            console.error('Ошибка при загрузке виз с сервера:', error);
            this.visas = [];
        }
    }

    getHTML() {
        const countAll      = this.visas.length;
        const countTourist  = this.visas.filter(a => a.category === 'tourist').length;
        const countBusiness = this.visas.filter(a => a.category === 'business').length;
        const countStudent  = this.visas.filter(a => a.category === 'student').length;
        const countWork     = this.visas.filter(a => a.category === 'work').length;

        return `
            <div class="container pb-4">
                <div class="d-flex gap-2 align-items-center mb-3 flex-wrap panel-row">
                    <label class="form-label mb-0">Фильтр:</label>
                    <select id="filter-select" class="form-select" style="max-width: 300px;">
                        <option value="all">Все типы виз (${countAll})</option>
                        <option value="tourist">Туристические (${countTourist})</option>
                        <option value="business">Деловые (${countBusiness})</option>
                        <option value="student">Студенческие (${countStudent})</option>
                        <option value="work">Рабочие (${countWork})</option>
                    </select>
                    <button id="add-button" class="btn">+ Добавить новую заявку</button>
                </div>
                <div id="main-page" class="d-flex flex-wrap gap-3"></div>
            </div>
        `;
    }

    getData() {
        if (this.filter === 'all') return this.visas;
        return this.visas.filter(item => item.category === this.filter);
    }

    // ПЕРЕХОД НА КАРТОЧКУ (передаем this.visas.length)
    clickCard(e) {
        const cardId = parseInt(e.target.dataset.id);
        const productPage = new ProductPage(this.parent, cardId, this.visas.length);
        productPage.render();
    }

    async clickDelete(e) {
        const cardId = parseInt(e.target.dataset.id);
        try {
            const response = await fetch(`http://localhost:3000/visas/${cardId}`, {
                method: 'DELETE'
            });
            if (response.ok) { 
                this.render(); 
            }
        } catch (error) {
            console.error('Ошибка при удалении:', error);
        }
    }

    async clickAdd() {
        const newVisa = {
            src: "https://flagcdn.com/w320/it.png",
            title: `Новая заявка`,
            text: "Виза оформлена через API",
            price: 9999,
            visaType: "tourist"
        };

        try {
            const response = await fetch('http://localhost:3000/visas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newVisa)
            });
            if (response.status === 201) {
                this.render(); 
            }
        } catch (error) {
            console.error('Ошибка при добавлении:', error);
        }
    }

    clickFilter(e) {
        this.filter = e.target.value;
        this.render();
    }

    clickHome() {
        const mainPage = new MainPage(this.parent);
        mainPage.render();
    }

    addListeners() {
        document.getElementById('add-button').addEventListener('click', this.clickAdd.bind(this));
        document.getElementById('filter-select').addEventListener('change', this.clickFilter.bind(this));
    }

    async render() {
        this.parent.innerHTML = '<p class="text-center mt-5">Загрузка заявок...</p>';
        await this.fetchVisas();

        this.parent.innerHTML = '';
        const header = new HeaderComponent(this.parent);
        header.render(this.clickHome.bind(this), this.visas.length);

        this.parent.insertAdjacentHTML('beforeend', this.getHTML());
        document.getElementById('filter-select').value = this.filter;

        const data = this.getData();
        if (data.length === 0) {
            this.pageRoot.insertAdjacentHTML('beforeend', '<p class="empty-state">Заявок нет</p>');
        } else {
            data.forEach(item => {
                const card = new ProductCardComponent(this.pageRoot);
                card.render(item, this.clickCard.bind(this), this.clickDelete.bind(this));
            });
        }
        this.addListeners();
    }
}