const express = require('express');
const router = express.Router();
const carsController = require('../controller/cars.controller');

router.get('/marks', carsController.getMarks);
router.get('/:mark', carsController.getModels);

module.exports = router;