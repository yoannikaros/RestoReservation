// models/orderModel.js
const pool = require('../../db');

// Mendapatkan semua pesanan
const getAllOrders = async () => {
  const [rows] = await pool.query('SELECT * FROM resto_history_order');
  return rows;
};

// Mendapatkan pesanan berdasarkan profile_id
const getOrdersByProfileId = async (profileId) => {
  const [rows] = await pool.query('SELECT * FROM resto_history_order WHERE profile_id = ?', [profileId]);
  return rows;
};

// Menambahkan pesanan baru
const createOrder = async (orderData) => {
  const { name_item, variant, item_price, quantity, total_price, profile_id } = orderData;
  const [result] = await pool.query(
    'INSERT INTO resto_history_order (name_item, variant, item_price, quantity, total_price, profile_id) VALUES (?, ?, ?, ?, ?, ?)',
    [name_item, variant, item_price, quantity, total_price, profile_id]
  );
  return { id: result.insertId, ...orderData };
};

module.exports = {
  getAllOrders,
  getOrdersByProfileId,
  createOrder,
};
