import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/redux/app/reduxHook";

const GuestRoute = () => {
    const { isAuthenticated, role } = useAppSelector((state) => state.auth);

  const isRoleAuth = role === "user";

  if (isAuthenticated) {
    return <Navigate to={isRoleAuth ? "/dashboard" : "/"} replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
