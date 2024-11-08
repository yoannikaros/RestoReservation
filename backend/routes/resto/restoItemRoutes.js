const express = require('express');
const RestoItemController = require('../../controllers/resto/RestoItemController');

const router = express.Router();

router.get('/resto_items', RestoItemController.getAll);
router.get('/resto_items/:id', RestoItemController.getById);
router.post('/resto_items', RestoItemController.create);
router.put('/resto_items/:id', RestoItemController.update);
router.delete('/resto_items/:id', RestoItemController.delete);
router.get('/resto_items/profile/:profile_id', RestoItemController.getByProfileId);

module.exports = router;
