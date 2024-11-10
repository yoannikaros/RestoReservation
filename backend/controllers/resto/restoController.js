// controllers/restoController.js
const restoModel = require('../../models/resto/restoModel');


// Mendapatkan semua resto items beserta variannya
const getAllRestoItems = async (req, res) => {
  try {
    const items = await restoModel.getAllRestoItemsWithVariants();
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Mendapatkan resto item dan varian tertentu berdasarkan id_resto_item dan variant_id
const getRestoItemById = async (req, res) => {
  const { id_resto_item, variant_id } = req.params;
  
  try {
    const item = await restoModel.getRestoItemWithVariantById(id_resto_item, variant_id);

    if (!item) {
      return res.status(404).json({ error: 'Data not found' });
    }

    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllRestoItems,
  getRestoItemById
};