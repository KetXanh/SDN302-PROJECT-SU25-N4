import React, { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ForbiddenPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/pos");
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-8 py-10 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">403 Forbidden</h2>
        <p className="text-gray-700 mb-2">
          Bạn không có quyền truy cập trang này.
        </p>
        <p className="text-gray-500 text-sm">
          Đang chuyển hướng về trang POS...
        </p>
      </div>
    </div>
  );
};

const AdminProtectedRoute = () => {
  const { user } = useAuth();
  // Only allow if user exists and role is Admin
  return user && user.role === "Admin" ? <Outlet /> : <ForbiddenPage />;
};

export default AdminProtectedRoute;