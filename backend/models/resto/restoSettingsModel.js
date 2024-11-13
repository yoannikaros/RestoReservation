
const pool = require('../../db');

// Mendapatkan semua data dari resto_settings
async function getAllSettings() {
  const [rows] = await pool.query('SELECT * FROM resto_settings');
  return rows;
}

// Mendapatkan data berdasarkan profile_id
async function getSettingsByProfileId(profile_id) {
  const [rows] = await pool.query('SELECT * FROM resto_settings WHERE profile_id = ?', [profile_id]);
  return rows;
}

// Menambahkan data baru ke resto_settings
async function createSetting(profile_id, serveType) {
  const [result] = await pool.query(
    'INSERT INTO resto_settings (profile_id, serveType) VALUES (?, ?, ?)',
    [profile_id, serveType]
  );
  return { id_setting: result.insertId, profile_id, serveType };
}

// Memperbarui data berdasarkan id_setting
async function updateSetting(id_setting, profile_id, serveType) {
  const [result] = await pool.query(
    'UPDATE resto_settings SET profile_id = ?, serveType = ? WHERE id_setting = ?',
    [profile_id, serveType, id_setting]
  );
  return result.affectedRows;
}

// Menghapus data berdasarkan id_setting
async function deleteSetting(id_setting) {
  const [result] = await pool.query('DELETE FROM resto_settings WHERE id_setting = ?', [id_setting]);
  return result.affectedRows;
}

module.exports = {
  getAllSettings,
  getSettingsByProfileId,
  createSetting,
  updateSetting,
  deleteSetting,
};
