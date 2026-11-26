# Лабораторные работы по разработке веб-приложений

Структура репозитория: файлы каждой лабораторной работы лежат в своей папке.

| Папка | Содержание |
|---|---|
| `lab1/` | ЛР1 — калькулятор на HTML/CSS, отчёт (DOCX и PDF) |
| `lab2/` | ЛР2 — калькулятор на HTML/CSS/JS (`script.js`), отчёты |
| `lab3/` | ЛР3 — «Визовый центр РФ», фронтенд на ES-модулях + локальные данные, отчёт |
| `lab4/` | ЛР4 — REST API на Node.js/Express (слои routes/controllers/services/data), коллекция Postman, отчёт |
| `lab5/` | ЛР5 — AJAX/XHR-запросы к API из ЛР4, фильтрация по `title`, DELETE, отчёт |

## Запуск

- `lab1/calculator.html` и `lab2/calculator2.html` открываются прямо в браузере.
- `lab3/`: `npm install`, затем открыть `index.html` через Live Server.
- `lab4/`: `npm install`, затем `npm start` — API поднимается на `http://localhost:3000`, CORS включён.
- `lab5/`: запустить API из `lab4/` и открыть `lab5/index.html` через Live Server (порт должен отличаться от 3000).
