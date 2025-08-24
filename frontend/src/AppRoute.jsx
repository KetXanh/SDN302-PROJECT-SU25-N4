import React, { lazy, Suspense } from 'react';
import {Route, Routes } from 'react-router-dom';
import ProductList from "./pages/ProductList";
import AddProductForm from "./pages/AddProductForm";
import EditProductForm from "./pages/EditProductForm";
import AdminLayout from "./layout/AdminLayout"; // import AdminLayout
import "./App.css";
import OrderList from "./pages/order/OrderList";

//Auth
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));

//Product
const ProductList = lazy(() => import('./pages/ProductList'));
const AddProductForm = lazy(() => import('./pages/AddProductForm'));
const EditProductForm = lazy(() => import('./pages/EditProductForm'));
const OrderList = lazy(() => import('./pages/order/OrderList'));

function AppRoute() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

export default AppRoute