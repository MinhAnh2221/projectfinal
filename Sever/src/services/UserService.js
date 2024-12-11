const User = require("../models/UserModel");
const { genneralAccessToken } = require("./JwtServices");

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = newUser;

        try {
            // Kiểm tra xem email đã tồn tại chưa
            const checkUser = await User.findOne({ email });
            if (checkUser) {
                return reject({
                    status: 'fail',
                    message: 'The email is already in use'
                });
            }

            // Kiểm tra mật khẩu có khớp không
            if (password !== confirmPassword) {
                return reject({
                    status: 'fail',
                    message: 'Passwords do not match'
                });
            }

            // Tạo người dùng mới trong cơ sở dữ liệu
            const newUser = await User.create({
                name,
                email,
                password,
                phone // Không cần lưu confirmPassword
            });

            if (newUser) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: newUser
                });
            }
        } catch (e) {
            reject({
                status: 'ERR',
                message: e.message || 'An error occurred during user creation'
            });
        }
    });
};

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin;
        try {
            const checkUser = await User.findOne({ email });
            if (checkUser === null) {
                return resolve({
                    status: 'fail',
                    message: 'User is not defined'
                });
            }

          
            if (password !== checkUser.password) {
                return resolve({
                    status: 'fail',
                    message: 'Password is incorrect'
                });
            }

            const access_token = await genneralAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            });

            resolve({
                status: 'OK',
                message: 'Login successful',
                access_token: access_token
            });
        } catch (e) {
            reject(e);
        }
    });
};

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({ _id: id });

            if (checkUser === null) {
                return resolve({
                    status: 'fail',
                    message: 'User is not defined'
                });
            }
            const updateUser = await User.findByIdAndUpdate(id, data, { new: true });
            resolve({
                status: 'OK',
                message: 'User updated successfully',
                data: updateUser
            });
        } catch (e) {
            reject(e);
        }
    });
};

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({ _id: id });

            if (checkUser === null) {
                return resolve({
                    status: 'fail',
                    message: 'User is not defined'
                });
            }
            await User.findByIdAndDelete(id);
            resolve({
                status: 'OK',
                message: 'Delete User Success',
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getAllUser = async () => {
    try {
        const checkUser = await User.find(); // Tìm tất cả người dùng

        if (checkUser.length === 0) {
            return {
                status: 'OK',
                message: 'No users found'
            };
        }

        return {
            status: 'OK',
            message: 'Success',
            data: checkUser
        };
    } catch (e) {
        return {
            status: 'ERR',
            message: e.message
        };
    }
};

const getDetailsUser = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ _id: id });
            if (user === null) {
                resolve({
                    status: "ERR",
                    message: "The user is not defined",
                });
            }
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: user,
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser
};
