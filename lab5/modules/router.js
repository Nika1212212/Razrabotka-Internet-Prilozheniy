/**
 * Простой роутер на History API.
 * Меняет адресную строку без перезагрузки страницы и умеет работать
 * с кнопками «Назад/Вперёд» браузера (popstate).
 *
 * URL:
 *   index.html                      — главная
 *   index.html?title=Турция        — главная с фильтром
 *   index.html?view=product&id=1   — карточка заявки
 *   index.html?view=form           — добавление заявки
 *   index.html?view=form&id=1      — редактирование заявки
 */
export class Router {
    constructor(root) {
        this.root = root;
        this.routes = {};

        window.addEventListener('popstate', () => this.resolve());
    }

    addRoute(name, handler) {
        this.routes[name] = handler;
    }

    /** Что сейчас запрошено в адресной строке */
    getState() {
        const params = new URLSearchParams(window.location.search);
        const requestedView = params.get('view') || 'main';
        const view = this.routes[requestedView] ? requestedView : 'main';

        const rawId = params.get('id');
        const id = rawId !== null && rawId !== '' && Number.isFinite(Number(rawId))
            ? Number(rawId)
            : null;

        return {
            view,
            id: view === 'product' || view === 'form' ? id : null,
            title: params.get('title') || ''
        };
    }

    /**
     * Переход на другую «вкладку» приложения.
     * @param {{view?: string, id?: number|null, title?: string}} state
     * @param {{replace?: boolean}} options
     */
    navigate(state = {}, options = {}) {
        const next = {
            view: state.view || 'main',
            id: state.id ?? null,
            title: state.title || ''
        };

        const params = new URLSearchParams();
        if (next.view !== 'main') params.set('view', next.view);
        if (next.id !== null && Number.isFinite(next.id)) params.set('id', String(next.id));
        if (next.title) params.set('title', next.title);

        const query = params.toString();
        const url = `${window.location.pathname}${query ? `?${query}` : ''}`;

        window.history[options.replace ? 'replaceState' : 'pushState'](next, '', url);
        this.resolve();
    }

    /** Первый рендер: привести URL к каноническому виду и отрисовать нужную страницу */
    start() {
        this.navigate(this.getState(), { replace: true });
    }

    resolve() {
        const state = this.getState();
        const handler = this.routes[state.view] || this.routes.main;
        if (handler) handler(state);
    }
}
