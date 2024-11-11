
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
async function createSetting(profile_id, ScanServePay, ScanPayServe) {
  const [result] = await pool.query(
    'INSERT INTO resto_settings (profile_id, ScanServePay, ScanPayServe) VALUES (?, ?, ?)',
    [profile_id, ScanServePay, ScanPayServe]
  );
  return { id_setting: result.insertId, profile_id, ScanServePay, ScanPayServe };
}

// Memperbarui data berdasarkan id_setting
async function updateSetting(id_setting, profile_id, ScanServePay, ScanPayServe) {
  const [result] = await pool.query(
    'UPDATE resto_settings SET profile_id = ?, ScanServePay = ?, ScanPayServe = ? WHERE id_setting = ?',
    [profile_id, ScanServePay, ScanPayServe, id_setting]
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
