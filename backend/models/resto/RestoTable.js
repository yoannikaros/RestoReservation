const db = require('../../db');

const RestoTable = {
  // Mendapatkan semua tabel
  getAll: async () => {
    const [rows] = await pool.query('SELECT * FROM resto_tables');
    return rows;
  },

  // Mendapatkan tabel berdasarkan profile_id
  getByProfileId: async (profile_id) => {
    const [rows] = await pool.query('SELECT * FROM resto_tables WHERE profile_id = ?', [profile_id]);
    return rows;
  },

  // Menambah tabel baru
  create: async (data) => {
    const { profile_id, no_table, status } = data;
    const [result] = await pool.query(
      'INSERT INTO resto_tables (profile_id, no_table, status) VALUES (?, ?, ?)',
      [profile_id, no_table, status]
    );
    return { id_table: result.insertId, ...data };
  },

  // Mengubah tabel berdasarkan id_table
  update: async (id_table, data) => {
    const { profile_id, no_table, status } = data;
    await pool.query(
      'UPDATE resto_tables SET profile_id = ?, no_table = ?, status = ? WHERE id_table = ?',
      [profile_id, no_table, status, id_table]
    );
    return { id_table, ...data };
  },

  // Menghapus tabel berdasarkan id_table
  delete: async (id_table) => {
    await pool.query('DELETE FROM resto_tables WHERE id_table = ?', [id_table]);
    return { message: `Table with id ${id_table} deleted.` };
  },
};

module.exports = RestoTable;
