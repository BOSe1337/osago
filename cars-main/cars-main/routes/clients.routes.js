const express = require('express');
const router = express.Router();
const clientsController = require('../controller/clients.contoller');

router.post('/create', clientsController.addClient);
router.post('/update', clientsController.updateClient);
router.get('/export', clientsController.getExport);
router.get('/remove/:id', clientsController.removeClient);
router.get('/view', clientsController.viewClients);
router.get('/:id', clientsController.fetchOne);
router.get('/data/:email', clientsController.fetchByEmail);

module.exports = router;