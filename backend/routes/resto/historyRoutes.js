// routes/orderRoutes.js
const express = require('express');
const orderController = require('../../controllers/resto/historyController');
const router = express.Router();

// Endpoint untuk mendapatkan semua pesanan
router.get('/orders', orderController.getAllOrders);

// Endpoint untuk mendapatkan pesanan berdasarkan profile_id
router.get('/orders/profile/:profile_id', orderController.getOrdersByProfileId);

// Endpoint untuk membuat pesanan baru
router.post('/orders', orderController.createOrder);

module.exports = router;
