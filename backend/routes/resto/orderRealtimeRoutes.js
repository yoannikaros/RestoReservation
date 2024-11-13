const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/resto/orderRealtimeController');

// Endpoint untuk mendapatkan status order berdasarkan id_order
router.get('/order/status/:id_order', orderController.getOrderStatus);

// Socket.io: Real-time update status order
router.get('/order/realtime-status/:id_order', (req, res) => {
  const { io } = req.app; // Mengambil instance io dari request
  const { id_order } = req.params;

  // Emit event setiap kali status order berubah
  setInterval(async () => {
    try {
      const order = await orderController.getOrderStatus({ params: { id_order } });
      io.emit('order-status-update', { id_order, status: order.status });
    } catch (err) {
      console.error('Error fetching order status:', err);
    }
  }, 5000); // Perbarui setiap 5 detik (bisa disesuaikan)
  
  res.status(200).send('Listening for real-time updates');
});

// Endpoint untuk mengupdate status order menjadi 'paid'
router.put('/order/status/:id_order/paid', orderController.updateOrderStatusToPaid);


module.exports = router;
