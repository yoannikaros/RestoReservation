const Order = require('../../models/resto/orderRealtime');

// Controller untuk mendapatkan status order berdasarkan id_order
const getOrderStatus = async (req, res) => {
  const { id_order } = req.params;

  try {
    const order = await Order.getOrderStatus(id_order);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Error fetching order status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller untuk mengupdate status order menjadi 'paid'
const updateOrderStatusToPaid = async (req, res) => {
  const { id_order } = req.params;

  try {
    await Order.updateOrderStatusToPaid(id_order); // Update status ke 'paid'

    // Emit event real-time ke semua client yang terhubung
    const io = req.app.get('io');
    io.emit('order-status-update', { id_order, status: 'paid' });

    res.json({ message: 'Order status updated to paid' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getOrderStatus,
  updateOrderStatusToPaid,
};