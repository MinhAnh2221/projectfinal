import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    orderItems: [

    ],
    shippingAddress: {

    },
    paymentMethod: '',
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
    user: '',
    isPaid: false,
    paidAt: '',
    isDelivered: false,
    deliveredAt: '',
}

export const orderSlide = createSlice({
    name: 'order',
    initialState,
    reducers: {
        addOderProduct: (state, action) => {
            console.log({ state, action })
        },
    },
}
)

export const { addOderProduct } = orderSlide.actions
export default orderSlide.reducer