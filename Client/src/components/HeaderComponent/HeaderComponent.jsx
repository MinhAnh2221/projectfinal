import React, { useEffect, useState, useMemo } from "react";
import { Badge, Col, Dropdown, Menu, Card, Popover, Input } from "antd";
import {
	WrapperHeader,
	WrapperTextHeader,
	WrapperHeaderAccount,
	WrapperTextHeaderSmall,
} from "./style";
import {
	TeamOutlined,
	CaretDownOutlined,
	ShoppingOutlined,
	SearchOutlined,
} from "@ant-design/icons";
import ButtonInputSearch from "../ButtonInputSearch/ButtonInputSearch";
import { useNavigate } from "react-router-dom";
import * as UserService from "../../services/UserService";
import { jwtTranslate } from "../../ultilis";
import * as ProductService from "../../services/ProductService";
import * as CartService from "../../services/CartService";
const HeaderComponent = () => {
	const navigate = useNavigate();
	const [stateUser, setStateUser] = useState();
	const [search, setSearch] = useState("");
	const storageAccessToken = localStorage.getItem("access_token");
	const isAdmin = storageAccessToken ? jwtTranslate(storageAccessToken)?.isAdmin : false;
	const handleNavigateLogin = () => {
		navigate("/sign-in");
	};

	const handleLogout = () => {
		localStorage.clear();
		navigate("/");
	};

	const handleViewProfile = () => {
		// Chuyển hướng đến trang thông tin cá nhân
		navigate("/Profile-user");
	};
	const handleAdmin = () => {
		// Chuyển hướng đến trang thông tin cá nhân
		navigate("/system/admin");
	};

	useEffect(() => {
		const fetchDataUser = async () => {
			try {
				const res = await UserService.getDetailsUser(jwtTranslate(storageAccessToken)?.id);
				setStateUser(res?.data);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		const fetchCart = async () => {
			try {
				const res = await CartService.getCart();
				console.log("getCart", res);
				if (res.status === "OK") {
					localStorage.setItem("cart_items", JSON.stringify(res.data.cartItems));
				}
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		if (storageAccessToken) {
			fetchDataUser();
			fetchCart();
		}
	}, [storageAccessToken]);

	// Tạo menu cho Dropdown
	const menu = (
		<Menu>
			<Menu.Item key="profile" onClick={handleViewProfile}>
				Thông tin cá nhân
			</Menu.Item>
			<Menu.Item key="logout" onClick={handleLogout}>
				Logout
			</Menu.Item>
			<Menu.Item key="admin" onClick={handleAdmin}>
				Admin
			</Menu.Item>
		</Menu>
	);
	const onSearch = async (e) => {
		const query = e.target.value; // Lấy giá trị nhập vào
	};
	//search
	const [filteredContributions, setFilteredContributions] = useState([]);
	const [stateProduct, setStateProduct] = useState([]);
	useEffect(() => {
		const FetchProduct = async () => {
			try {
				const res = await ProductService.getAllProduct();
				setStateProduct(res?.data);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		FetchProduct();
	}, []);
	const [inputSearch, setInputSearch] = useState("");
	const [arrow, setArrow] = useState("Show");
	const mergedArrow = useMemo(() => {
		if (arrow === "Hide") {
			return false;
		}
		if (arrow === "Show") {
			return true;
		}
		return {
			pointAtCenter: true,
		};
	}, [arrow]);
	const highlightTitle = (title, searchText) => {
		// Tách tiêu đề thành mảng các phần tử dựa trên từ khóa tìm kiếm
		const parts = title.split(new RegExp(`(${searchText})`, "gi"));

		// Map mỗi phần tử thành một phần tử <span>
		return parts.map((part, index) =>
			// Kiểm tra xem phần này có phải là từ khóa tìm kiếm không
			part.toLowerCase() === searchText.toLowerCase() ? (
				<span key={index} style={{ backgroundColor: "yellow" }}>
					{part}
				</span>
			) : (
				<span key={index}>{part}</span>
			),
		);
	};
	const handleSearchRead = ({ key }) => {
		navigate(`/productDetails/${key}`);
		window.location.reload();
	};
	const ContentSearch = () => (
		<div style={{
			position: "absolute", 
			top: "100%", 
			background: "white", 
			width: "80%", 
			borderRadius: "8px", 
			zIndex: 1000, 
			padding: "16px", 
			

		}}>
			{inputSearch && <p>Search: {inputSearch}</p>}
			{inputSearch && (
				<div>
					{filteredContributions
						.slice(0, 3)
						.sort((a, b) => new Date(b.confirm_date) - new Date(a.confirm_date))
						.map((contribution) => (
							<Card
								title={highlightTitle(contribution.name, inputSearch)}
								bordered={false}
								style={{
									borderBottom: "1px solid rgba(160, 160, 160, 0.3)",
									marginBottom: "10px",
								}}
								hoverable
								onClick={() => handleSearchRead({ key: contribution._id })}
							></Card>
						))}
				</div>
			)}
		</div>
	);

	const handleSearch = (e) => {
		setInputSearch(e.target.value);
		const searchText = e.target.value.toLowerCase();
		const filtered = stateProduct.filter((product) =>
			product.name.toLowerCase().includes(searchText),
		);
		setFilteredContributions(filtered);
	};
	return (
		<div>
			<WrapperHeader gutter={16}>
				<Col span={6}>
					<WrapperTextHeader onClick={() => navigate("/")}>DODAVIP</WrapperTextHeader>
				</Col>
				{!isAdmin && (
				<Col span={12}>
				<div
					style={{ width: "600px", display: "flex", gap: "10px", position: "relative" }}
				>
					<Input
						style={{ flex: 1 }}
						placeholder="Search"
						onChange={(e) => handleSearch(e)} // Gọi hàm xử lý khi nhập
					/>
					<div
						style={{
							backgroundColor: "white",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							width: "40px",
							borderRadius: "10px",
							height: "40px",
						}}
					>
						<SearchOutlined />
					</div>
			
					{/* Hiển thị <ContentSearch /> chỉ khi có giá trị trong inputSearch */}
					{inputSearch && <ContentSearch />}
				</div>
			</Col>
				)}

				<Col span={6} style={{ display: "flex", gap: "20px", alignItems: "center" }}>
					<WrapperHeaderAccount>
						<TeamOutlined style={{ fontSize: "30px " }} />
						{storageAccessToken ? (
							<Dropdown overlay={menu} trigger={["hover"]} placement="bottomRight">
								<div style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
									<WrapperTextHeaderSmall>{stateUser?.name}</WrapperTextHeaderSmall>
									<CaretDownOutlined style={{ marginLeft: "8px" }} />
								</div>
							</Dropdown>
						) : (
							<div onClick={handleNavigateLogin} style={{ cursor: "pointer" }}>
								<WrapperTextHeaderSmall>Đăng Nhập/ Đăng Ký</WrapperTextHeaderSmall>
								<div>
									<WrapperTextHeaderSmall>
										Tài khoản <CaretDownOutlined />
									</WrapperTextHeaderSmall>
								</div>
							</div>
						)}
					</WrapperHeaderAccount>
					{!isAdmin && (
						<a href="/cart" style={{ paddingLeft: "40px" }}>
							<Badge
								count={JSON.parse(localStorage.getItem("cart_items"))?.length || 0}
								size="small"
							>
								<ShoppingOutlined style={{ fontSize: "30px", color: "#fff" }} />
							</Badge>
							<WrapperTextHeaderSmall>Giỏ Hàng</WrapperTextHeaderSmall>
						</a>
					)}
				</Col>
			</WrapperHeader>
		</div>
	);
};

export default HeaderComponent;
