const restoSettingsModel = require('../../models/resto/restoSettingsModel');

// Mendapatkan semua data
async function getAllSettings(req, res) {
  try {
    const settings = await restoSettingsModel.getAllSettings();
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
}

// Mendapatkan data berdasarkan profile_id
async function getSettingsByProfileId(req, res) {
  const { profile_id } = req.params;
  try {
    const settings = await restoSettingsModel.getSettingsByProfileId(profile_id);
    if (settings.length === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan untuk profile_id ini.' });
    }
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
}

// Menambahkan data baru
async function createSetting(req, res) {
  const { profile_id, serveType } = req.body;
  try {
    const setting = await restoSettingsModel.createSetting(profile_id, serveType);
    res.status(201).json(setting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal menambahkan data.' });
  }
}

// Memperbarui data
async function updateSetting(req, res) {
  const { id_setting } = req.params;
  const { profile_id, serveType } = req.body;
  try {
    const affectedRows = await restoSettingsModel.updateSetting(id_setting, profile_id, serveType);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan untuk id_setting ini.' });
    }
    res.json({ message: 'Data berhasil diperbarui.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal memperbarui data.' });
  }
}

// Menghapus data
async function deleteSetting(req, res) {
  const { id_setting } = req.params;
  try {
    const affectedRows = await restoSettingsModel.deleteSetting(id_setting);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan untuk id_setting ini.' });
    }
    res.json({ message: 'Data berhasil dihapus.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal menghapus data.' });
  }
}

module.exports = {
  getAllSettings,
  getSettingsByProfileId,
  createSetting,
  updateSetting,
  deleteSetting,
};
