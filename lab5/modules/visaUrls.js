/**
 * Эндпоинты API бэкенда ЛР4 (http://localhost:3000/visas).
 * Базовый URL стоит в одном месте — при смене порта меняем только его.
 */
class VisaUrls {
    constructor() {
        this.baseUrl = 'http://localhost:3000';
    }

    /**
     * Список заявок. Фильтр по названию передаётся query-параметром title.
     * @param {{title?: string, visaType?: string}} filters
     */
    getVisas(filters = {}) {
        const params = new URLSearchParams();

        if (filters.title) {
            params.set('title', filters.title);
        }
        if (filters.visaType) {
            params.set('visaType', filters.visaType);
        }

        const query = params.toString();
        return `${this.baseUrl}/visas${query ? `?${query}` : ''}`;
    }

    /** Одна заявка по ID */
    getVisaById(id) {
        return `${this.baseUrl}/visas/${id}`;
    }

    /** Создание заявки */
    createVisa() {
        return `${this.baseUrl}/visas`;
    }

    /** Удаление заявки */
    removeVisaById(id) {
        return `${this.baseUrl}/visas/${id}`;
    }

    /** Обновление заявки */
    updateVisaById(id) {
        return `${this.baseUrl}/visas/${id}`;
    }
}

export const visaUrls = new VisaUrls();
