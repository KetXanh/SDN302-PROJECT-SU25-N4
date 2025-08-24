import React, { lazy, Suspense, useState } from 'react';
import {Route, Routes } from 'react-router-dom';

import AdminLayout from "./layout/AdminLayout"; // import AdminLayout

//Auth
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));

//Product
const ProductList = lazy(() => import('./pages/ProductList'));
const AddProductForm = lazy(() => import('./pages/AddProductForm'));
const EditProductForm = lazy(() => import('./pages/EditProductForm'));
const OrderList = lazy(() => import('./pages/order/OrderList'));

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
      {/* Admin Layout */}
                <Route path="/" element={<AdminLayout toggleSidebar={toggleSidebar} />}>
                  <Route path="order" element={<OrderList />} />
                  <Route path="products" element={<ProductList />} />
                  <Route path="add-product" element={<AddProductForm />} />
                  <Route path="edit-product/:id" element={<EditProductForm />} />
                  <Route path="employee-manage" element={<ManageUser />} />
                  <Route path="statistic" element={<Statistic />} />
                </Route>
    </Routes>
  )
}

export default AppRoute