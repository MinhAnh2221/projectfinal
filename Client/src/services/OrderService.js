import axios from "axios";
import { jwtTranslate } from "../ultilis";


const createOrder = async (order) => {
	const response = await axios.post(`${process.env.REACT_APP_API_URL}/order/create`, order, {
		headers: {
			"token": `Bearer ${localStorage.getItem("access_token")}`,
			id: jwtTranslate(localStorage.getItem("access_token"))?.id,
		}
	});
	return response.data;
}
const getAllOrders = async () => {
	const response = await axios.get(`${process.env.REACT_APP_API_URL}/order/get-all`, {
		headers: {
			"token": `Bearer ${localStorage.getItem("access_token")}`,
			id: jwtTranslate(localStorage.getItem("access_token"))?.id
		}
	});
	return response.data;
}
const getAllOrdersByAdmin = async () => {
	const response = await axios.get(`${process.env.REACT_APP_API_URL}/order/get-all-admin`, {
		headers: {
			"token": `Bearer ${localStorage.getItem("access_token")}`,
			id: jwtTranslate(localStorage.getItem("access_token"))?.id
		}
	});
	return response.data;
}

const getOrderById = async (orderId) => {
	const response = await axios.get(`${process.env.REACT_APP_API_URL}/get-order/${orderId}`, {
		headers: {
			"token": `Bearer ${localStorage.getItem("access_token")}`,
			id: jwtTranslate(localStorage.getItem("access_token"))?.id
		}
	});
	return response.data;
}

const getOrderByIdWithAdmin = async (orderId) => {
	const response = await axios.get(`${process.env.REACT_APP_API_URL}/order/get-order-admin/${orderId}`, {
		headers: {
			"token": `Bearer ${localStorage.getItem("access_token")}`,
			id: jwtTranslate(localStorage.getItem("access_token"))?.id
		}
	});
	return response.data;
}

export { createOrder, getAllOrders, getAllOrdersByAdmin, getOrderById, getOrderByIdWithAdmin }