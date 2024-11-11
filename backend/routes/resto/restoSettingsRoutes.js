const express = require('express');
const router = express.Router();
const restoSettingsController = require('../../controllers/resto/restoSettingsController');

// Mendapatkan semua data
router.get('/settings', restoSettingsController.getAllSettings);

// Mendapatkan data berdasarkan profile_id
router.get('/settings/profile/:profile_id', restoSettingsController.getSettingsByProfileId);

// Menambahkan data baru
router.post('/settings', restoSettingsController.createSetting);

// Memperbarui data berdasarkan id_setting
router.put('/settings/:id_setting', restoSettingsController.updateSetting);

// Menghapus data berdasarkan id_setting
router.delete('/settings/:id_setting', restoSettingsController.deleteSetting);

module.exports = router;
