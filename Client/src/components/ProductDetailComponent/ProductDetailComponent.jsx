import { Col, Row, Image, Rate, Select } from "antd";
import React, { useEffect, useState } from "react";
import giay from "../../assect/images/giay.jpg";
import giaysmall2 from "../../assect/images/giaysmall2.jpg";
import {
	WrapperStyleImageSmall,
	WrapperStyleImageColImage,
	WrapperStyleNameProduct,
	WrapperStyleTextSell,
	WrapperPriceProduct,
	WrapperPriceTextProduct,
	WrapperAddressProduct,
	WrapperSizeProduct,
	WrapperInputNumber,
} from "./style";
import { StarOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import * as ProductService from "../../services/ProductService";
import * as CartService from "../../services/CartService";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { useQuery } from "@tanstack/react-query";
import Loading from "../LoadingComponent/Loading";
import { useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addOderProduct } from "../../redux/slides/orderSlide";

const { Option } = Select;

const ProductDetailComponent = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [selectedSize, setSelectedSize] = useState("");
	const { id } = useParams();
	const [numProduct, setNumProduct] = useState(1);

	const [productDetails, setproductDetails] = useState();
	const onChange = (value) => {
		setNumProduct(Number(value));
	};
	const access = localStorage.getItem("access_token");
	const handleAddOrderProduct = async (product) => {
		console.log(product)
		const res = await CartService.addToCart(product);
		console.log(res);
		if (res.status === "OK") {
			localStorage.setItem("cart_items", JSON.stringify(res.data.cartItems));
			navigate("/cart");
		}
	};

	const fetchProductData = async () => {
		const res = await ProductService.getDetail(id);
		setproductDetails(res.data);
		if (!res || !res.data) {
			throw new Error("Failed to fetch product data");
		}
		return res.data;
	};
	useEffect(() => {
		fetchProductData();
	}, [id]);

	const handleChangeCount = (type) => {
		if (type === "increase") {
			setNumProduct(numProduct + 1);
		} else if (type === "decrease" && numProduct > 1) {
			setNumProduct(numProduct - 1);
		}
	};




	console.log("productDetails", productDetails, access);
	return (
		<Row style={{ padding: "16px", background: "#fff" }}>
			<Col span={10}>
				<Image src={productDetails?.image || giay} alt="Giay" preview={false} />
				<Row style={{ paddingTop: "10px", justifyContent: "space-between" }}>
					{productDetails?.gallery?.map((img, index) => (
						<WrapperStyleImageColImage span={4} key={index}>
							<Image src={img || giaysmall2} alt="Giay small" preview={false} />
						</WrapperStyleImageColImage>
					))}
				</Row>
			</Col>

			<Col span={14}>
				<WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
				<div style={{ paddingLeft: "20px" }}>
					<Rate allowHalf defaultValue={productDetails?.rating} value={productDetails?.rating} />
					<WrapperStyleTextSell>| {productDetails?.purchases} purchases</WrapperStyleTextSell>
				</div>

				<WrapperPriceProduct>
					<WrapperPriceTextProduct>{productDetails?.price}</WrapperPriceTextProduct>
				</WrapperPriceProduct>
				<WrapperAddressProduct>{productDetails?.description}</WrapperAddressProduct>
				<div style={{ margin: "10px 0" }}>
					{/* Chọn size sản phẩm */}
					<div style={{ marginBottom: "10px" }}>
						<div style={{ marginBottom: "10px" }}>
							<div style={{ marginBottom: "10px" }}>

								<div style={{ marginBottom: "10px" }}>
									<label style={{ fontWeight: "bold", marginRight: "10px" }}>Chọn kích thước:</label>
									<div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
										{(productDetails?.product_size || []).map((size, index) => (
											<div key={index} style={{ display: "flex", alignItems: "center", gap: "5px" }}>

												<div onClick={() => setSelectedSize(size)} style={{
													height: "30px",
													width: "50px",
													border: "1px solid black",
													background: selectedSize == size ? "red" : "transparent"
												}}>
													{size}
												</div>
											</div>
										))}
									</div>
								</div>
							</div>

						</div>
					</div>
				</div>

				<div>
					<WrapperSizeProduct>
						<button
							style={{ border: "none", background: "transparent" }}
							onClick={() => handleChangeCount("decrease")}
						>
							<MinusOutlined style={{ color: "#000", fontSize: "20px" }} />
						</button>
						<WrapperInputNumber onChange={onChange} value={numProduct} size="small" />
						<button
							style={{ border: "none", background: "transparent" }}
							onClick={() => handleChangeCount("increase")}
						>
							<PlusOutlined style={{ color: "#000", fontSize: "20px" }} />
						</button>
					</WrapperSizeProduct>
				</div>

				<div>
					<ButtonComponent
						size={40}
						styleButton={{
							background: "rgb(255, 57, 69)",
							height: "48px",
							width: "220px",
							border: "none",
							borderRadius: "4px",
						}}
						onClick={async () =>
							await handleAddOrderProduct({
								productId: productDetails?._id,
								quantity: numProduct,
								cart_size: selectedSize,
							})
						}
						textButton={"Chọn Mua"}
						styleTextButton={{ color: "#fff" }}
					/>
				</div>
			</Col>
		</Row>
	);
};

export default ProductDetailComponent;
