import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartProducts : [],
    cartSummary : {
        totalProducts: 0,
        subTotal: 0,
        discount: 0,
        tax: 0,
        shipping: 0,
        total : 0
    }
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {},
    extraReducers: (builder) => {

    }
});

export default cartSlice.reducer;