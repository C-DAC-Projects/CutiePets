import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout.JSX";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Pets from "./pages/Pets";
import AddPet from "./pages/AddPet";
import EditPet from "./pages/EditPet";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProducts";
import EditProduct from "./pages/EditProduct";
import PendingProductOrders from "./pages/PendingProductOrders";
import PendingPetOrders from "./pages/PendingPetOrders";
import ForgotPassword from "./pages/ForgotPassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/global.css";
import "./styles/layout.css";

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null; // Or you can return a loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* Protected layout for authenticated routes */}
          <Route
            element={
              <ProtectedRoute>
                <Layout
                  isMobile={isMobile}
                  sidebarOpen={sidebarOpen}
                  toggleSidebar={toggleSidebar}
                />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Pet Management */}
            <Route path="/admin/pets" element={<Pets />} />
            <Route path="/admin/pets/add" element={<AddPet />} />
            <Route path="/admin/pets/edit/:id" element={<EditPet />} />

            {/* Product Management */}
            <Route path="/admin/products" element={<Products />} />
            <Route path="/admin/products/add" element={<AddProduct />} />
            <Route path="/admin/products/edit/:id" element={<EditProduct />} />

            {/* Order Management */}
            <Route
              path="/admin/orders/products"
              element={<PendingProductOrders />}
            />
            <Route path="/admin/orders/pets" element={<PendingPetOrders />} />
          </Route>

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>

        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
