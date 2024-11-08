const orderModel = require('../../models/resto/orderModel');

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.getAllOrders();
    res.json({
      status: "OK",
      results: {
        resto_order: orders,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "ERROR", message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await orderModel.getOrderById(id);
    if (order.length > 0) {
      res.json({
        status: "OK",
        results: {
          resto_order: order,
        },
      });
    } else {
      res.status(404).json({ status: "NOT FOUND" });
    }
  } catch (error) {
    res.status(500).json({ status: "ERROR", message: error.message });
  }
};


const createOrder = async (req, res) => {
  try {
    const newOrderId = await orderModel.createOrder(req.body);
    res.status(201).json({
      status: "CREATED",
      results: {
        id_order: newOrderId,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "ERROR", message: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const id = req.params.id;
    await orderModel.updateOrder(id, req.body);
    res.json({ status: "UPDATED" });
  } catch (error) {
    res.status(500).json({ status: "ERROR", message: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const id = req.params.id;
    await orderModel.deleteOrder(id);
    res.json({ status: "DELETED" });
  } catch (error) {
    res.status(500).json({ status: "ERROR", message: error.message });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};
