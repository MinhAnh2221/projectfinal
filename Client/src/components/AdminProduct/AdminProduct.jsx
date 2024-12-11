import React, { useState, useEffect } from "react";
import { WrapperHeader } from "./style";
import { Button, Modal, Form, Input, message, Table, Upload } from "antd";
import { ShopOutlined, ClearOutlined, EditOutlined, UploadOutlined } from "@ant-design/icons";
import { getBase64 } from "../../ultilis";
import * as ProductService from "../../services/ProductService";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {uploadImage} from '../../ultilis'
const AdminProduct = () => {
	const [detailProduct, setDetailProduct] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [method,setMethod] = useState('add')
	const [file,setFile] = useState()
	
	const [stateProduct, setStateProduct] = useState({
		name: "",
		image: "",
		type: "",
		price: "",
		countInStock: "",
		rating: "",
		description: "",
		product_size: [],
	});
	const [dataProduct, setDataProduct] = useState([]);
	const [form] = Form.useForm();
	const navigate = useNavigate();

	const fetchProductData = async () => {
		const res = await ProductService.getAllProduct();
		if (res.status === "OK") {
			setDataProduct(res.data);
		} else {
			message.error("Failed to fetch product data.");
		}
	};

	useEffect(() => {
		fetchProductData();
	}, []);

	const handleUploadChange = async ({ fileList }) => {
		console.log(fileList)
		if (fileList && fileList.length > 0) {
			const file = fileList[0];
			console.log(file.originFileObj)
			setFile(file.originFileObj)
			if (file.originFileObj) {
				const preview = await getBase64(file.originFileObj);
				setStateProduct({
					...stateProduct,
					image: preview,
				});
			}
		} else {
			setStateProduct({
				...stateProduct,
				image: "",
			});
		}
	};

	const resetForm = () => {
		setIsModalOpen(false);
		form.resetFields();
		setStateProduct({
			_id:"",
			name: "",
			image: "",
			type: "",
			price: "",
			countInStock: "",
			rating: "",
			description: "",
			product_size: [],
		});
	};

	const onFinish = async () => {
		// 
		try {
			// when method == 'add'
			if(method === 'add'){
				// if file == null
				if(!file){
					message.error("thieu hinh anh")
					return;

				}
				
				const formData = new FormData();
				formData.append("file",file)
				const image = await uploadImage(formData);
				const res = await ProductService.createProduct({
					...stateProduct,
					image: image.data.secure_url,
				});
				if (res.status === "OK") {
					fetchProductData();
					resetForm();
					message.success("Product created successfully!");
				} else {
					message.error("Failed to create product.");
				}
			}else{
				let image;
				if(file){
					const formData = new FormData();
					formData.append("file",file)
					image = await uploadImage(formData);
				}
				const id = stateProduct._id;
				const res = await ProductService.updateProduct(id,{
					...stateProduct,
					image: image?.data?.secure_url || stateProduct.image,
				});
				if (res.status === "OK") {
					fetchProductData();
					resetForm();
					message.success("Product created successfully!");
				} else {
					message.error("Failed to create product.");
				}
			}
		} catch (error) {
			message.error("Failed to add new product.");
		}
	};

	const columns = [
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Image",
			dataIndex: "image",
			key: "image",
			render: (image) => (
				<img
					src={image}
					alt="product"
					style={{ width: "50px", height: "50px", objectFit: "cover" }}
				/>
			),
		},
		{
			title: "Type",
			dataIndex: "type",
			key: "type",
		},
		{
			title: "Price",
			dataIndex: "price",
			key: "price",
		},
		{
			title: "Stock",
			dataIndex: "countInStock",
			key: "countInStock",
		},
		{
			title: "product_size",
			dataIndex: "product_size",
			key: "product_size",
		},
		{
			title: "Action",
			key: "action",
			render: (_, record) => (
				<div>
					<Button
						type="link"
						icon={<EditOutlined />}
						onClick={() => {
							setMethod("edit")
							setIsModalOpen(true);
							form.setFieldsValue(record);
							setStateProduct(record)
						}}
					>
						Edit
					</Button>
					<Button type="link" icon={<ClearOutlined />} onClick={async()=>{
						const res = await ProductService.deleteProduct(record._id);
						if (res.status === "OK") {
							fetchProductData();
							message.success("Product deleted successfully!");
						} else {
							message.error("Failed to deleted product.");
						}
					}}>
						Delete
					</Button>
				</div>
			),
		},
	];

	return (
		<div>
			<WrapperHeader>Quản Lý Sản Phẩm</WrapperHeader>
			<div style={{ marginTop: "10px" }}>
				<Button
					style={{ height: "150px", width: "150px", borderRadius: "6px", borderStyle: "dashed" }}
					onClick={() => {
						setMethod("add")
						setIsModalOpen(true)
					}}
				>
					<ShopOutlined style={{ fontSize: "60px" }} />
				</Button>
			</div>
			<div style={{ marginTop: "20px" }}>
				<Table
					columns={columns}
					dataSource={dataProduct.map((product, index) => ({ ...product, key: index }))}
				/>
			</div>
			<Modal title={method === "add" ? "Tạo Sản Phẩm" : "Sua san pham"} open={isModalOpen} onCancel={resetForm} footer={null} >
				<Form form={form} onFinish={onFinish} autoComplete="off" >
					{/* Name */}
					<Form.Item
						label="Name"
						name="name"
						rules={[{ required: true, message: "Please input product name!" }]}
					>
						<Input
							value={form.name || "Unknown"}
							onChange={(e) => setStateProduct({ ...stateProduct, name: e.target.value })}
						/>
					</Form.Item>

					{/* Image */}
					<Form.Item
						label="Image"
						name="image"
						rules={[{ required: method === "add", message: "Please upload product image!" }]}
					>
						<Upload
							listType="picture-card"
							maxCount={1}
							accept="image/*"
							onChange={handleUploadChange}
							beforeUpload={() => false} // Prevent automatic upload
						>
							<div>
								<UploadOutlined />
								<div style={{ marginTop: 8 }}>Upload</div>
							</div>
						</Upload>
					</Form.Item>

					{/* Type */}
					<Form.Item
						label="Type"
						name="type"
						rules={[{ required: true, message: "Please input product type!" }]}
					>
						<Input
							value={stateProduct.type}
							onChange={(e) => setStateProduct({ ...stateProduct, type: e.target.value })}
						/>
					</Form.Item>

					{/* Price */}
					<Form.Item
						label="Price"
						name="price"
						rules={[{ required: true, message: "Please input product price!" }]}
					>
						<Input
							type="number"
							value={stateProduct.price}
							onChange={(e) => setStateProduct({ ...stateProduct, price: e.target.value })}
						/>
					</Form.Item>

					{/* Count In Stock */}
					<Form.Item
						label="Count In Stock"
						name="countInStock"
						rules={[{ required: true, message: "Please input product count in stock!" }]}
					>
						<Input
							type="number"
							value={stateProduct.countInStock}
							onChange={(e) => setStateProduct({ ...stateProduct, countInStock: e.target.value })}
						/>
					</Form.Item>

					{/* Rating */}
					<Form.Item
						label="Rating"
						name="rating"
						rules={[{ required: true, message: "Please input product rating!" }]}
					>
						<Input
							type="number"
							value={stateProduct.rating}
							onChange={(e) => setStateProduct({ ...stateProduct, rating: e.target.value })}
						/>
					</Form.Item>

					{/* Description */}
					<Form.Item
						label="Description"
						name="description"
						rules={[{ required: true, message: "Please input product description!" }]}
					>
						<Input.TextArea
							value={stateProduct.description}
							onChange={(e) => setStateProduct({ ...stateProduct, description: e.target.value })}
							rows={4}
						/>
					</Form.Item>
					<Form.Item
  label="Product Sizes"
  name="product_size"
  rules={[{ required: true, message: "Please input product sizes!" }]}
>
<div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
  {stateProduct.product_size.map((size, index) => (
    <Input
      key={index}
      value={size.trim()}
      onChange={(e) => {
        const newSizes = stateProduct.product_size;
        newSizes[index] = e.target.value.trim();
        setStateProduct({ ...stateProduct, product_size: newSizes });
      }}
      placeholder={`Size ${index + 1}`}
      style={{ width: "60px", textAlign: "center" }}
    />
  ))}
  <Button
    type="dashed"
    onClick={() => {
      const newSizes = stateProduct.product_size;
      newSizes.push("");
      setStateProduct({ ...stateProduct, product_size: newSizes });
    }}
    style={{ width: "60px" }}
  >
    +
  </Button>
</div>
</Form.Item>

					{/* Submit Button */}
					<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
						<Button type="primary" htmlType="submit">
							Submit
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default AdminProduct;
