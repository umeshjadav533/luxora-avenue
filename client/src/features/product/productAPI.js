import createApiThunk from "../../utils/createAsyncThunkHelper";

export const fetchAllProducts = createApiThunk(
    "all_products",
    "get",
    (data) => `/products?page=${data.page}&limit=${data.limit}`
);

export const fetchProductById = createApiThunk(
    "product",
    "get",
    (data) => `/products/${data.id}`
);

export const fetchProductsForNavigationLinkPage = createApiThunk(
    "page_category",
    "get",
    (data) => `/products/page/${data.category}?page=${data.page}&limit=${data.limit}`
);

export const fetchTagProducts = createApiThunk(
    "tag_products",
    "post",
    (data) => `/products/${data.tag}?page=${data.page}&limit=${data.limit}`
);

export const fetchSearchProducts = createApiThunk(
    "search_products",
    "get",
    (data) => `/products/search=${data.query}&category=${data.category}&subCategory=${data.subCategory}&brand=${data.brand}&tags=${data.tags}&minPrice=${data.minPrice}&maxPrice=${data.maxPrice}&rating=${data.rating}&page=${data.page}&limit=${data.limit}`
)

export const fetchSearchProductsFilter = createApiThunk(
    "products_filter",
    "get",
    "/products/search-filter"
);