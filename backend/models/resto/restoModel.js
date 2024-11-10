// models/restoModel.js
const db = require('../../db');

// Fungsi untuk mendapatkan semua data resto item beserta variannya
const getAllRestoItemsWithVariants = async () => {
  // Query untuk mendapatkan semua resto item beserta varian
  const [rows] = await db.execute(`
    SELECT 
      ri.id_resto_item,
      ri.profile_id,
      ri.title AS item_title,
      ri.description,
      ri.base_price,
      ri.category,
      ri.photo,
      ri.stock,
      ri.created_at AS item_created_at,
      rv.variant_id,
      rv.title AS variant_title,
      rv.extra_price,
      rv.created_at AS variant_created_at
    FROM resto_item AS ri
    LEFT JOIN resto_variants AS rv ON ri.id_resto_item = rv.id_resto_item
    ORDER BY ri.id_resto_item, rv.variant_id;
  `);

  // Format hasil menjadi struktur JSON yang lebih terorganisir
  const items = rows.reduce((acc, row) => {
    let item = acc.find(i => i.id_resto_item === row.id_resto_item);
    if (!item) {
      item = {
        id_resto_item: row.id_resto_item,
        profile_id: row.profile_id,
        title: row.item_title,
        description: row.description,
        base_price: row.base_price,
        category: row.category,
        photo: row.photo,
        stock: row.stock,
        created_at: row.item_created_at,
        variants: []
      };
      acc.push(item);
    }
    if (row.variant_id) {
      item.variants.push({
        variant_id: row.variant_id,
        title: row.variant_title,
        extra_price: row.extra_price,
        created_at: row.variant_created_at
      });
    }
    return acc;
  }, []);

  return items;
};

// Fungsi untuk mendapatkan data resto item dan varian tertentu berdasarkan id_resto_item dan variant_id
const getRestoItemWithVariantById = async (id_resto_item, variant_id) => {
  let query = `
    SELECT 
      ri.id_resto_item,
      ri.profile_id,
      ri.title AS item_title,
      ri.description,
      ri.base_price,
      ri.category,
      ri.photo,
      ri.stock,
      ri.created_at AS item_created_at,
      rv.variant_id,
      rv.title AS variant_title,
      rv.extra_price,
      rv.created_at AS variant_created_at
    FROM resto_item AS ri
    LEFT JOIN resto_variants AS rv ON ri.id_resto_item = rv.id_resto_item
    WHERE ri.id_resto_item = ?
  `;

  const params = [id_resto_item];

  // Jika variant_id ada, tambahkan ke query dan params
  if (variant_id) {
    query += ` AND rv.variant_id = ?`;
    params.push(variant_id);
  }

  const [rows] = await db.execute(query, params);

  // Jika tidak ada data ditemukan, kembalikan null
  if (rows.length === 0) return null;

  // Struktur data
  const item = {
    id_resto_item: rows[0].id_resto_item,
    profile_id: rows[0].profile_id,
    title: rows[0].item_title,
    description: rows[0].description,
    base_price: rows[0].base_price,
    category: rows[0].category,
    photo: rows[0].photo,
    stock: rows[0].stock,
    created_at: rows[0].item_created_at,
    variants: rows.map(row => ({
      variant_id: row.variant_id,
      title: row.variant_title,
      extra_price: row.extra_price,
      created_at: row.variant_created_at
    }))
  };

  return item;
};

module.exports = {
  getAllRestoItemsWithVariants,
  getRestoItemWithVariantById
};