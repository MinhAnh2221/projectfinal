import axios from "axios";

export const loginUser = async (data) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/sign-in`, data);
        return res.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;  // Để xử lý lỗi trong thành phần gọi hàm này
    }
};
export const getDetailsUser = async (id) => {
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/user/get-details/${id}`);
        return res.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;  // Để xử lý lỗi trong thành phần gọi hàm này
    }
};
export const signupUser = async (data) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/sign-up`, data);
        return res.data;
    } catch (error) {
        if (error.response) {
            // Log thêm chi tiết về phản hồi lỗi
            console.error("Signup failed with status:", error.response.status, "data:", error.response.data);
            throw new Error(error.response.data?.message || 'Signup failed');
        } else {
            // Xử lý lỗi khác như lỗi kết nối
            console.error("Network error or server is not reachable:", error.message);
            throw new Error('Network error or server is not reachable');
        }
    }
};
export const createUser = async (data) => {
    try {
        
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/create`,data);
        return res.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;  // Để xử lý lỗi trong thành phần gọi hàm này
    }
};
export const updateUser = async (id,data) => {
    const res =  await axios.put(`${process.env.REACT_APP_API_URL}/user/update-user/${id}`,data); // URL của API cập nhật người dùng
    return res.data
  };

  export const getAll = async () => {
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/user/get-all`); // Giả sử API endpoint là /user/get-all
        return res.data;
    } catch (error) {
        console.error("Fetching all users failed:", error);
        throw error;  // Để xử lý lỗi trong thành phần gọi hàm này
    };
}
export const deleteUser = async (id) => {
    try {
        const res = await axios.delete(`${process.env.REACT_APP_API_URL}/user/delete-user/${id}`);
        return res.data;
    } catch (error) {
        console.error("Deleting user failed:", error);
        throw error;
    }
};




