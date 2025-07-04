import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const GuestRoute = () => {
  // Get agent information from Redux state
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  const isRoleAuth = role === "Admin" || role === "Teacher";

  if (isAuthenticated) {
    return <Navigate to={isRoleAuth ? "/dashboard" : "/"} replace />;
  }

  return <Outlet />; // Render login page if not logged in
};

export default GuestRoute;
