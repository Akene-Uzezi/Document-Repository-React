import { Navigate, Outlet } from "react-router-dom";
const AdminProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const isAuthenticated = token !== null;
  const isAdmin = user && user.role === "admin";
  isAuthenticated && isAdmin ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminProtectedRoute;
