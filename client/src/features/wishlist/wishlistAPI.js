import createApiThunk from "../../utils/createAsyncThunkHelper";

export const fetchWishlistProducts = createApiThunk(
    "all_wishlist_products",
    "get",
    "/wishlist"
);

export const toggleWishlistProduct = createApiThunk(
    "toggle_wishlist_product",
    "post",
    "/wishlist/toggle-wishlist"
);