const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/resto/orderController');

router.get('/order', orderController.getAllOrders);
router.get('/order/:id', orderController.getOrderById);
router.post('/order', orderController.createOrder);
router.put('/order/:id', orderController.updateOrder);
router.delete('/order/:id', orderController.deleteOrder);

module.exports = router;
