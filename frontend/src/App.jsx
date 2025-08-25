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
import AppRoute from "./AppRoute";
import CustomerList from "./pages/customer/CustomerList";
import DiscountList from "./components/discount/DiscountList";
import OrderSummary from "./components/Order";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <AuthProvider>
      <Router>
        <AppRoute />
      </Router>
    </AuthProvider>
  );
}

export default App;
