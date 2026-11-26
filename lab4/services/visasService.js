const fileService = require('./fileService');

let dataFilePath;

const init = (filePath) => {
    dataFilePath = filePath;
};

const findAll = (title, visaType) => {
    const visas = fileService.readData(dataFilePath);
    let result = visas;
    if (title) {
        result = result.filter(v =>
            v.title.toLowerCase().includes(title.toLowerCase())
        );
    }
    if (visaType) {
        result = result.filter(v =>
            v.visaType.toLowerCase() === visaType.toLowerCase()
        );
    }
    return result;
};

const findOne = (id) => {
    const visas = fileService.readData(dataFilePath);
    return visas.find(v => v.id === id);
};

const create = (visaData) => {
    const visas = fileService.readData(dataFilePath);
    const newId = visas.length > 0
        ? Math.max(...visas.map(v => v.id)) + 1
        : 1;
    const newVisa = { id: newId, ...visaData };
    visas.push(newVisa);
    fileService.writeData(dataFilePath, visas);
    return newVisa;
};

const update = (id, visaData) => {
    const visas = fileService.readData(dataFilePath);
    const index = visas.findIndex(v => v.id === id);
    if (index === -1) return null;
    visas[index] = { ...visas[index], ...visaData };
    fileService.writeData(dataFilePath, visas);
    return visas[index];
};

const remove = (id) => {
    const visas = fileService.readData(dataFilePath);
    const filtered = visas.filter(v => v.id !== id);
    if (filtered.length === visas.length) return false;
    fileService.writeData(dataFilePath, filtered);
    return true;
};

module.exports = { init, findAll, findOne, create, update, remove };
