const RestoItem = require('../../models/resto/RestoItem');

class RestoItemController {
  static async getAll(req, res) {
    try {
      const items = await RestoItem.getAll();
      res.json({ status: 'OK', results: { resto_item: items } });
    } catch (error) {
      res.status(500).json({ status: 'ERROR', message: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const item = await RestoItem.getById(req.params.id);
      if (!item) {
        return res.status(404).json({ status: 'NOT FOUND', message: 'Item not found' });
      }
      res.json({ status: 'OK', results: { resto_item: item } });
    } catch (error) {
      res.status(500).json({ status: 'ERROR', message: error.message });
    }
  }

  static async create(req, res) {
    try {
      const id = await RestoItem.create(req.body);
      res.status(201).json({ status: 'OK', message: 'Item created', id });
    } catch (error) {
      res.status(500).json({ status: 'ERROR', message: error.message });
    }
  }

  static async update(req, res) {
    try {
      await RestoItem.update(req.params.id, req.body);
      res.json({ status: 'OK', message: 'Item updated' });
    } catch (error) {
      res.status(500).json({ status: 'ERROR', message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      await RestoItem.delete(req.params.id);
      res.json({ status: 'OK', message: 'Item deleted' });
    } catch (error) {
      res.status(500).json({ status: 'ERROR', message: error.message });
    }
  }

  static async getByProfileId(req, res) {
    try {
      const profileId = req.params.profile_id;
      const items = await RestoItem.getByProfileId(profileId);

      if (items.length === 0) {
        return res.status(404).json({ status: 'NOT FOUND', message: 'No items found for this profile_id' });
      }

      res.json({ status: 'OK', results: { resto_item: items } });
    } catch (error) {
      res.status(500).json({ status: 'ERROR', message: error.message });
    }
  }

}

module.exports = RestoItemController;
