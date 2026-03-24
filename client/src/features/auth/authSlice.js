import { createSlice } from "@reduxjs/toolkit";
import { forgotPassword, loginUser, logoutUser, registerUser, resetPassword, updateUser, userProfile } from "./authAPI";

const initialState = {
  user: null,
  isAuthenticated: false,

  loading: {
    register: false,
    login: false,
    logout: false,
    forgotPassword: false,
    resetPassword: false,
    profile: false,
    updateUser: false,
  },

  error: null,
  message: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // ================= REGISTER =================
      .addCase(registerUser.pending, (state) => {
        state.loading.register = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading.register = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.message = action.payload.message;
      }).addCase(registerUser.rejected, (state, action) => {
        state.loading.register = false;
        state.error = action.payload?.message || action.error.message;
      })

      // ================= LOGIN =================
      .addCase(loginUser.pending, (state) => {
        state.loading.login = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading.login = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.message = action.payload.message;
      }).addCase(loginUser.rejected, (state, action) => {
        state.loading.login = false;
        state.error = action.payload?.message || action.error.message;
      })

      // ================= LOGOUT =================
      .addCase(logoutUser.pending, (state) => {
        state.loading.logout = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loading.logout = false;
        state.user = null;
        state.isAuthenticated = false;
        state.message = action.payload.message;
      }).addCase(logoutUser.rejected, (state, action) => {
        state.loading.logout = false;
        state.error = action.payload?.message || action.error.message;
      })

      // ================= FORGOT PASSWORD =================
      .addCase(forgotPassword.pending, (state) => {
        state.loading.forgotPassword = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading.forgotPassword = false;
        state.message = action.payload.message;
      }).addCase(forgotPassword.rejected, (state, action) => {
        state.loading.forgotPassword = false;
        state.error = action.payload?.message || action.error.message;
      })

      // ================= RESET PASSWORD =================
      .addCase(resetPassword.pending, (state) => {
        state.loading.resetPassword = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading.resetPassword = false;
        state.message = action.payload.message;
      }).addCase(resetPassword.rejected, (state, action) => {
        state.loading.resetPassword = false;
        state.error = action.payload?.message || action.error.message;
      })

      // ================= USER PROFILE =================
      .addCase(userProfile.pending, (state) => {
        state.loading.profile = true;
      })
      .addCase(userProfile.fulfilled, (state, action) => {
        state.loading.profile = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      }).addCase(userProfile.rejected, (state, action) => {
        state.loading.profile = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload?.message || action.error.message;
      })

      // ================= UPDATE USER =================
      .addCase(updateUser.pending, (state) => {
        state.loading.updateUser = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading.updateUser = false;
        state.user = action.payload.user;
        state.message = action.payload.message;
      }).addCase(updateUser.rejected, (state, action) => {
        state.loading.updateUser = false;
        state.error = action.payload?.message || action.error.message;
      })
  },
});

export const { clearError, clearMessage } = authSlice.actions;
export default authSlice.reducer;
