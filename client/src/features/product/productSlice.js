import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllProducts,
  fetchProductById,
  fetchProductsForNavigationLinkPage,
  fetchSearchProducts,
  fetchSearchProductsFilter,
  fetchTagProducts,
} from "./productAPI";

const initialState = {
  productsData: {
    products: [],
    meta: {
      totalDocs: 0,
      limit: 5,
      totalPages: 0,
      currentPage: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    },
    loading: false,
  },

  productData: {
    product: null,
    loading: false,
  },

  categoryProductsData: {
    products: [],
    meta: {
      totalDocs: 0,
      limit: 5,
      totalPages: 0,
      currentPage: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    },
    loading: false,
  },

  tagProductsData: {
    products: [],
    meta: {
      totalDocs: 0,
      limit: 5,
      totalPages: 0,
      currentPage: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    },
    loading: false,
  },

  searchProductsData: {
    products: [],
    meta: {
      totalDocs: 0,
      limit: 5,
      totalPages: 0,
      currentPage: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    },
    loading: false,
  },

  searchProductsFilter: {
    brands: [],
    categories: [],
    subCategories: [],
    tags: [],
    loading: false,
  },

  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // =============== FETCH ALL PRODUCTS ===============
      .addCase(fetchAllProducts.pending, (state) => {
        state.productsData.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.productsData.loading = false;
        state.productsData.products = action.payload?.products || [];
        state.productsData.meta =
          action.payload?.meta || state.productsData.meta;
        state.error = null;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.productsData.loading = false;
        state.productsData.products = [];
        state.error = action.error?.message || null;
      })

      // =============== FETCH PRODUCT BY ID ===============
      .addCase(fetchProductById.pending, (state) => {
        state.productData.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.productData.loading = false;
        state.productData.product = action.payload?.product || null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.productData.product = null;
        state.error = action.error?.message || null;
      })

      // =============== FETCH CATEGORY PRODUCTS ===============
      .addCase(fetchProductsForNavigationLinkPage.pending, (state) => {
        state.categoryProductsData.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProductsForNavigationLinkPage.fulfilled,
        (state, action) => {
          state.categoryProductsData.loading = false;
          state.categoryProductsData.products =
            action.payload?.products || [];
          state.categoryProductsData.meta =
            action.payload?.meta || state.categoryProductsData.meta;
          state.error = null;
        },
      )
      .addCase(fetchProductsForNavigationLinkPage.rejected, (state, action) => {
        state.categoryProductsData.loading = false;
        state.categoryProductsData.products = [];
        state.error = action.error?.message || null;
      })

      // =============== FETCH TAG PRODUCTS ===============
      .addCase(fetchTagProducts.pending, (state) => {
        state.tagProductsData.loading = true;
        state.error = null;
      })
      .addCase(fetchTagProducts.fulfilled, (state, action) => {
        state.tagProductsData.loading = false;
        state.tagProductsData.products = action.payload?.products || [];
        state.tagProductsData.meta =
          action.payload?.meta || state.tagProductsData.meta;
        state.error = null;
      })
      .addCase(fetchTagProducts.rejected, (state, action) => {
        state.tagProductsData.loading = false;
        state.tagProductsData.products = [];
        state.error = action.error?.message || null;
      })

      // =============== FETCH SEARCH PRODUCTS ===============
      .addCase(fetchSearchProducts.pending, (state) => {
        state.searchProductsData.loading = true;
        state.error = null;
      })
      .addCase(fetchSearchProducts.fulfilled, (state, action) => {
        state.searchProductsData.loading = false;
        state.searchProductsData.products = action.payload?.products || [];
        state.searchProductsData.meta =
          action.payload?.meta || state.searchProductsData.meta;
        state.error = null;
      })
      .addCase(fetchSearchProducts.rejected, (state, action) => {
        state.searchProductsData.loading = false;
        state.searchProductsData.products = [];
        state.error = action.error?.message || null;
      })

      // =============== FETCH SEARCH FILTERS ===============
      .addCase(fetchSearchProductsFilter.pending, (state) => {
        state.searchProductsFilter.loading = true;
        state.error = null;
      })
      .addCase(fetchSearchProductsFilter.fulfilled, (state, action) => {
        state.searchProductsFilter.loading = false;
        state.searchProductsFilter.brands = action.payload?.brands || [];
        state.searchProductsFilter.categories =
          action.payload?.categories || [];
        state.searchProductsFilter.subCategories =
          action.payload?.subCategories || [];
        state.searchProductsFilter.tags = action.payload?.tags || [];
        state.error = null;
      })
      .addCase(fetchSearchProductsFilter.rejected, (state, action) => {
        state.searchProductsFilter.loading = false;
        state.error = action.error?.message || null;
      });
  },
});

export default productSlice.reducer;
