// routes/restoRoutes.js
const express = require('express');
const router = express.Router();
const restoController = require('../../controllers/resto/restoController');

//router.get('/resto', restoController.getAllRestoItems);

// Route untuk mendapatkan resto item tertentu berdasarkan id_resto_item dan variant_id
router.get('/resto/:id_resto_item/:variant_id?', restoController.getRestoItemById);


module.exports = router;
