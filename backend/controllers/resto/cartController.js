const CartModel = require('../../models/resto/cartModel');

const getAllCarts = async (req, res) => {
  try {
    const carts = await CartModel.getAllCarts();
    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data.' });
  }
};

const getCartByProfileId = async (req, res) => {
  const { profile_id } = req.params;
  try {
    const cartDetails = await CartModel.getCartByProfileId(profile_id);
    if (cartDetails.length === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan.' });
    }
    res.json(cartDetails);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data berdasarkan profile_id.' });
  }
};

const addToCart = async (req, res) => {
  const { profile_id, no_trans, id_resto_item, variant_id, quantity, note, status } = req.body;
  try {
    const cartId = await CartModel.addToCart({ profile_id, no_trans, id_resto_item, variant_id, quantity, note, status });
    res.status(201).json({ message: 'Item berhasil ditambahkan ke cart.', cartId });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menambahkan item ke cart.' });
  }
};

const updateQuantity = async (req, res) => {
  const { id_cart_resto } = req.params;
  const { quantity } = req.body;
  try {
    const affectedRows = await CartModel.updateQuantity(id_cart_resto, quantity);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Item tidak ditemukan atau tidak ada perubahan.' });
    }
    res.json({ message: 'Quantity berhasil diperbarui.' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal memperbarui quantity.' });
  }
};

const deleteCartItem = async (req, res) => {
  const { id_cart_resto } = req.params;
  try {
    const affectedRows = await CartModel.deleteCartItem(id_cart_resto);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Item tidak ditemukan.' });
    }
    res.json({ message: 'Item berhasil dihapus dari cart.' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus item dari cart.' });
  }
};

const getLastTransaction = async (req, res) => {
  try {
    const lastTrans = await CartModel.getLastTransactionNumber();
    res.json({ lastTrans });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve last transaction number' });
  }
};

module.exports = {
  getAllCarts,
  getCartByProfileId,
  addToCart,
  updateQuantity,
  deleteCartItem,
  getLastTransaction
};