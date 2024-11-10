// models/Category.js
const pool = require('../../db');

class Category {
  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM resto_category');
    return rows;
  }

  static async getByProfileId(profile_id) {
    const [rows] = await pool.query('SELECT * FROM resto_category WHERE profile_id = ?', [profile_id]);
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.query('SELECT * FROM resto_category WHERE id_category = ?', [id]);
    return rows[0];
  }

  static async create({ profile_id, title }) {
    const [result] = await pool.query(
      'INSERT INTO resto_category (profile_id, title) VALUES (?, ?)',
      [profile_id, title]
    );
    return { id: result.insertId, profile_id, title };
  }

  static async update(id, { profile_id, title }) {
    await pool.query(
      'UPDATE resto_category SET profile_id = ?, title = ? WHERE id_category = ?',
      [profile_id, title, id]
    );
    return { id, profile_id, title };
  }

  static async delete(id) {
    await pool.query('DELETE FROM resto_category WHERE id_category = ?', [id]);
    return { id };
  }
}

module.exports = Category;
