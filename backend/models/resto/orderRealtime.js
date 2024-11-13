// models/resto/orderModel.js
const pool = require('../../db'); // Sesuaikan lokasi file db.js Anda

// Fungsi untuk mendapatkan status order berdasarkan id_order
const getOrderStatus = async (id_order) => {
  const [rows] = await pool.query(
    'SELECT status FROM resto_order WHERE id_order = ?',
    [id_order]
  );
  return rows[0] || null;
};

// Fungsi untuk mengupdate status order menjadi 'paid'
const updateOrderStatus = async (id_order, status) => {
  const query = 'UPDATE resto_order SET status = ? WHERE id_order = ?';
  const values = [status, id_order];

  try {
    const [result] = await pool.execute(query, values);
    if (result.affectedRows === 0) {
      throw new Error('Order not found');
    }
  } catch (error) {
    throw new Error('Error updating order status');
  }
};


module.exports = {
  getOrderStatus,
  updateOrderStatus,
};
