import axios from "axios";
import { jwtTranslate } from "../ultilis";

export const getCart = async () => {
	try {
		const res = await axios.get(`${process.env.REACT_APP_API_URL}/cart/get-cart`, {
			headers: {
				"token": `Bearer ${localStorage.getItem("access_token")}`,
				id: jwtTranslate(localStorage.getItem("access_token"))?.id
			}
		}
		);
		return res.data;
	} catch (error) {
		console.error("Getting cart failed:", error);
		return error;
	}
}

export const updateItemInCart = async (data) => {
	try {
		const res = await axios.put(`${process.env.REACT_APP_API_URL}/cart/update-item`, data, {
			headers: {
				"token": `Bearer ${localStorage.getItem("access_token")}`,
				id: jwtTranslate(localStorage.getItem("access_token"))?.id
			}
		});
		return res.data;
	} catch (error) {
		console.error("Updating item in cart failed:", error);
		return error;
	}
}

export const addToCart = async (data) => {
	try {
		const res = await axios.post(`${process.env.REACT_APP_API_URL}/cart/add-to-cart`, data, {
			headers: {
				"token": `Bearer ${localStorage.getItem("access_token")}`,
				id: jwtTranslate(localStorage.getItem("access_token"))?.id
			}
		});
		
		return res.data;
	} catch (error) {
		console.error("Adding to cart failed:", error);
		return error;
	}
}

export const deleteItemInCart = async (id) => {
	try {
		const res = await axios.delete(`${process.env.REACT_APP_API_URL}/cart/remove-item/${id}`, {
			headers: {
				"token": `Bearer ${localStorage.getItem("access_token")}`,
				id: jwtTranslate(localStorage.getItem("access_token"))?.id
			}
		});
		return res.data;
	} catch (error) {
		console.error("Deleting item in cart failed:", error);
		return error;
	}
}
