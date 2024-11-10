// controllers/paymentController.js
const paymentModel = require('../../models/resto/paymentModel');

// Mengambil semua metode pembayaran
const getAllPayments = async (req, res) => {
  try {
    const payments = await paymentModel.getAllPayments();
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments', error });
  }
};

// Mengambil metode pembayaran berdasarkan profile_id
const getPaymentsByProfileId = async (req, res) => {
  const { profile_id } = req.params;
  try {
    const payments = await paymentModel.getPaymentsByProfileId(profile_id);
    if (payments.length === 0) {
      return res.status(404).json({ message: 'No payments found for this profile_id' });
    }
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments by profile_id', error });
  }
};

// Menambahkan metode pembayaran baru
const addPaymentMethod = async (req, res) => {
  const { title, number, profile_id } = req.body;
  try {
    const paymentId = await paymentModel.addPaymentMethod({ title, number, profile_id });
    res.status(201).json({ message: 'Payment method added successfully', paymentId });
  } catch (error) {
    res.status(500).json({ message: 'Error adding payment method', error });
  }
};

// Menghapus metode pembayaran berdasarkan payment_id
const deletePaymentMethod = async (req, res) => {
  const { payment_id } = req.params;
  try {
    const affectedRows = await paymentModel.deletePaymentMethod(payment_id);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Payment method not found' });
    }
    res.status(200).json({ message: 'Payment method deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting payment method', error });
  }
};

module.exports = {
  getAllPayments,
  getPaymentsByProfileId,
  addPaymentMethod,
  deletePaymentMethod,
};
