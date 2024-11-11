import { openDB } from 'idb';

const API_URL = 'http://localhost:3000/api/cart';

// Fungsi untuk mengambil nomor transaksi terakhir dari endpoint API
const getLastTransactionNumberFromApi = async () => {
  try {
    const response = await fetch(`${API_URL}/last`);
    if (!response.ok) {
      throw new Error('Failed to fetch last transaction number.');
    }
    const data = await response.json();
    return data.lastTrans; // Mengambil lastTrans dari respons
  } catch (error) {
    console.error('Error fetching last transaction:', error);
    return null;
  }
};

// Fungsi untuk menambah angka di akhir nomor transaksi
const incrementTransactionNumber = (lastTrans, prefix) => {
  const [, number] = lastTrans.split('-');
  const incrementedNumber = parseInt(number, 10) + 1;
  return `${prefix}-${incrementedNumber}`;
};


// Fungsi untuk mengambil semua item dari IndexedDB
const getCartItemsFromIDB = async () => {
  const db = await openDB('cartDB', 1);
  return await db.getAll('cart');
};

// Fungsi untuk submit setiap item keranjang ke API
export const submitCartToApi = async (notabel) => {
  const cartItems = await getCartItemsFromIDB();
  if (!cartItems.length) {
    throw new Error('No items in cart to submit.');
  }

  // Ambil nomor transaksi terakhir dan tambah 1
  const lastTrans = await getLastTransactionNumberFromApi();
  if (!lastTrans) {
    throw new Error('No last transaction number found.');
  }
  
  // Gunakan `notabel` sebagai prefix baru
  const newTransactionNumber = incrementTransactionNumber(lastTrans, notabel);

  // Submit setiap item keranjang ke API
  const submitItem = async (item) => {
    const cartData = {
      profile_id: item.profile_id,
      id_resto_item: item.id_resto_item,
      variant_id: item.variant_id || 0,
      quantity: item.quantity,
      note: item.note || '', // gunakan string kosong jika tidak ada catatan
      status: item.status || 'pending', // default ke 'pending' jika status tidak ada
      no_trans: newTransactionNumber // Gunakan nomor transaksi terbaru
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cartData)
    });

    if (!response.ok) {
      throw new Error(`Failed to submit item: ${item.id_cart_resto}`);
    }
  };

  // Loop melalui semua item keranjang dan submit masing-masing
  for (const item of cartItems) {
    await submitItem(item);
  }
};
