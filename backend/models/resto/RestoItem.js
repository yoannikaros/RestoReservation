const db = require('../../db');

class RestoItem {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM resto_item');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM resto_item WHERE id_resto_item = ?', [id]);
    return rows[0];
  }

  static async create(data) {
    const { profile_id, title, description, base_price, category, photo, stock } = data;
    const [result] = await db.query(
      'INSERT INTO resto_item (profile_id, title, description, base_price, category, photo, stock, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
      [profile_id, title, description, base_price, category, photo, stock]
    );
    return result.insertId;
  }

  static async update(id, data) {
    const { profile_id, title, description, base_price, category, photo, stock } = data;
    await db.query(
      'UPDATE resto_item SET profile_id = ?, title = ?, description = ?, base_price = ?, category = ?, photo = ?, stock = ? WHERE id_resto_item = ?',
      [profile_id, title, description, base_price, category, photo, stock, id]
    );
  }

  static async delete(id) {
    await db.query('DELETE FROM resto_item WHERE id_resto_item = ?', [id]);
  }

  static async getByProfileId(profileId) {
    const [rows] = await db.query('SELECT * FROM resto_item WHERE profile_id = ?', [profileId]);
    return rows;
  }


}

module.exports = RestoItem;
