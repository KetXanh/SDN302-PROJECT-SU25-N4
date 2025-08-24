import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "./pages/ProductList";
import AddProductForm from "./pages/AddProductForm";
import EditProductForm from "./pages/EditProductForm";
import AdminLayout from "./layout/AdminLayout";
import "./App.css";
import OrderList from "./pages/order/OrderList";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Admin Layout */}
          <Route path="/" element={<AdminLayout toggleSidebar={toggleSidebar} />}>
            <Route path="order" element={<OrderList />} />
            <Route path="products" element={<ProductList />} />
            <Route path="add-product" element={<AddProductForm />} />
            <Route path="edit-product/:id" element={<EditProductForm />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
