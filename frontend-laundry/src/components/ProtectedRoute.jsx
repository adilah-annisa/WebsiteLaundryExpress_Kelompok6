import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, ready, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!ready) return <Loading />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const redirect =
      user.role === "pelanggan"
        ? "/pelanggan"
        : user.role === "kurir"
        ? "/kurir"
        : "/";
    return <Navigate to={redirect} replace />;
  }

  return children;
}
