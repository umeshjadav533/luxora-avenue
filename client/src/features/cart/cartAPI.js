import createApiThunk from "../../utils/createAsyncThunkHelper";

export const fetchCartProducts = createApiThunk(
    "all_cart_products",
    "get",
    "/cart"
);

export const  addToCartProduct = createApiThunk(
    "add_product",
    "post",
    "/cart/add"
);

export const updateCartProduct = createApiThunk(
    "update_product",
    "put",
    "/cart/update"
);

export const removeCartProduct = createApiThunk(
    "remove_product",
    "delete",
    "/cart/remove"
);

export const fetchCartSummary = createApiThunk(
    "cart_summary",
    "get",
    "/cart/cart-summary"
)