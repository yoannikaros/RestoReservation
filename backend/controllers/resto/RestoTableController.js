const RestoTable = require('../../models/resto/RestoTable');

const RestoTableController = {
  getAll: async (req, res) => {
    try {
      const tables = await RestoTable.getAll();
      res.status(200).json(tables);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getByProfileId: async (req, res) => {
    try {
      const { profile_id } = req.params;
      const tables = await RestoTable.getByProfileId(profile_id);
      res.status(200).json(tables);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const data = req.body;
      const newTable = await RestoTable.create(data);
      res.status(201).json(newTable);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id_table } = req.params;
      const data = req.body;
      const updatedTable = await RestoTable.update(id_table, data);
      res.status(200).json(updatedTable);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { id_table } = req.params;
      const message = await RestoTable.delete(id_table);
      res.status(200).json(message);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = RestoTableController;
