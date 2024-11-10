const express = require('express');
const router = express.Router();
const CartController  = require('../../controllers/resto/cartController');

router.get('/cart', CartController.getAllCarts);
router.get('/cart/profile/:profile_id', CartController.getCartByProfileId);
router.post('/cart', CartController.addToCart);
router.put('/cart/:id_cart_resto', CartController.updateQuantity);
router.delete('/cart/:id_cart_resto', CartController.deleteCartItem);


module.exports = router;
