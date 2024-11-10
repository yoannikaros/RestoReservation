// src/cartDB.js
import { openDB } from 'idb';

const dbPromise = openDB('cartDB', 1, {
  upgrade(db) {
    const store = db.createObjectStore('cart', {
      keyPath: 'id_cart_resto',
      autoIncrement: true,
    });
    store.createIndex('profile_id', 'profile_id');
    store.createIndex('id_resto_item', 'id_resto_item');
    store.createIndex('variant_id', 'variant_id');
    store.createIndex('status', 'status');
    store.createIndex('title', 'title');
    store.createIndex('variant_title', 'variant_title');
    store.createIndex('harga', 'harga');
  },
});

// Fungsi untuk menambahkan item ke dalam database
export const addItemToCart = async (item) => {
  const db = await dbPromise;
  return db.add('cart', item);
};

// Fungsi untuk menghitung total harga dari semua item di dalam database
export const getTotalPrice = async () => {
  const db = await dbPromise;
  const items = await db.getAll('cart');
  
  // Menghitung total harga
  const total = items.reduce((sum, item) => sum + (item.harga * (item.quantity || 1)), 0);
  return total;
};


// Fungsi untuk mengambil semua item dari database
export const getCartItems = async () => {
  const db = await dbPromise;
  return db.getAll('cart');
};

// Fungsi untuk memperbarui quantity item
export const updateItemQuantity = async (id, quantity) => {
  const db = await dbPromise;
  const item = await db.get('cart', id);
  if (item) {
    item.quantity = quantity;
    return db.put('cart', item);
  }
};

// Fungsi untuk menghapus item dari database
export const deleteItemFromCart = async (id) => {
  const db = await dbPromise;
  return db.delete('cart', id);
};

export default dbPromise;