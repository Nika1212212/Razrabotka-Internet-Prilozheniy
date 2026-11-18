const express = require('express');
const path = require('path');
const cors = require('cors');
const visasRouter = require('./routes/visas'); // 1. Импорт роутера
const visasService = require('./services/visasService');

const app = express();
const PORT = 3000;

const DATA_FILE_PATH = path.join(__dirname, 'data/visas.json');
visasService.init(DATA_FILE_PATH);

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// 2. ПОДКЛЮЧЕНИЕ РОУТЕРА (должно быть здесь, ДО обработки 404)
app.use('/visas', visasRouter); 

// 3. Обработчик 404 (должен быть ПОСЛЕ подключения всех роутеров)
app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен по адресу http://localhost:${PORT}`);
});