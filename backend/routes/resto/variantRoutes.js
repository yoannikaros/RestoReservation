// routes/variantRoutes.js
const express = require('express');
const VariantController = require('../../controllers/resto/VariantController');
const router = express.Router();

router.get('/variants', VariantController.getAll);
router.get('/variants/:id', VariantController.getById);
router.post('/variants', VariantController.create);
router.put('/variants/:id', VariantController.update);
router.delete('/variants/:id', VariantController.delete);
router.get('/variants/resto_item/:id_resto_item', VariantController.getByRestoItemId); // Route baru

module.exports = router;
