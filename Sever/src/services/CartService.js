const { default: mongoose } = require('mongoose');
const Cart = require('../models/CartModel');
const Product = require('../models/ProductModel');
const addToCart = async (userId, product) => {
	return new Promise(async (resolve, reject) => {
		try {
			const { quantity, productId ,cart_size} = product;
		console.log("cart_size",cart_size)

			const checkProduct = await Product.findOne({ _id: productId });
			if (checkProduct === null) {
				return resolve({
					status: 'fail',
					message: 'the product is not defined'
				});
			}
			// if cart is not created
			const cart = await Cart.findOne({ user: userId });
			if (cart === null) {
				const newCart = await Cart.create({
					cartItems: [{ quantity, product: productId ,cart_size}],
					user: userId
				});
				if (newCart) {
					resolve({
						status: 'OK',
						message: 'SUCCESS',
						data: newCart
					});
				}
			} else {

				const checkProductInCart = cart.cartItems.find((item) => item.product == productId);
				console.log(checkProductInCart);
				if (checkProductInCart) {

					checkProductInCart.quantity += quantity;
					if (checkProductInCart.quantity <= 0) {
						cart.cartItems = cart.cartItems.filter((item) => item.product != productId);
					}
					await cart.save();
				} else {
					cart.cartItems.push({ quantity, product: productId ,cart_size});
					await cart.save();
				}
				resolve({
					status: 'OK',
					message: 'SUCCESS',
					data: await Cart.findOne({ user: userId }).populate('cartItems.product', 'name image type price countInStock discount')
				});
			}
		} catch (e) {
			console.error('Error creating product:', e);
			reject({
				status: 'ERROR',
				message: e.message || 'Internal server error'
			});
		}
	});
}
const updateItemInCart = async (userId, productId, quantity) => {
	return new Promise(async (resolve, reject) => {
		try {
			const cart = await Cart.findOne({ user: userId });
			if (cart === null) {
				return resolve({
					status: 'fail',
					message: 'the cart is not defined'
				});
			}
			const checkProductInCart = cart.cartItems.find((item) => item.product == productId);
			if (checkProductInCart) {
				if (quantity <= 0) {
					cart.cartItems = cart.cartItems.filter((item) => item.product != productId);
				}
				checkProductInCart.quantity = quantity;
				await cart.save();
				resolve({
					status: 'OK',
					message: 'SUCCESS',
					data: await Cart.findOne({ user: userId }).populate('cartItems.product', 'name image type price countInStock discount')
				});
			} else {
				resolve({
					status: 'fail',
					message: 'the product is not defined'
				});
			}
		} catch (e) {
			console.error('Error creating product:', e);
			reject({
				status: 'ERROR',
				message: e.message || 'Internal server error'
			});
		}
	});
}

const getCart = async (userId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const cart = await Cart.findOne({ user: userId }).populate('cartItems.product', 'name image type price countInStock discount');
			if (cart) {
				resolve({
					status: 'OK',
					message: 'SUCCESS',
					data: cart
				});
			} else {
				resolve({
					status: 'fail',
					message: 'Cart is not defined'
				});
			}
		} catch (e) {
			console.error('Error creating product:', e);
			reject({
				status: 'ERROR',
				message: e.message || 'Internal server error'
			});
		}
	});
}

const deleteItemInCart = async (userId, productId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const cart = await Cart.findOne({ user: new mongoose.Types.ObjectId(userId) }).populate('cartItems.product', 'name image type price countInStock discount');
			if (cart === null) {
				return resolve({
					status: 'fail',
					message: 'the cart is not defined'
				});
			}
			const checkProductInCart = cart.cartItems.find((item) => item.product._id == productId);
			if (checkProductInCart) {
				cart.cartItems = cart.cartItems.filter((item) => item.product._id != productId);
				await cart.save();
				resolve({
					status: 'OK',
					message: 'SUCCESS',
					data: cart
				});
			} else {
				resolve({
					status: 'fail',
					message: 'the product is not defined'
				});
			}
		} catch (e) {
			console.error('Error creating product:', e);
			reject({
				status: 'ERROR',
				message: e.message || 'Internal server error'
			});
		}
	});
}
module.exports = {
	addToCart,
	getCart,
	deleteItemInCart,
	updateItemInCart
}