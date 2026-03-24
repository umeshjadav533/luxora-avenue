import createApiThunk from "../../utils/createAsyncThunkHelper";

export const registerUser = createApiThunk(
    "register",
    "post",
    "/auth/register"
);

export const loginUser = createApiThunk(
    "login",
    "post",
    "/auth/login"
);

export const logoutUser = createApiThunk(
    "logout",
    "get",
    "/auth/logout"
);

export const forgotPassword = createApiThunk(
    "forgot-password",
    "post",
    "/auth/password/forgot-password"
);

export const resetPassword = createApiThunk(
    "reset-password",
    "put",
    (data) => `/auth/password/reset-password/${data.token}`
);

export const userProfile = createApiThunk(
    "user-profile",
    "get",
    "/auth/profile"
);

export const updateUser = createApiThunk(
    "update-user",
    "put",
    "/auth/update-user"
);