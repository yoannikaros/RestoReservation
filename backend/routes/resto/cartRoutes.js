const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/resto/cartController');

router.get('/cart', cartController.getAllCarts);
router.get('/cart/:id', cartController.getCartById);
router.post('/cart', cartController.createCart);
router.put('/cart/:id', cartController.updateCart);
router.delete('/cart/:id', cartController.deleteCart);

module.exports = router;
