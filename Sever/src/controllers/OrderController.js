const OrderService = require("../services/OrderService");
function getIpAddress(req) {
	return (
		req.headers["x-forwarded-for"] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		req.connection?.socket?.remoteAddress ||
		"127.0.0.1"
	);
}
const createOrder = async (req, res) => {
	const { orderItems, shippingAddress, paymentMethod } = req.body;
	const ipAddr = getIpAddress(req);
	const { id } = req.user;
	const response = await OrderService.createOrder(id, ipAddr, { orderItems, shippingAddress, paymentMethod });
	return res.status(200).json(response);
}
const vnpayReturn = async (req, res) => {
	const response = await OrderService.vnpayReturn(req.query);
	if (response.status === 'OK') {
		return res.redirect(`${process.env.URL_FRONTEND_RETURN}`);
	}
	return res.redirect(`${process.env.CLIENT_URL}`);
}

const getAllOrders = async (req, res) => {
	const response = await OrderService.getAllOrders(req.user.id);
	return res.status(200).json(response);
}
const getOrderById = async (req, res) => {
	const { orderId } = req.params;
	const response = await OrderService.getOrderById(orderId);
	return res.status(200).json(response);
}
const getAllOrdersByAdmin = async (req, res) => {
	const { id } = req.user;
	const response = await OrderService.getAllOrderByAdmins();
	return res.status(200).json(response);
}
const getOrderByIdWithAdmin = async (req, res) => {
	const { orderId } = req.params;
	const response = await OrderService.getOrderByIdWithAdmin(orderId);
	return res.status(200).json(response);
}
module.exports = {
	createOrder,
	vnpayReturn,
	getAllOrders,
	getAllOrdersByAdmin,
	getOrderByIdWithAdmin,
	getOrderById,
}


