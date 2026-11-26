import { HeaderComponent }      from '../../components/header/index.js';
import { VisaFormComponent }    from '../../components/visa-form/index.js';
import { ajax }                 from '../../modules/ajax.js';
import { visaUrls }             from '../../modules/visaUrls.js';

/**
 * Страница добавления (id === null) / редактирования (id задан) заявки.
 * Данные для редактирования приходят по XHR GET /visas/:id.
 */
export class VisaFormPage {
    constructor(parent, id = null, totalCount = 0, router = null) {
        this.parent = parent;
        this.id = id;
        this.totalCount = totalCount;
        this.router = router;
    }

    /** Переход через роутер; запасной вариант для старого кэшированного main.js */
    goHome() {
        if (this.router) {
            this.router.navigate({ view: 'main' });
            return;
        }

        import('../main/index.js').then(({ MainPage }) => {
            new MainPage(this.parent).render();
        });
    }

    get pageRoot() {
        return document.getElementById('form-page');
    }

    getData(callback) {
        if (this.id === null) {
            callback(null, 200); // новая заявка — поля пустые
            return;
        }

        ajax.get(visaUrls.getVisaById(this.id), callback);
    }

    clickHome() {
        this.goHome();
    }

    render() {
        this.parent.innerHTML = '<p class="text-center mt-5">Загрузка формы...</p>';

        this.getData((visa, status) => {
            if (this.id !== null && (status !== 200 || !visa)) {
                this.parent.innerHTML = '<p class="text-center mt-5 text-danger">Заявка не найдена</p>';
                return;
            }

            this.parent.innerHTML = '';

            const header = new HeaderComponent(this.parent);
            header.render(this.clickHome.bind(this), this.totalCount);

            this.parent.insertAdjacentHTML('beforeend', `
                <div class="container pb-4" id="form-page">
                    ${this.id === null
                        ? '<h4 class="mt-4 mb-3">Добавление заявки</h4>'
                        : '<h4 class="mt-4 mb-3">Редактирование заявки</h4>'}
                    <div class="d-flex justify-content-start mb-3">
                        <button id="back-btn" class="btn btn-sm">← Назад</button>
                    </div>
                </div>
            `);

            const form = new VisaFormComponent(this.pageRoot);
            form.render(visa);

            document.getElementById('back-btn').addEventListener('click', this.clickHome.bind(this));
        });
    }
}
