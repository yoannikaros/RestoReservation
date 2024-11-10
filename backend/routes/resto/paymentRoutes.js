// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../../controllers/resto/paymentController');

// Mendapatkan semua metode pembayaran
router.get('/pay', paymentController.getAllPayments);

// Mendapatkan metode pembayaran berdasarkan profile_id
router.get('/pay/profile/:profile_id', paymentController.getPaymentsByProfileId);

// Menambahkan metode pembayaran baru
router.post('/pay', paymentController.addPaymentMethod);

// Menghapus metode pembayaran berdasarkan payment_id
router.delete('/pay/:payment_id', paymentController.deletePaymentMethod);

module.exports = router;
