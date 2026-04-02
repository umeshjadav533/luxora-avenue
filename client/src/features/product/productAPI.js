import createApiThunk from "../../utils/createAsyncThunkHelper";

export const fetchAllProducts = createApiThunk(
  "all_products",
  "get",
  (data) => `/product?page=${data.page}&limit=${data.limit}`,
);

export const fetchProductById = createApiThunk(
  "product",
  "get",
  (data) => `/product/${data.id}`,
);

export const fetchProductsForNavigationLinkPage = createApiThunk(
  "page_category",
  "get",
  (data) =>
    `/product/page/${data.category}?page=${data.page}&limit=${data.limit}`,
);

export const fetchTagProducts = createApiThunk(
  "tag_products",
  "post",
  (data) => `/product/tag?page=${data.page}&limit=${data.limit}`,
);

export const fetchSearchProducts = createApiThunk(
  "search_products",
  "get",
  (params) => {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) =>
          value !== undefined && value !== null && value !== ""
      )
    );

    const queryString = new URLSearchParams(filteredParams).toString();

    return `/product/filter/search?${queryString}`;
  }
);

export const fetchSearchProductsFilter = createApiThunk(
  "products_filter",
  "get",
  "/product/filter/product-filter",
);
