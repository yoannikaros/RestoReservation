const express = require('express');
const RestoTableController = require('../../controllers/resto/RestoTableController');
const router = express.Router();

// Mendapatkan semua tabel
router.get('/tables', RestoTableController.getAll);

// Mendapatkan tabel berdasarkan profile_id
router.get('/tables/profile/:profile_id', RestoTableController.getByProfileId);

// Menambah tabel baru
router.post('/tables', RestoTableController.create);

// Mengubah tabel berdasarkan id_table
router.put('/tables/:id_table', RestoTableController.update);

// Menghapus tabel berdasarkan id_table
router.delete('/tables/:id_table', RestoTableController.delete);

module.exports = router;
