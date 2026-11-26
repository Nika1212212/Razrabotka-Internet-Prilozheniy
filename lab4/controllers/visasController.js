const visasService = require('../services/visasService');

const getAllVisas = (req, res) => {
    const { title, visaType } = req.query;
    const visas = visasService.findAll(title, visaType);
    res.json(visas);
};

const getVisaById = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const visa = visasService.findOne(id);
    if (!visa) {
        return res.status(404).json({ error: 'Виза не найдена' });
    }
    res.json(visa);
};

const createVisa = (req, res) => {
    const { src, title, text, price, visaType } = req.body;
    if (!src || !title || !text || !visaType) {
        return res.status(400).json({ error: 'Не все обязательные поля заполнены' });
    }
    const newVisa = visasService.create({ src, title, text, price, visaType });
    res.status(201).json(newVisa);
};

const updateVisa = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const updatedVisa = visasService.update(id, req.body);
    if (!updatedVisa) {
        return res.status(404).json({ error: 'Виза не найдена' });
    }
    res.json(updatedVisa);
};

const deleteVisa = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const success = visasService.remove(id);
    if (!success) {
        return res.status(404).json({ error: 'Виза не найдена' });
    }
    res.status(204).send();
};

module.exports = {
    getAllVisas,
    getVisaById,
    createVisa,
    updateVisa,
    deleteVisa
};
