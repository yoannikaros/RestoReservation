// orderApi.js

import { submitCartToApi } from './cartApi';

export const submitOrderApi = async (notabel, totalPrice, orderType, noTrans) => {
  const url = "http://localhost:3000/api/pemesanan";

  const orderData = {
    profile_id: 1, // Sesuaikan dengan ID profil yang sesuai
    id_cart_resto: noTrans, // Gunakan noTrans sebagai id_cart_resto
    total_price: totalPrice,
    balance: 0,
    amount: 0,
    no_table: notabel,
    service: orderType,
    status: "pending",
    created_at: new Date().toISOString(), // Untuk debugging, tambahkan tanggal dan waktu
    payment_id: 0
  };

  console.log("Order data to be sent:", orderData); // Debug: lihat apakah semua data sudah benar

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const errorData = await response.json(); // Dapatkan pesan error dari server
      console.error("Error response from server:", errorData);
      throw new Error(`Failed to submit order: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting order:", error);
    throw error;
  }
};
