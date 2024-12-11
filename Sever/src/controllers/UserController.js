const { response } = require('express');
const UserService = require('../services/UserService');

const createUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phone } = req.body;
        
        // Regex kiểm tra email
        const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const isCheckEmail = reg.test(email);

        // Kiểm tra các trường bắt buộc
        if (  !email || !password || !confirmPassword ) {
            return res.status(400).json({
                status: 'ERR',
                message: 'All fields are required'
            });
        }

        // Kiểm tra định dạng email
        if (!isCheckEmail) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Invalid email format'
            });
        }

        // Kiểm tra mật khẩu
        if (password !== confirmPassword) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Passwords do not match'
            });
        }

        // Tạo người dùng mới
        const user = await UserService.createUser({ name, email, password,confirmPassword, phone });

        // Trả về phản hồi
        return res.status(201).json({
            status: 'OK',
            message: 'User created successfully',
            data: user
        });
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Internal server error'
        });
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Email and password are required'
            });
        }

        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const isCheckEmail = reg.test(email);

        if (!isCheckEmail) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Invalid email format'
            });
        }

        const user = await UserService.loginUser({ email, password });

        if (!user) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Invalid credentials'
            });
        }
       
        return res.status(200).json({
            status: 'OK',
            message: 'Login successful',
            data: user
           
        })
       
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Internal server error'
        });
    }
};


const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const data = req.body;
        console.log(userId,data)
        if (!userId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The userId is required'
            });
        }

        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({
                status: 'ERR',
                message: 'No data provided for update'
            });
        }

        // Gọi hàm update từ UserService
        const response = await UserService.updateUser(userId, data);

        if (!response) {
            return res.status(404).json({
                status: 'ERR',
                message: 'User not found or no updates made'
            });
        }

        return res.status(200).json({
            status: 'OK',
            message: 'User updated successfully',
            data: response
        });

    } catch (e) {
        console.error('Error updating user:', e);  // Thêm logging chi tiết
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Internal server error'
        });
    }
};
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The userId is required'
            });
        }

      const response = await UserService.deleteUser(userId)
      return res.status(200).json(response)
    } catch (e) {
       
        return res.status(400).json({
            status: 'ERR',
            message: e
        });
    }
};
const getAllUser = async (req, res) => {
    try {
      const response = await UserService.getAllUser()
      return res.status(200).json(response)
    } catch (e) {
       
        return res.status(400).json({
            status: 'ERR',
            message: e
        });
    }
};
const getDetailsUser = async(req, res) => {
    
    try {
        const userId = req.params.id
        if(!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            });
        }
        const response = await UserService.getDetailsUser(userId)
        return res.status(200).json(response)
        
    } catch (e) {
        return res.status(400).json({
            status: 'ERR',
            message: e
        });
    }
}


;

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser
};
