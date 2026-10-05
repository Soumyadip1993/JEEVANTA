import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleRoute({ roles, children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!roles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace state={{ from: location.pathname }} />;
  }

  return children;
}
