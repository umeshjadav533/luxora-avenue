import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import PublicRoute from "./routes/PublicRoute";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/LoginPage";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { userProfile } from "./features/auth/authAPI";
import WishlistPage from "./pages/WishlistPage";
import SearchPage from "./pages/SearchPage";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(userProfile());
  }, [dispatch])
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={2000} />
      <Routes>
        {/* Auth Pages */}
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route path="/" element={<HomePage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/product/search" element={<SearchPage />} />
          </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
