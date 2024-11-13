import { submitCartToApi } from './cartApi';
import { getProfileIdFromCart } from './cartDB'; // Import fungsi baru

export const submitOrderApi = async (notabel, totalPrice, orderType, noTrans) => {
  const url = "http://localhost:3000/api/pemesanan";
  const profileId = await getProfileIdFromCart();
  
  const orderData = {
    profile_id: profileId, // Sesuaikan dengan ID profil yang sesuai
    id_cart_resto: noTrans, // Gunakan noTrans sebagai id_cart_resto
    total_price: totalPrice,
    balance: 0,
    amount: 0,
    no_table: notabel,
    service: orderType,
    status: "pending",
    created_at: new Date().toISOString(),
    payment_id: 0
  };

  console.log("Order data to be sent:", orderData);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response from server:", errorData);
      throw new Error(`Failed to submit order: ${response.statusText}`);
    }

    const responseData = await response.json(); // Dapatkan respons JSON
    console.log("Response data from API:", responseData); // Debug: lihat data dari respons API

    // Mengembalikan id_order dari responseData jika tersedia
    return responseData.id_order; // Pastikan respons API mengandung id_order
  } catch (error) {
    console.error("Error submitting order:", error);
    throw error;
  }
};
