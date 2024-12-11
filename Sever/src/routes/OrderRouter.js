const express = require("express");
const router = express.Router()
const orderController = require('../controllers/OrderController');
const { authMiddleWare, authUserMiddleWare } = require("../middleware/authMiddleware");

router.post('/create', authUserMiddleWare, orderController.createOrder);
router.get('/vnpay-return', orderController.vnpayReturn);
router.get('/get-all', authUserMiddleWare, orderController.getAllOrders);
router.get('/get-all-admin', authMiddleWare, orderController.getAllOrdersByAdmin);
router.get('/get-order/:orderId', authUserMiddleWare, orderController.getOrderById);
router.get('/get-order-admin/:orderId', authMiddleWare, orderController.getOrderByIdWithAdmin);




module.exports = router 