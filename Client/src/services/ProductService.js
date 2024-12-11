import axios from "axios";
import { jwtTranslate } from "../ultilis";
export const getAllProduct = async (limit) => {
    let res;

    if (limit) { // Kiểm tra xem limit có giá trị hay không
        res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all?limit=${limit}`);
    } else {
        res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all`);
    }

    return res.data;
};


export const createProduct = async (data) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/product/create`, data,{
			headers: {
				"token": `Bearer ${localStorage.getItem("access_token")}`,
				id: jwtTranslate(localStorage.getItem("access_token"))?.id
			}
		});
        return res.data;
    } catch (error) {
        console.error("Creating product failed:", error);
        throw error;  // Để xử lý lỗi trong thành phần gọi hàm này
    }
};

export const updateProduct = async (id, data) => {
    try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/product/update/${id}`, data,{
			headers: {
				"token": `Bearer ${localStorage.getItem("access_token")}`,
				id: jwtTranslate(localStorage.getItem("access_token"))?.id
			}
		});
        return res.data;
    } catch (error) {
        console.error("Updating product failed:", error);
        throw error;  // Để xử lý lỗi trong thành phần gọi hàm này
    }
};

export const deleteProduct = async (id) => {
    try {
        const res = await axios.delete(`${process.env.REACT_APP_API_URL}/product/delete/${id}`,{
			headers: {
				"token": `Bearer ${localStorage.getItem("access_token")}`,
				id: jwtTranslate(localStorage.getItem("access_token"))?.id
			}
		});
        return res.data;
    } catch (error) {
        console.error("Deleting product failed:", error);
        throw error;
    }
};

export const getDetail = async (id) => {
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-details/${id}`);
        return res.data;
    } catch (error) {
        console.error("Deleting product failed:", error);
        throw error;
    }
};
