// controllers/orderController.js
const orderModel = require('../../models/resto/historyModel');

// Mendapatkan semua pesanan
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.getAllOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

// Mendapatkan pesanan berdasarkan profile_id
const getOrdersByProfileId = async (req, res) => {
  const { profile_id } = req.params;
  try {
    const orders = await orderModel.getOrdersByProfileId(profile_id);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders by profile_id', error });
  }
};

// Menambahkan pesanan baru
const createOrder = async (req, res) => {
  const orderData = req.body;
  try {
    const newOrder = await orderModel.createOrder(orderData);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }
};

module.exports = {
  getAllOrders,
  getOrdersByProfileId,
  createOrder,
};
