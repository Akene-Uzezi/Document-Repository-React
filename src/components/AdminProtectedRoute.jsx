import { Navigate, Outlet } from "react-router-dom";
const AdminProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")) !== null;
  const isAuthenticated = token !== null;
  const isAdmin = user && user.isAdmin === true;
  return isAuthenticated && isAdmin ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminProtectedRoute;
