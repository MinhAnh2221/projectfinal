const Product = require('../models/ProductModel'); // Đảm bảo đường dẫn đúng

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const { name, image, type, price, countInStock, rating, description, product_size } = newProduct;

        try {
         
            const checkProduct = await Product.findOne({ name });
            if (checkProduct !== null) {
                return reject({
                    status: 'FAIL',
                    message: 'The name of Product is already taken'
                });
            }
            const newProduct = await Product.create({
                name,
                image,
                type,
                price,
                countInStock,
                rating,
                description,
                product_size
            });

            // Trả về kết quả
            if (newProduct) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: newProduct
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
};
const updateProduct= (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            });

            if (checkProduct === null) {
                return resolve({
                    status: 'fail',
                    message: 'the product is not defined'
                });
            }
            const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: 'OK',
                message: 'Login successful',
                data: updatedProduct

            });
        } catch (e) {
            reject(e);
        }
    });
};
const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Đổi từ User sang Product
            const checkProduct = await Product.findOne({
                _id: id
            });

            if (checkProduct === null) {
                return resolve({
                    status: 'fail',
                    message: 'Product is not defined' // Sửa từ User thành Product
                });
            }
            
            // Xóa Product
            await Product.findByIdAndDelete(id);
            resolve({
                status: 'OK',
                message: 'Delete Product Success' // Sửa thông báo cho phù hợp
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getAllProduct = (limit = 10, page = 0, sort = ['asc', 'name'], filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Tổng số sản phẩm
            const totalProduct = await Product.countDocuments();
            if(filter){
                const label = filter[0]
                const allObjectFilter = await Product.find ({[label]: { 'regex': filter[1]}}).limit(limit).skip(page * limit)
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allObjectFilter,
                    total: totalProduct,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalProduct / limit)})
     
                  
    
            }
            // Tạo object sort từ mảng
            const objectSort = {};
            if (Array.isArray(sort) && sort.length === 2) {
                objectSort[sort[1]] = sort[0]; // sort[0]: direction, sort[1]: field name
            }

            // Lấy danh sách sản phẩm
            const allProduct = await Product.find()
                .limit(limit)
                .skip(page * limit)
                .sort(objectSort); // Áp dụng sort

            // Trả về kết quả thành công
            resolve({
                status: 'OK',
                message: 'Success',
                data: allProduct,
                total: totalProduct,
                pageCurrent: Number(page + 1),
                totalPage: Math.ceil(totalProduct / limit)
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getDetailsProduct = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findOne({
                _id: id,
            });
            if (product === null) {
                resolve({
                    status: "ERR",
                    message: "The product is not defined",
                });
            }
            resolve({
                status: "OK",
                message: "SUCESS",
                data: product,
            });
        } catch (e) {
            reject(e);
        }
    });
};
module.exports = {
    updateProduct,
    createProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct
};
