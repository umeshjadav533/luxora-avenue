import { createSlice } from "@reduxjs/toolkit";
import { fetchWishlistProducts, toggleWishlistProduct } from "./wishlistAPI";

const initialState = {
  wishlistProductsData: {
    products: [],
    loading: false,
  },
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlistProducts.pending, (state) => {
        state.wishlistProductsData.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlistProducts.fulfilled, (state, action) => {
        state.wishlistProductsData.loading = false;
        state.wishlistProductsData.products = action.payload?.products || [];
        state.error = null;
      })
      .addCase(fetchWishlistProducts.rejected, (state, action) => {
        state.wishlistProductsData.loading = false;
        state.wishlistProductsData.products = [];
        state.error = action.payload?.message || null;
      })
      
      .addCase(toggleWishlistProduct.pending, (state) => {
        state.wishlistProductsData.loading = true;
        state.error = null;
      })
      .addCase(toggleWishlistProduct.fulfilled, (state, action) => {
        state.wishlistProductsData.products = action.payload?.products || [];
        state.error = null;
      })
      .addCase(toggleWishlistProduct.rejected, (state, action) => {
        state.wishlistProductsData.products = [];
        state.error = action.payload?.message || null;
      });
  },
});

export default wishlistSlice.reducer;
