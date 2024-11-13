const RestoOrder = require('../../models/resto/orderModel');

// Mendapatkan semua order
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await RestoOrder.getAll();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data orders' });
  }
};

// Mendapatkan order berdasarkan ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await RestoOrder.getById(req.params.id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: 'Order tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data order' });
  }
};

// Mendapatkan order berdasarkan `profile_id`
exports.getOrderByProfileId = async (req, res) => {
  try {
    const orders = await RestoOrder.getByProfileId(req.params.profile_id);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data orders berdasarkan profile_id' });
  }
};

// Mendapatkan detail order, cart, dan payment berdasarkan `id_cart_resto` dan `payment_id`
exports.getDetailsByCartAndPayment = async (req, res) => {
  try {
    const { id_cart_resto, payment_id } = req.params;
    const details = await RestoOrder.getDetailsByCartAndPayment(id_cart_resto, payment_id);
    if (details.length > 0) {
      res.json(details);
    } else {
      res.status(404).json({ error: 'Data tidak ditemukan untuk kombinasi id_cart_resto dan payment_id ini' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data detail' });
  }
};

// Membuat order baru
exports.createOrder = async (req, res) => {
  try {
    const id = await RestoOrder.create(req.body);
    
    // Ubah id menjadi id_order dalam respons agar sesuai dengan yang diharapkan frontend
    res.status(201).json({ message: 'Order berhasil dibuat', id_order: id });
  } catch (error) {
    res.status(500).json({ error: 'Gagal membuat order baru' });
  }
};


// Mengupdate order
exports.updateOrder = async (req, res) => {
  try {
    await RestoOrder.update(req.params.id, req.body);
    res.json({ message: 'Order berhasil diperbarui' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal memperbarui order' });
  }
};

// Menghapus order
exports.deleteOrder = async (req, res) => {
  try {
    await RestoOrder.delete(req.params.id);
    res.json({ message: 'Order berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus order' });
  }
};


// Mendapatkan status order berdasarkan `id_order`
exports.getOrderStatusById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await RestoOrder.getById(id);
    if (order) {
      req.io.emit('statusUpdate', { id_order: id, status: order.status });
      res.json({ status: order.status });
    } else {
      res.status(404).json({ error: 'Order tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil status order' });
  }
};

// Mengupdate status order berdasarkan `id_order` dan memancarkan event statusUpdate
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await RestoOrder.updateStatusById(id, status);
    req.io.emit('statusUpdate', { id_order: id, status });
    res.json({ message: 'Status order berhasil diperbarui', status });
  } catch (error) {
    res.status(500).json({ error: 'Gagal memperbarui status order' });
  }
};
