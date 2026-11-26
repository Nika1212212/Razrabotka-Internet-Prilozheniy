import { HeaderComponent } from '../../components/header/index.js';
import { ajax }            from '../../modules/ajax.js';
import { visaUrls }        from '../../modules/visaUrls.js';

export class ProductPage {
    constructor(parent, id, totalCount, router = null) {
        this.parent = parent;
        this.id = id;
        this.totalCount = totalCount;
        this.router = router;
    }

    /** Переход через роутер; запасной вариант — если страница открыта старым кэшированным main.js */
    goTo(state) {
        if (this.router) {
            this.router.navigate(state);
            return;
        }

        if (state.view === 'form') {
            import('../form/index.js').then(({ VisaFormPage }) => {
                new VisaFormPage(this.parent, state.id ?? null, this.totalCount).render();
            });
        } else {
            import('../main/index.js').then(({ MainPage }) => {
                new MainPage(this.parent).render();
            });
        }
    }

    /** GET /visas/:id через XHR */
    getData(callback) {
        ajax.get(visaUrls.getVisaById(this.id), callback);
    }

    escape(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    clickHome() {
        this.goTo({ view: 'main' });
    }

    clickEdit() {
        this.goTo({ view: 'form', id: this.id });
    }

    clickDelete() {
        ajax.delete(visaUrls.removeVisaById(this.id), (_data, status) => {
            if (status === 204 || status === 200) {
                this.clickHome();
            } else {
                console.error('Не удалось удалить заявку, статус:', status);
            }
        });
    }

    getHTML(visa) {
        return `
            <div class="container pb-4">
                <div class="card mb-3 mt-4" style="max-width: 720px; margin: 0 auto;">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="${this.escape(visa.src)}" class="img-fluid rounded-start"
                                 alt="${this.escape(visa.title)}"
                                 onerror="this.onerror=null;this.src='./images/placeholder.svg';"
                                 style="height: 100%; object-fit: cover;">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${this.escape(visa.title)}</h5>
                                <p class="card-text">${this.escape(visa.text)}</p>
                                <p class="card-text">
                                    <span class="badge text-bg-danger fs-6">${this.escape(visa.price)} ₽</span>
                                </p>
                                <div class="category-line">
                                    <small>Тип визы (технически): <code>${this.escape(visa.visaType)}</code></small>
                                </div>
                                <div class="d-flex gap-2 flex-wrap mt-2">
                                    <button id="edit-btn" class="btn btn-primary">Изменить</button>
                                    <button id="delete-btn" class="btn btn-danger">Удалить</button>
                                    <button id="back-btn" class="btn btn-sm">Домой</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    render() {
        this.parent.innerHTML = '<p class="text-center mt-5">Загрузка...</p>';

        this.getData((visa, status) => {
            if (status !== 200 || !visa) {
                console.error('Не удалось загрузить заявку, статус:', status);
                this.parent.innerHTML = '<p class="text-center mt-5 text-danger">Заявка не найдена</p>';
                return;
            }

            this.parent.innerHTML = '';

            const header = new HeaderComponent(this.parent);
            header.render(this.clickHome.bind(this), this.totalCount);

            this.parent.insertAdjacentHTML('beforeend', this.getHTML(visa));

            document.getElementById('edit-btn').addEventListener('click', this.clickEdit.bind(this));
            document.getElementById('delete-btn').addEventListener('click', this.clickDelete.bind(this));
            document.getElementById('back-btn').addEventListener('click', this.clickHome.bind(this));
        });
    }
}
