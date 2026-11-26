export class HeaderComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(totalCount) {
        return `
            <nav class="navbar mb-3">
                <div class="container-fluid d-flex justify-content-between align-items-center">
                    <span class="navbar-brand mb-0 h1">🌍 Визовый центр РФ</span>
                    <div class="d-flex align-items-center gap-2">
                        <span class="badge text-bg-primary fs-6">
                            Всего заявок: ${totalCount}
                        </span>
                        <button id="home-button" class="btn btn-sm">Домой</button>
                    </div>
                </div>
            </nav>
        `;
    }

    addListeners(homeListener) {
        document.getElementById('home-button').addEventListener('click', homeListener);
    }

    render(homeListener, totalCount) {
        this.parent.insertAdjacentHTML('beforeend', this.getHTML(totalCount));
        this.addListeners(homeListener);
    }
}