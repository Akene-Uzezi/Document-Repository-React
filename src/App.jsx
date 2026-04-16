import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Archive from "./pages/Archive";
import CreateUser from "./pages/admin/CreateUser";
import Shared from "./pages/Shared";
const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/shared" element={<Shared />} />
        </Route>
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/create-user" element={<CreateUser />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
