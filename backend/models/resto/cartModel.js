const pool = require('../../db');

// Model untuk mengambil data berdasarkan profile_id
const getCartByProfileId = async (profile_id) => {
    const query = `
      SELECT
        rc.id_cart_resto,
        rc.profile_id,
        rc.id_resto_item,
        rc.variant_id,
        rc.quantity,
        rc.note,
        rc.status,
        rv.title AS variant_title,
        rv.extra_price,
        ri.title AS item_title,
        ri.description,
        ri.base_price,
        ri.category,
        ri.photo,
        ri.stock
      FROM resto_cart AS rc
      LEFT JOIN resto_variants AS rv ON rc.variant_id = rv.variant_id
      LEFT JOIN resto_item AS ri ON rc.id_resto_item = ri.id_resto_item
      WHERE rc.profile_id = ?
    `;
    const [rows] = await pool.execute(query, [profile_id]);
    return rows;
  };
  
  const getAllCarts = async () => {
    const query = 'SELECT * FROM resto_cart';
    const [rows] = await pool.execute(query);
    return rows;
  };
  
  const addToCart = async (cartData) => {
    const { profile_id, no_trans, id_resto_item, variant_id, quantity, note, status } = cartData;
    const query = `
      INSERT INTO resto_cart (profile_id,no_trans, id_resto_item, variant_id, quantity, note, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [profile_id, no_trans, id_resto_item, variant_id, quantity, note, status]);
    return result.insertId;
  };
  
  // Update quantity di resto_cart berdasarkan id_cart_resto
  const updateQuantity = async (id_cart_resto, quantity) => {
    const query = `
      UPDATE resto_cart
      SET quantity = ?
      WHERE id_cart_resto = ?
    `;
    const [result] = await pool.execute(query, [quantity, id_cart_resto]);
    return result.affectedRows;
  };
  
  // Hapus item dari resto_cart berdasarkan id_cart_resto
  const deleteCartItem = async (id_cart_resto) => {
    const query = `
      DELETE FROM resto_cart
      WHERE id_cart_resto = ?
    `;
    const [result] = await pool.execute(query, [id_cart_resto]);
    return result.affectedRows;
  };

  const getLastTransactionNumber = async () => {
    const query = `SELECT no_trans FROM resto_cart ORDER BY id_cart_resto DESC LIMIT 1`;
    const [rows] = await pool.execute(query);
    return rows.length > 0 ? rows[0].no_trans : null;
  };
  
  module.exports = {
    getCartByProfileId,
    getAllCarts,
    addToCart,
    updateQuantity,
    deleteCartItem,
    getLastTransactionNumber
  };