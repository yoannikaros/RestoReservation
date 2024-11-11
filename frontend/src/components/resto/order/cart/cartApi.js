import { openDB } from 'idb';

const API_URL = 'http://localhost:3000/api/cart';

// Function to retrieve all items from the IndexedDB
const getCartItemsFromIDB = async () => {
  const db = await openDB('cartDB', 1);
  return await db.getAll('cart');
};

// Function to submit each cart item to the API
export const submitCartToApi = async () => {
  const cartItems = await getCartItemsFromIDB();
  if (!cartItems.length) {
    throw new Error('No items in cart to submit.');
  }

  const submitItem = async (item) => {
    const cartData = {
      profile_id: item.profile_id,
      id_resto_item: item.id_resto_item,
      variant_id: item.variant_id || 0,
      quantity: item.quantity,
      note: item.note || '', // use an empty string if no note
      status: item.status || 'pending', // default to 'pending' if status is missing
      no_trans : 1
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

  // Loop through all cart items and submit each one
  for (const item of cartItems) {
    await submitItem(item);
  }
};
