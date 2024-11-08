// controllers/VariantController.js
const Variant = require('../../models/resto/Variant');

const VariantController = {

  async getByRestoItemId(req, res) {
    try {
      const variants = await Variant.getByRestoItemId(req.params.id_resto_item);
      if (variants.length === 0) {
        return res.status(404).json({ error: 'Variants tidak ditemukan untuk id_resto_item tersebut' });
      }
      res.json(variants);
    } catch (error) {
      res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data' });
    }
  },

  async getAll(req, res) {
    try {
      const variants = await Variant.getAll();
      res.json(variants);
    } catch (error) {
      res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data' });
    }
  },

  async getById(req, res) {
    try {
      const variant = await Variant.getById(req.params.id);
      if (!variant) {
        return res.status(404).json({ error: 'Variant tidak ditemukan' });
      }
      res.json(variant);
    } catch (error) {
      res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data' });
    }
  },

  async create(req, res) {
    try {
      const newVariantId = await Variant.create(req.body);
      res.status(201).json({ message: 'Variant berhasil dibuat', id: newVariantId });
    } catch (error) {
      res.status(500).json({ error: 'Terjadi kesalahan saat membuat variant' });
    }
  },

  async update(req, res) {
    try {
      await Variant.update(req.params.id, req.body);
      res.json({ message: 'Variant berhasil diperbarui' });
    } catch (error) {
      res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui variant' });
    }
  },

  async delete(req, res) {
    try {
      await Variant.delete(req.params.id);
      res.json({ message: 'Variant berhasil dihapus' });
    } catch (error) {
      res.status(500).json({ error: 'Terjadi kesalahan saat menghapus variant' });
    }
  },
};

module.exports = VariantController;
