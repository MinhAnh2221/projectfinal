import * as OrderService from "../../services/OrderService";
import { useState, useEffect } from "react";
import React from "react";
import { jwtTranslate } from "../../ultilis";
import styles from "./style.module.css";
import OrderStats from "../OrderStats/OrderStats";

const OrderPageComponent = () => {
	const [orders, setOrders] = useState([]);
	const accessToken = localStorage.getItem("access_token");
	const [isAdmin] = useState(() =>
		localStorage.getItem("access_token") ? jwtTranslate(accessToken)?.isAdmin : false,
	);

	const fetchData = async () => {
		try {
			const res = isAdmin
				? await OrderService.getAllOrdersByAdmin()
				: await OrderService.getAllOrders();
			console.log(res);
			setOrders(res?.data);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};
	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "VND",
		}).format(amount);
	};

	const formatDate = (date) => {
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};
	useEffect(() => {
		fetchData();
		console.log(isAdmin)
	}, []);
	return (
		<div className={styles.container}>
			<h1 className={styles.title}>Orders List</h1>
			{isAdmin && <OrderStats orders={orders}/>}
			<div className={styles.tableWrapper}>
				<table className={styles.table}>
					<thead>
						<tr>
							<th>Order ID</th>
							<th>Customer</th>
							<th>Date</th>
							<th>Items</th>
							<th>Total</th>
							<th>Payment Status</th>
							<th>Delivery Status</th>
						</tr>
					</thead>
					<tbody>
						{orders.map((order) => (
							<tr key={order._id}>
								<td>
									<span className={styles.orderId}>{order.orderId}</span>
								</td>
								<td>
									<div className={styles.customerInfo}>
										<span className={styles.customerName}>{order.user?.name}</span>
										<span className={styles.customerAddress}>{order.shippingAddress.address}</span>
									</div>
								</td>
								<td>
									<span className={styles.date}>{formatDate(order.createdAt)}</span>
								</td>
								<td>
									<div className={styles.itemsList}>
										{order.orderItems.map((item, index) => (
											<div key={item._id} className={styles.itemRow}>
												<img src={item.image} alt={item.name} className={styles.itemImage} />
												<div className={styles.itemDetails}>
													<span className={styles.itemName}>{item.name}</span>
													<span className={styles.itemQuantity}>
														{item.amount} x {formatCurrency(item.price)}
													</span>
												</div>
											</div>
										))}
									</div>
								</td>
								<td>
									<span className={styles.total}>{formatCurrency(order.totalPrice)}</span>
								</td>
								<td>
									<span className={`${styles.status} ${styles[order.statusPaid]}`}>
										{order.statusPaid}
									</span>
								</td>
								<td>
									<span
										className={`${styles.status} ${
											order.isDelivered ? styles.delivered : styles.pending
										}`}
									>
										{order.isDelivered ? "Delivered" : "Pending"}
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default OrderPageComponent;
