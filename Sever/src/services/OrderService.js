const Order = require('../models/OrderProduct');
const Product = require('../models/ProductModel');
const Cart = require('../models/CartModel');
const crypto = require("crypto");
const moment = require("moment");
const querystring = require("qs");
const config = process.env;

// Sắp xếp object theo key (tuân theo yêu cầu của VNPAY)
function sortObject(obj) {
	const sortedKeys = Object.keys(obj).sort();
	const sortedObj = {};
	for (const key of sortedKeys) {
		sortedObj[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
	}
	return sortedObj;
}
const createUrl = ({ totalPrice, ipAddr }) => {
	const createDate = moment().format("YYYYMMDDHHmmss");
	const orderId = moment().format("DDHHmmss"); // Sử dụng timestamp để tạo mã đơn hàng

	// Tạo các tham số thanh toán
	const vnp_Params = {
		vnp_Version: "2.1.0",
		vnp_Command: "pay",
		vnp_TmnCode: config.VNP_TMN_CODE,
		vnp_Locale: "vn",
		vnp_CurrCode: "VND",
		vnp_TxnRef: orderId,
		vnp_OrderInfo: `Thanh toán đơn hàng #${orderId}`,
		vnp_OrderType: "other",
		vnp_Amount: totalPrice * 100, // Chuyển đổi thành đơn vị VNPAY (VND x 100)
		vnp_ReturnUrl: config.VNP_RETURN_URL,
		vnp_IpAddr: ipAddr,
		vnp_CreateDate: createDate,
	};

	// Sắp xếp tham số và thêm chữ ký bảo mật
	const sortedParams = sortObject(vnp_Params);
	sortedParams["vnp_SecureHash"] = generateSignature(sortedParams);

	// Tạo URL thanh toán
	return {
		url: config.VNP_URL + "?" + querystring.stringify(sortedParams, { encode: false }),
		orderId: orderId,
		createDate,
	};
}


function generateSignature(params) {
	const secretKey = config.VNP_SECRET_KEY; // Sử dụng trực tiếp `process.env`
	const signData = querystring.stringify(params, { encode: false });
	return crypto
		.createHmac("sha512", secretKey)
		.update(Buffer.from(signData, "utf-8"))
		.digest("hex");
}

// Kiểm tra chữ ký hợp lệ
function isValidSignature(vnp_Params, secureHash) {
	const signedData = generateSignature(vnp_Params);
	return secureHash === signedData;
}
const createOrder = async (userId, ipAddr, order) => {
	return new Promise(async (resolve, reject) => {
		try {
			const {
				orderItems,
				shippingAddress,
				paymentMethod,
			} = order;
			// calculate price of items
			const itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.amount, 0);
			// calculate shipping price
			const shippingPrice = 0;
			const totalPrice = itemsPrice + shippingPrice;
			const payInfo = createUrl({ totalPrice, ipAddr });
			const newOrder = new Order({
				orderItems,
				shippingAddress,
				paymentMethod,
				itemsPrice,
				shippingPrice,
				totalPrice,
				taxPrice: 0,
				orderId: payInfo.orderId,
				user: userId,
			});
			await newOrder.save();
			// update stock product
			for (const item of orderItems) {
				const product = await Product.findById(item.product);

				product.countInStock -= item.amount;
				await product.save();
			}
			// update cart items
			await Cart.updateOne({ user: userId }, { $set: { cartItems: [] } });


			resolve({
				status: 'OK',
				message: 'SUCCESS',
				data: {
					orderId: payInfo.orderId,
					url: payInfo.url
				}
			});
		} catch (e) {
			console.error('Error creating order:', e);
			reject({
				status: 'ERROR',
				message: e.message || 'Internal server error'
			});
		}
	});
}
const getOrderById = async (userId, orderId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const order = await Order.findOne({ user: userId, orderId }).populate('user', 'name');
			if (order) {
				resolve({
					status: 'OK',
					message: 'SUCCESS',
					data: order
				});
			}
			resolve({
				status: 'fail',
				message: 'Order not found'
			});
		} catch (e) {
			console.error('Error getting order:', e);
			reject({
				status: 'ERROR',
				message: e.message || 'Internal server error'
			});
		}
	});
}

const getAllOrders = async (userId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const orders = await Order.find({ user: userId }).populate('user', 'name');
			resolve({
				status: 'OK',
				message: 'SUCCESS',
				data: orders
			});
		} catch (e) {
			console.error('Error getting orders:', e);
			reject({
				status: 'ERROR',
				message: e.message || 'Internal server error'
			});
		}
	});
}
const getOrderByIdWithAdmin = async (orderId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const order = await Order.findOne({ orderId }).populate("user", "name");
			if (order) {
				resolve({
					status: 'OK',
					message: 'SUCCESS',
					data: order
				});
			}
			resolve({
				status: 'fail',
				message: 'Order not found'
			});
		} catch (e) {
			console.error('Error getting order:', e);
			reject({
				status: 'ERROR',
				message: e.message || 'Internal server error'
			});
		}
	});
}

const getAllOrderByAdmins = async () => {
	return new Promise(async (resolve, reject) => {
		try {
			const orders = await Order.find().populate("user", "name");
			resolve({
				status: 'OK',
				message: 'SUCCESS',
				data: orders
			});
		} catch (e) {
			console.error('Error getting orders:', e);
			reject({
				status: 'ERROR',
				message: e.message || 'Internal server error'
			});
		}
	});
}

const vnpayReturn = async (params) => {
	return new Promise(async (resolve, reject) => {
		try {
			const { vnp_SecureHash, ...vnp_Params } = params;
			// Kiểm tra chữ ký hợp lệ
			if (isValidSignature(sortObject(vnp_Params), vnp_SecureHash)) {
				const orderId = vnp_Params["vnp_TxnRef"];
				const rspCode = vnp_Params["vnp_ResponseCode"];
				if (rspCode === "00") {
					await Order.updateOne({ orderId }, { statusPaid: 'paid', paidAt: Date.now() });
					resolve({
						status: 'OK',
						message: 'SUCCESS'
					});
				} else {
					await Order.updateOne({ orderId }, { statusPaid: 'failed' });
					resolve({
						status: 'fail',
						message: 'Payment failed'
					});
				}
			} else {
				resolve({
					status: 'fail',
					message: 'Invalid checksum'
				});
			}
		} catch (e) {
			console.error('Error in vnpReturn:', e);
			reject({
				status: 'ERROR',
				message: e.message || 'Internal server error'
			});
		}
	})
}



module.exports = {
	createOrder,
	vnpayReturn,
	getOrderById,
	getAllOrders,
	getAllOrderByAdmins,
	getOrderByIdWithAdmin,
};
