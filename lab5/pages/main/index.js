import { HeaderComponent }      from '../../components/header/index.js';
import { FilterComponent }      from '../../components/filter/index.js';
import { ProductCardComponent } from '../../components/product-card/index.js';
import { ajax }                 from '../../modules/ajax.js';
import { visaUrls }             from '../../modules/visaUrls.js';

export class MainPage {
    constructor(parent, router = null, appState = null, filter = '') {
        this.parent = parent;
        this.router = router;
        this.appState = appState || { totalCount: 0 };
        this.filter = filter;
        this.visas = []; // Данные, полученные по API
    }

    get pageRoot() {
        return document.getElementById('main-page');
    }

    /** GET /visas?title=... — фильтрация выполняется на сервере через query-параметр */
    getData(callback) {
        ajax.get(visaUrls.getVisas({ title: this.filter }), callback);
    }

    renderData(items) {
        if (items.length === 0) {
            this.pageRoot.insertAdjacentHTML('beforeend', '<p class="empty-state">Заявок нет</p>');
            return;
        }

        items.forEach(item => {
            const card = new ProductCardComponent(this.pageRoot);
            card.render(
                item,
                this.clickCard.bind(this),
                this.clickEdit.bind(this),
                this.clickDelete.bind(this)
            );
        });
    }

    getHTML() {
        return `
            <div class="container pb-4">
                <div class="d-flex gap-2 align-items-start mb-3 flex-nowrap panel-row">
                    <div id="filter-root" class="d-flex gap-2 align-items-center flex-wrap"></div>
                    <button id="add-button" class="btn add-button">+ Добавить новую заявку</button>
                </div>
                <div id="main-page" class="d-flex flex-wrap gap-3"></div>
            </div>
        `;
    }

    /** Переход через роутер; запасной вариант — старый кэшированный main.js без роутера */
    goTo(state) {
        if (this.router) {
            this.router.navigate(state);
            return;
        }

        if (state.view === 'product') {
            import('../product/index.js').then(({ ProductPage }) => {
                new ProductPage(this.parent, state.id, this.visas.length).render();
            });
        } else if (state.view === 'form') {
            import('../form/index.js').then(({ VisaFormPage }) => {
                new VisaFormPage(this.parent, state.id ?? null, this.visas.length).render();
            });
        }
    }

    clickCard(e) {
        const cardId = parseInt(e.target.dataset.id, 10);
        this.goTo({ view: 'product', id: cardId });
    }

    clickEdit(e) {
        const cardId = parseInt(e.target.dataset.id, 10);
        this.goTo({ view: 'form', id: cardId });
    }

    clickAdd() {
        this.goTo({ view: 'form' });
    }

    clickDelete(e) {
        const cardId = parseInt(e.target.dataset.id, 10);
        ajax.delete(visaUrls.removeVisaById(cardId), (_data, status) => {
            if (status === 204 || status === 200) {
                this.render();
            } else {
                console.error('Не удалось удалить заявку, статус:', status);
            }
        });
    }

    clickFilter(value) {
        this.filter = value.trim();
        if (this.router) {
            this.router.navigate({ view: 'main', title: this.filter });
        } else {
            this.render();
        }
    }

    clickReset() {
        this.filter = '';
        if (this.router) {
            this.router.navigate({ view: 'main' });
        } else {
            this.render();
        }
    }

    clickHome() {
        if (this.router) {
            this.router.navigate({ view: 'main' });
        } else {
            this.render();
        }
    }

    addListeners() {
        document.getElementById('add-button').addEventListener('click', this.clickAdd.bind(this));
    }

    render() {
        this.parent.innerHTML = '<p class="text-center mt-5">Загрузка заявок...</p>';

        this.getData((data, status) => {
            if (!Array.isArray(data)) {
                console.error('XHR-запрос не выполнен. Статус:', status, 'Адрес:', visaUrls.getVisas({ title: this.filter }));
                this.parent.innerHTML = `
                    <p class="text-center mt-5 text-danger">
                        Не удалось загрузить заявки (статус ${status}).<br>
                        Проверьте, что API запущен на http://localhost:3000 и включено расширение CORS Unblock.
                    </p>
                `;
                return;
            }

            this.visas = data.map(visa => ({ ...visa, category: visa.visaType }));
            this.appState.totalCount = this.visas.length;
            sessionStorage.setItem('lab5:totalCount', String(this.visas.length));

            this.parent.innerHTML = '';

            const header = new HeaderComponent(this.parent);
            header.render(this.clickHome.bind(this), this.visas.length);

            this.parent.insertAdjacentHTML('beforeend', this.getHTML());

            const filter = new FilterComponent(document.getElementById('filter-root'));
            filter.render(
                this.filter,
                this.clickFilter.bind(this),
                this.clickReset.bind(this)
            );

            this.renderData(this.visas);
            this.addListeners();
        });
    }
}
