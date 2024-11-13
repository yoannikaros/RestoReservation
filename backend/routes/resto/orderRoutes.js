const express = require('express');
const router = express.Router();
const restoOrderController = require('../../controllers/resto/orderController');

// Mendapatkan semua order
router.get('/pemesanan', restoOrderController.getAllOrders);

// Mendapatkan order berdasarkan `id_order`
router.get('/pemesanan/:id', restoOrderController.getOrderById);

// Mendapatkan order berdasarkan `profile_id`
router.get('/pemesanan/profile/:profile_id', restoOrderController.getOrderByProfileId);

// Mendapatkan detail order, cart, dan payment berdasarkan `id_cart_resto` dan `payment_id`
router.get('/pemesanan/cart/:id_cart_resto/payment/:payment_id', restoOrderController.getDetailsByCartAndPayment);

// Membuat order baru
router.post('/pemesanan', restoOrderController.createOrder);

// Mengupdate order berdasarkan `id_order`
router.put('/pemesanan/:id', restoOrderController.updateOrder);

// Menghapus order berdasarkan `id_order`
router.delete('/pemesanan/:id', restoOrderController.deleteOrder);

// Route untuk update status order berdasarkan `id_order`
router.put('/pemesanan/status/:id', restoOrderController.updateOrderStatus);

module.exports = router;
