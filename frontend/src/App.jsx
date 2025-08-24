import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "./pages/ProductList";
import AddProductForm from "./pages/AddProductForm";
import EditProductForm from "./pages/EditProductForm";
import AdminLayout from "./layout/AdminLayout"; // import AdminLayout
import "./App.css";
import OrderList from "./pages/order/OrderList";
import CustomerList from "./pages/customer/CustomerList";
import DiscountList from "./components/discount/DiscountList";
import OrderSummary from "./components/Order";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);


  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);


  return (
    <Router>
      <Routes>
        <Route path="mua" element={<OrderSummary />} />
        {/* Admin Layout */}
        <Route path="/" element={<AdminLayout toggleSidebar={toggleSidebar} />}>
          {" "}
          <Route path="order" element={<OrderList />} />
          <Route path="customer" element={<CustomerList />} />
          <Route path="discount" element={<DiscountList />} />
          <Route path="products" element={<ProductList />} />
          <Route path="add-product" element={<AddProductForm />} />
          <Route path="edit-product/:id" element={<EditProductForm />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
