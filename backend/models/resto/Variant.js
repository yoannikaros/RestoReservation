// models/Variant.js
const pool = require('../../db');

const Variant = {

  async getByRestoItemId(idRestoItem) {
    const [rows] = await pool.query('SELECT * FROM resto_variants WHERE id_resto_item = ?', [idRestoItem]);
    return rows;
  },

  async getAll() {
    const [rows] = await pool.query('SELECT * FROM resto_variants');
    return rows;
  },
  
  async getById(variantId) {
    const [rows] = await pool.query('SELECT * FROM resto_variants WHERE variant_id = ?', [variantId]);
    return rows[0];
  },

  async create(data) {
    const { id_resto_item, title, extra_price } = data;
    const [result] = await pool.query(
      'INSERT INTO resto_variants (id_resto_item, title, extra_price, created_at) VALUES (?, ?, ?, NOW())',
      [id_resto_item, title, extra_price]
    );
    return result.insertId;
  },

  async update(variantId, data) {
    const { id_resto_item, title, extra_price } = data;
    await pool.query(
      'UPDATE resto_variants SET id_resto_item = ?, title = ?, extra_price = ? WHERE variant_id = ?',
      [id_resto_item, title, extra_price, variantId]
    );
  },

  async delete(variantId) {
    await pool.query('DELETE FROM resto_variants WHERE variant_id = ?', [variantId]);
  },
};

module.exports = Variant;
