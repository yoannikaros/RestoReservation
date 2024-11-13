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
const updateOrderStatusToPaid = async (id_order) => {
  const [result] = await pool.query(
    'UPDATE resto_order SET status = ? WHERE id_order = ?',
    ['paid', id_order]
  );
  return result.affectedRows > 0;
};

module.exports = {
  getOrderStatus,
  updateOrderStatusToPaid,
};
