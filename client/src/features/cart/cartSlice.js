import { createSlice } from "@reduxjs/toolkit";
import {
  addToCartProduct,
  fetchCartProducts,
  fetchCartSummary,
  removeCartProduct,
  updateCartProduct,
} from "./cartAPI";

const initialState = {
  cartProducts: [],
  cartSummary: {
    totalProducts: 0,
    subTotal: 0,
    discount: 0,
    shipping: 0,
    total: 0,
  },
  isCartOpen: false,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
    openCart: (state) => {
      state.isCartOpen = true;
    },
    closeCart: (state) => {
      state.isCartOpen = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // ================= FETCH CART PRODUCTS =================
      .addCase(fetchCartProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.cartProducts = action.payload?.cartProducts || [];
      })
      .addCase(fetchCartProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || null;
      })

      // ================= ADD TO CART =================
      .addCase(addToCartProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCartProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.cartProducts = action.payload?.cartProducts || [];
      })
      .addCase(addToCartProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || null;
      })

      // ================= UPDATE CART =================
      .addCase(updateCartProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCartProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.cartProducts = action.payload?.cartProducts || [];
      })
      .addCase(updateCartProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || null;
      })

      // ================= REMOVE CART =================
      .addCase(removeCartProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeCartProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.cartProducts = action.payload?.cartProducts || [];
      })
      .addCase(removeCartProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || null;
      })

      // ================= FETCH SUMMARY =================
      .addCase(fetchCartSummary.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCartSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.cartSummary = action.payload?.summary || {};
      })
      .addCase(fetchCartSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || null;
      });
  },
});

export const { toggleCart, openCart, closeCart } = cartSlice.actions;

export default cartSlice.reducer;
