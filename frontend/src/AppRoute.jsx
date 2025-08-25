import React, { lazy, Suspense, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import AdminLayout from "./layout/AdminLayout"; // import AdminLayout
import ProtectedRoute from "./layout/ProtectedRoute";

//Auth
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'));

//Product
const ProductList = lazy(() => import('./pages/ProductList'));
const AddProductForm = lazy(() => import('./pages/AddProductForm'));
const EditProductForm = lazy(() => import('./pages/EditProductForm'));
const OrderList = lazy(() => import('./pages/order/OrderList'));

//Order
import CustomerList from "./pages/customer/CustomerList";
import DiscountList from "./components/discount/DiscountList";
import OrderSummary from "./components/Order";
import CategoryList from './pages/CategoryList'; // Import component CategoryList
import AddOrder from './pages/order/AddOrder';
import Checkout from './pages/order/Checkout';

//Admin
const ManageUser = lazy(() => import('./pages/Admin/ManageUser'));
const Statistic = lazy(() => import('./pages/Admin/Statistic'));

function AppRoute() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="mua" element={<OrderSummary />} />

      {/* Admin Layout */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AdminLayout toggleSidebar={toggleSidebar} />}>
          <Route path="order" element={<OrderList />} />
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/pos" element={<AddOrder />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="products" element={<ProductList />} />
          <Route path="add-product" element={<AddProductForm />} />
          <Route path="edit-product/:id" element={<EditProductForm />} />
          <Route path="employee-manage" element={<ManageUser />} />
          <Route path="statistic" element={<Statistic />} />
          <Route path="customer" element={<CustomerList />} />
          <Route path="discount" element={<DiscountList />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default AppRoute