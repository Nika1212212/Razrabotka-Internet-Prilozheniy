import { Router }       from './modules/router.js';
import { MainPage }     from './pages/main/index.js';
import { ProductPage }  from './pages/product/index.js';
import { VisaFormPage } from './pages/form/index.js';

const root = document.getElementById('root');

// Счётчик заявок сохраняется, чтобы шапка была корректной и при прямом переходе по URL.
const appState = {
    totalCount: Number(sessionStorage.getItem('lab5:totalCount')) || 0
};

const router = new Router(root);

router.addRoute('main', ({ title }) => {
    new MainPage(root, router, appState, title).render();
});

router.addRoute('product', ({ id }) => {
    new ProductPage(root, id, appState.totalCount, router).render();
});

router.addRoute('form', ({ id }) => {
    new VisaFormPage(root, id, appState.totalCount, router).render();
});

router.start();
