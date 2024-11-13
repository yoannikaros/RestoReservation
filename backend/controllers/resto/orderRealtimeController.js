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
// Controller untuk mengupdate status order berdasarkan input dari body request
const updateOrderStatus = async (req, res) => {
  const { id_order } = req.params;
  const { status } = req.body; // Mendapatkan status dari request body

  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }

  try {
    // Update status order sesuai dengan status yang diberikan
    await Order.updateOrderStatus(id_order, status); // Ubah status ke status yang diterima dari request

    // Emit event real-time ke semua client yang terhubung
    const io = req.app.get('io');
    io.emit('order-status-update', { id_order, status });

    res.json({ message: `Order status updated to ${status}` });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getOrderStatus,
  updateOrderStatus,
};