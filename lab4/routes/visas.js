const express = require('express');
const router = express.Router();
const visasController = require('../controllers/visasController');

router.get('/', visasController.getAllVisas);
router.get('/:id', visasController.getVisaById);
router.post('/', visasController.createVisa);
router.patch('/:id', visasController.updateVisa);
router.delete('/:id', visasController.deleteVisa);

module.exports = router;