const CartService = require('../services/CartService');
const addToCart = async (req, res) => {
	try {
		const { productId, quantity, cart_size } = req.body;
		console.log("cart_size",cart_size)
		const { id } = req.user;
		const response = await CartService.addToCart(id, { productId, quantity, cart_size });
		return res.status(200).json(response);
	} catch (e) {
		return res.status(500).json({
			status: 'ERR',
			message: e.message || 'Internal server error'
		});
	}
}
const updateItemInCart = async (req, res) => {
	try {
		const { productId, quantity } = req.body;
		const { id } = req.user;
		const response = await CartService.updateItemInCart(id, productId, quantity);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(500).json({
			status: 'ERR',
			message: e.message || 'Internal server error'
		});
	}
}
const getCart = async (req, res) => {
	try {
		const { id } = req.user;
		const response = await CartService.getCart(id);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(500).json({
			status: 'ERR',
			message: e.message || 'Internal server error'
		});
	}
}
const deleteItemInCart = async (req, res) => {
	try {
		const { id } = req.params;
		const response = await CartService.deleteItemInCart(req.user.id, id);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(500).json({
			status: 'ERR',
			message: e.message || 'Internal server error'
		});
	}
}
module.exports = {
	addToCart,
	getCart,
	deleteItemInCart,
	updateItemInCart
}