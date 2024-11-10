const pool = require('../../db');

// Mendapatkan semua metode pembayaran
const getAllPayments = async () => {
  const [rows] = await pool.query('SELECT * FROM resto_payments_methods');
  return rows;
};

// Mendapatkan metode pembayaran berdasarkan profile_id
const getPaymentsByProfileId = async (profileId) => {
  const [rows] = await pool.query('SELECT * FROM resto_payments_methods WHERE profile_id = ?', [profileId]);
  return rows;
};

// Menambahkan metode pembayaran baru
const addPaymentMethod = async (paymentData) => {
  const { title, number, profile_id } = paymentData;
  const [result] = await pool.query(
    'INSERT INTO resto_payments_methods (title, number, profile_id) VALUES (?, ?, ?)',
    [title, number, profile_id]
  );
  return result.insertId;
};

// Menghapus metode pembayaran berdasarkan payment_id
const deletePaymentMethod = async (paymentId) => {
  const [result] = await pool.query('DELETE FROM resto_payments_methods WHERE payment_id = ?', [paymentId]);
  return result.affectedRows;
};

module.exports = {
  getAllPayments,
  getPaymentsByProfileId,
  addPaymentMethod,
  deletePaymentMethod,
};
