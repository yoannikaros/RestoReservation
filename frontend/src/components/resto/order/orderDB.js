import { openDB } from 'idb';

// Fungsi untuk membuka atau membuat database
export const initDB = async () => {
    return openDB('orderDatabase', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('orders')) {
          const store = db.createObjectStore('orders', { keyPath: 'id' });
          store.createIndex('Idorder', 'Idorder', { unique: false });
        }
      },
    });
  };
  

  export const saveOrderId = async (Idorder) => {
    const db = await initDB();
    
    // Periksa apakah id order sudah ada
    const existingOrder = await db.get('orders', Idorder);
  
    // Jika sudah ada, lakukan update
    if (existingOrder) {
      await db.put('orders', { id: Idorder });
      console.log(`Idorder ${Idorder} updated in IndexedDB`);
    } else {
      // Jika belum ada, tambahkan data baru
      await db.add('orders', { id: Idorder });
      console.log(`Idorder ${Idorder} saved to IndexedDB`);
    }
  };
  

  export const getOrderId = async () => {
    try {
        const db = await initDB();

        // Transaksi untuk mengambil data 'orders'
        const tx = db.transaction('orders', 'readonly');
        const store = tx.objectStore('orders');
        
        // Ambil semua data dan urutkan berdasarkan 'id' secara menurun (terbaru di atas)
        const orders = await store.getAll();
        
        // Urutkan berdasarkan 'id' atau timestamp (pastikan Anda memiliki properti yang tepat untuk urutan ini)
        orders.sort((a, b) => b.id - a.id); // Jika ID bertambah, ID terbesar adalah yang terbaru
        
        console.log('Latest Order retrieved:', orders[0]);
        return orders.length ? orders[0].id : null;
    } catch (error) {
        console.error('Error retrieving order:', error);
        return null;
    }
};

  
