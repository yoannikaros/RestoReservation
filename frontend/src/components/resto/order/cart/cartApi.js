// cartApi.js

import { openDB } from 'idb';

const API_URL = 'http://localhost:3000/api/cart';

const getLastTransactionNumberFromApi = async () => {
  try {
    const response = await fetch(`${API_URL}/last`);
    if (!response.ok) {
      throw new Error('Failed to fetch last transaction number.');
    }
    const data = await response.json();
    return data.lastTrans;
  } catch (error) {
    console.error('Error fetching last transaction:', error);
    return null;
  }
};

const incrementTransactionNumber = (lastTrans, prefix) => {
  const [, number] = lastTrans.split('-');
  const incrementedNumber = parseInt(number, 10) + 1;
  return `${prefix}-${incrementedNumber}`;
};

const getCartItemsFromIDB = async () => {
  const db = await openDB('cartDB', 1);
  return await db.getAll('cart');
};

// Modifikasi fungsi submitCartToApi untuk mereturn newTransactionNumber
export const submitCartToApi = async (notabel) => {
  const cartItems = await getCartItemsFromIDB();
  if (!cartItems.length) {
    throw new Error('No items in cart to submit.');
  }

  const lastTrans = await getLastTransactionNumberFromApi();
  if (!lastTrans) {
    throw new Error('No last transaction number found.');
  }
  
  const newTransactionNumber = incrementTransactionNumber(lastTrans, notabel);

  const submitItem = async (item) => {
    const cartData = {
      profile_id: item.profile_id,
      id_resto_item: item.id_resto_item,
      variant_id: item.variant_id || 0,
      quantity: item.quantity,
      note: item.note || '',
      status: item.status || 'pending',
      no_trans: newTransactionNumber 
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

  for (const item of cartItems) {
    await submitItem(item);
  }

  // Return newTransactionNumber setelah semua item berhasil dikirim
  return newTransactionNumber;
};
