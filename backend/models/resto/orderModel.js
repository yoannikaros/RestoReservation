const pool = require('../../db');

// Model untuk mengelola operasi `resto_order` dan menghubungkan dengan `resto_cart` dan `resto_payments_methods`
const RestoOrder = {
  // Mendapatkan semua order
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM resto_order');
    return rows;
  },

  // Mendapatkan order berdasarkan `id_order`
  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM resto_order WHERE id_order = ?', [id]);
    return rows[0];
  },

  // Mendapatkan order berdasarkan `profile_id`
  async getByProfileId(profileId) {
    const [rows] = await pool.query('SELECT * FROM resto_order WHERE profile_id = ?', [profileId]);
    return rows;
  },

  // Mendapatkan detail data berdasarkan `id_cart_resto` dan `payment_id`
  async getDetailsByCartAndPayment(idCartResto, paymentId) {
    const [rows] = await pool.query(`
      SELECT o.*, 
             c.profile_id AS cart_profile_id, c.id_resto_item, c.variant_id, c.quantity, c.note, c.status AS cart_status,
             p.title AS payment_title, p.number AS payment_number, p.profile_id AS payment_profile_id
      FROM resto_order o
      LEFT JOIN resto_cart c ON o.id_cart_resto = c.id_cart_resto
      LEFT JOIN resto_payments_methods p ON o.payment_id = p.payment_id
      WHERE o.id_cart_resto = ? AND o.payment_id = ?
    `, [idCartResto, paymentId]);
    return rows;
  },

  // Membuat order baru
async create(order) {
  const { profile_id, id_cart_resto, total_price, balance, amount, no_table, service, status, payment_id } = order;

  // Buat kueri SQL
  const [result] = await pool.query(
    `INSERT INTO resto_order (profile_id, id_cart_resto, total_price, balance, amount, no_table, service, status, created_at, payment_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
    [profile_id, id_cart_resto, total_price, balance, amount, no_table, service, status, payment_id]
  );

  return result.insertId;
},


 // Memperbarui status order berdasarkan `id_order`
 async updateStatusById(id, status) {
  await pool.query(
    'UPDATE resto_order SET status = ? WHERE id_order = ?',
    [status, id]
  );
},


  // Mengupdate order berdasarkan `id_order`
  async update(id, order) {
    const { total_price, balance, amount, no_table, service, status, payment_id } = order;
    await pool.query(
      `UPDATE resto_order SET total_price = ?, balance = ?, amount = ?, no_table = ?, service = ?, status = ?, payment_id = ?
       WHERE id_order = ?`,
      [total_price, balance, amount, no_table, service, status, payment_id, id]
    );
  },

  // Menghapus order berdasarkan `id_order`
  async delete(id) {
    await pool.query('DELETE FROM resto_order WHERE id_order = ?', [id]);
  }

  
};




module.exports = RestoOrder;