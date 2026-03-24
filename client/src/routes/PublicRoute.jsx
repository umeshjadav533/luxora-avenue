import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading.profile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;