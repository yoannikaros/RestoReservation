const Cart = require('../../models/resto/cartModel');

exports.getAllCarts = async (req, res) => {
    try {
        const results = await Cart.getAll();
        res.status(200).json({
            status: 'OK',
            results: {
                resto_cart: results
            }
        });
    } catch (err) {
        res.status(500).json({ status: 'Error', message: err.message });
    }
};

exports.getCartById = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await Cart.getById(id);
        if (result.length === 0) {
            return res.status(404).json({ status: 'Not Found', message: 'Cart not found' });
        }
        res.status(200).json({
            status: 'OK',
            result: result[0]
        });
    } catch (err) {
        res.status(500).json({ status: 'Error', message: err.message });
    }
};

exports.createCart = async (req, res) => {
    const data = req.body;
    try {
        const result = await Cart.create(data);
        res.status(201).json({ status: 'Created', id: result.insertId });
    } catch (err) {
        res.status(500).json({ status: 'Error', message: err.message });
    }
};

exports.updateCart = async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    try {
        const result = await Cart.update(id, data);
        res.status(200).json({ status: 'Updated', affectedRows: result.affectedRows });
    } catch (err) {
        res.status(500).json({ status: 'Error', message: err.message });
    }
};

exports.deleteCart = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await Cart.delete(id);
        res.status(200).json({ status: 'Deleted', affectedRows: result.affectedRows });
    } catch (err) {
        res.status(500).json({ status: 'Error', message: err.message });
    }
};
