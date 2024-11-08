const pool = require('../../db');

const getAllOrders = async () => {
  const [rows] = await pool.query(`
    SELECT 
      ro.*,
      rc.id_cart_resto, rc.profile_id AS cart_profile_id, rc.id_resto_item, rc.variant_id, rc.quantity, rc.status AS cart_status,
      rpm.payment_id, rpm.title, rpm.number, rpm.profile_id AS payment_profile_id
    FROM 
      resto_order ro
    JOIN 
      resto_cart rc ON ro.id_cart_resto = rc.id_cart_resto
    LEFT JOIN 
      resto_payments_methods rpm ON ro.payment_id = rpm.payment_id
  `);
  return rows;
};

const getOrderById = async (id) => {
  const [rows] = await pool.query(`
    SELECT 
      ro.*,
      rc.id_cart_resto, rc.profile_id AS cart_profile_id, rc.id_resto_item, rc.variant_id, rc.quantity, rc.status AS cart_status,
      rpm.payment_id, rpm.title, rpm.number, rpm.profile_id AS payment_profile_id
    FROM 
      resto_order ro
    JOIN 
      resto_cart rc ON ro.id_cart_resto = rc.id_cart_resto
    LEFT JOIN 
      resto_payments_methods rpm ON ro.payment_id = rpm.payment_id
    WHERE 
      ro.id_order = ?
  `, [id]);
  return rows;
};

const createOrder = async (orderData) => {
  const { id_cart_resto, total_price, balance, amount, status, payment_id } = orderData;
  const [result] = await pool.query(`
    INSERT INTO resto_order (id_cart_resto, total_price, balance, amount, status, created_at, payment_id)
    VALUES (?, ?, ?, ?, ?, NOW(), ?)
  `, [id_cart_resto, total_price, balance, amount, status, payment_id]);
  return result.insertId;
};

const updateOrder = async (id, orderData) => {
  const { total_price, balance, amount, status, payment_id } = orderData;
  await pool.query(`
    UPDATE resto_order
    SET total_price = ?, balance = ?, amount = ?, status = ?, payment_id = ?
    WHERE id_order = ?
  `, [total_price, balance, amount, status, payment_id, id]);
};

const deleteOrder = async (id) => {
  await pool.query(`
    DELETE FROM resto_order
    WHERE id_order = ?
  `, [id]);
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};
