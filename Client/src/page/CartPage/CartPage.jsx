import React, { useCallback, useEffect, useRef } from "react";
import { useState } from "react";
import styles from "./ShoppingCart.module.css";
import * as CartService from "../../services/CartService";
import * as OrderService from "../../services/OrderService";
function useDebounce(callback, delay) {
	const timeoutRef = useRef(null);

	useEffect(() => {
		// Cleanup on unmount
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	const debouncedCallback = useCallback(
		(...args) => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			timeoutRef.current = setTimeout(() => {
				callback(...args);
			}, delay);
		},
		[callback, delay],
	);

	return debouncedCallback;
}
const ShoppingCart = () => {
	const [cartItems, setCartItems] = useState([]);
	const [formAddress, setFormAddress] = useState({
		name: {
			value: "",
			error: "",
		},
		phone: {
			value: "",
			error: "",
		},
		address: {
			value: "",
			error: "",
		},
	});
	// Fetch cart items when the component loads
	useEffect(() => {
		const fetchCart = async () => {
			try {
				const res = await CartService.getCart();
				if (res.status === "OK") {
					setCartItems(res.data.cartItems);
					localStorage.setItem("cart_items", JSON.stringify(res.data.cartItems));
				}
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		fetchCart();
	}, []);
	// Debounced function for API update

	const debouncedUpdateCart = useDebounce(async (productId, quantity) => {
		const res = await CartService.updateItemInCart({ productId, quantity });
		if (res.status === "OK") {
			localStorage.setItem("cart_items", JSON.stringify(res.data.cartItems));
			setCartItems(res.data.cartItems);
		}
	}, 1000);
	// Handle input change
	const handleQuantityChange = (e, item) => {
		const newQuantity = parseInt(e.target.value, 10);
		if (isNaN(newQuantity) || newQuantity < 0 || newQuantity > item.product.countInStock) return;

		// Update cartItems locally for instant UI feedback
		setCartItems((prev) =>
			prev.map((i) => (i.product._id === item.product._id ? { ...i, quantity: newQuantity } : i)),
		);

		// Debounced API call to update the backend
		debouncedUpdateCart(item.product._id, newQuantity);
	};
	const createOrder = async () => {
		if(formAddress.name.value.length === 0 || formAddress.phone.value.length === 0 || formAddress.address.value.length === 0) {
			setFormAddress((prev) => ({
				...prev,
				name: {
					value: prev.name.value,
					error: prev.name.value.length === 0 ? "Họ và tên không được để trống" : "",
				},
				phone: {
					value: prev.phone.value,
					error: prev.phone.value.length === 0 ? "Số điện thoại không được để trống" : "",
				},
				address: {
					value: prev.address.value,
					error: prev.address.value.length === 0 ? "Địa chỉ không được để trống" : "",
				},
			}));
			return;
		}
		const order = {
			orderItems: cartItems.map((item) => ({
				name: item.product.name,
				amount: item.quantity,
				image: item.product.image,
				price: item.product.price,
				product: item.product._id,
				Size: item.product.product_size
			})),
			shippingAddress: {
				name: formAddress.name.value,
				address: formAddress.address.value,
				phone: formAddress.phone.value,
			},
			paymentMethod: "cash",
		};
		const res = await OrderService.createOrder(order);
		if (res.status === "OK") {
			console.log("Order created successfully:", res.data);
			window.location.href = res.data.url;
		}
	};
	return (
		<div className={styles.relative}>
			<div className={styles.container}>
				<div className={styles["inner-container"]}>
					<header className={styles.header}>
						<h1 className={styles["header-title"]}>Giỏ hàng</h1>
					</header>

					<div className={styles["cart-list"]}>
						<ul>
							{cartItems.map((item) => (
								<li key={item.product._id} className={styles["cart-item"]}>
									<img
										src={item.product.image}
										alt={item.product.name}
										className={styles["product-image"]}
									/>

									<div className={styles["product-info"]}>
										<h3>{item.product.name}</h3>

										<dl className={styles["product-details"]}>
											<div
												style={{
													fontSize: "16px",
												}}
											>
												<span className="inline">Còn lại:</span>
												<span className="inline">{item.product.countInStock}</span>
											</div>
											<div
												style={{
													fontSize: "16px",
												}}
											>
												<span className="inline">Loại:</span>
												<span className="inline">{item.product.type}</span>
											</div>

											<div
												style={{
													fontSize: "16px",
												}}
											>
												<span className="inline">Price:</span>
												<span className="inline">{item.product.price}</span>
											</div>
											<div
												style={{
													fontSize: "16px",
												}}
											>
												<span className="inline">Size:</span>
												<span className="inline">{item.cart_size}</span>
											</div>
										</dl>
									</div>

									<div className={styles["quantity-container"]}>
										<div>
											<label htmlFor="Quantity" className={styles.srOnly}>
												Quantity
											</label>

											<div className={styles.flexContainer}>
												<button
													type="button"
													className={styles.button}
													onClick={async () => {
														if (item.quantity - 1 <= 0) {
															return;
														}
														const res = await CartService.addToCart({
															productId: item.product._id,
															quantity: -1,
														});
														localStorage.setItem("cart_items", JSON.stringify(res.data.cartItems));
														setCartItems(res.data.cartItems);
													}}
												>
													&minus;
												</button>

												<input
													type="number"
													id="Quantity"
													value={item.quantity}
													className={styles.input}
													onChange={(e) => {
														handleQuantityChange(e, item);
													}}
												/>

												<button
													type="button"
													className={styles.button}
													onClick={async () => {
														if (item.quantity + 1 > item.product.countInStock) {
															return;
														}
														const res = await CartService.addToCart({
															productId: item.product._id,
															quantity: 1,
														});
														localStorage.setItem("cart_items", JSON.stringify(res.data.cartItems));
														setCartItems(res.data.cartItems);
													}}
												>
													&#43;
												</button>
											</div>
										</div>

										<button
											className={styles["remove-button"]}
											onClick={async () => {
												const res = await CartService.deleteItemInCart(item.product._id);
												localStorage.setItem("cart_items", JSON.stringify(res.data.cartItems));
												setCartItems(res.data.cartItems);
											}}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth="1.5"
												stroke="currentColor"
												className="size-4"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
												/>
											</svg>
										</button>
									</div>
								</li>
							))}
						</ul>
						{/* address form */}
						<div className={styles["address-form"]}>
							<h2 className={styles["address-form-title"]}>Địa chỉ giao hàng</h2>
							<form className={styles["form"]}>
								<div className={styles["form-group"]}>
									<label htmlFor="name">Họ và tên</label>
									<input
										type="text"
										id="name"
										name="name"
										value={formAddress.name.value}
										onChange={(e) => {
											setFormAddress((prev) => ({
												...prev,
												name: {
													value: e.target.value,
													error: e.target.value.length === 0 ? "Họ và tên không được để trống" : "",
												},
											}));
										}}
									/>
									<span className={styles["error-message"]}>{formAddress.name.error}</span>
								</div>
								<div className={styles["form-group"]}>
									<label htmlFor="phone">Số điện thoại</label>
									<input
										type="text"
										id="phone"
										name="phone"
										value={formAddress.phone.value}
										onChange={(e) => {
											setFormAddress((prev) => ({
												...prev,
												phone: {
													value: e.target.value,
													error:
														e.target.value.length === 0 ? "Số điện thoại không được để trống" : "",
												},
											}));
										}}
									/>
									<span className={styles["error-message"]}>{formAddress.phone.error}</span>
								</div>
								<div className={styles["form-group"]}>
									<label htmlFor="address">Địa chỉ</label>
									<input
										type="text"
										id="address"
										name="address"
										value={formAddress.address.value}
										onChange={(e) => {
											setFormAddress((prev) => ({
												...prev,
												address: {
													value: e.target.value,
													error: e.target.value.length === 0 ? "Địa chỉ không được để trống" : "",
												},
											}));
										}}
									/>
									<span className={styles["error-message"]}>{formAddress.address.error}</span>
								</div>
							</form>
						</div>

						<div className={styles["summary-section"]}>
							<div className={styles["summary-container"]}>
								<ul className={styles["summary-list"]}>
									<li className={styles["summary-item"]}>
										<span>Tạm tính</span>
										<span>
											{cartItems.reduce((acc, item) => {
												return acc + item.product.price * item.quantity;
											}, 0)}
										</span>
									</li>

									<li className={styles["summary-item"]}>
										<span>Phí giao hàng</span>
										<span>0</span>
									</li>

									<li className={styles["summary-item"]}>
										<span>Giảm giá</span>
										<span>0%</span>
									</li>
								</ul>

								<div className={styles["summary-total"]}>
									<strong>Tổng tiền</strong>
									<strong>
										{cartItems.reduce((acc, item) => {
											return acc + item.product.price * item.quantity;
										}, 0)}
									</strong>
								</div>

								<button
									onClick={() => {
										const order = createOrder();
										console.log(order);
									}}
									className={styles["checkout-button"]}
								>
									Thanh toán
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ShoppingCart;
