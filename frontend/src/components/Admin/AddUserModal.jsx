import React, { useState } from "react";
import useUser from "../../hooks/useUser";
import { UserPlus, Mail, Lock, User, Phone, MapPin, Shield, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const initialForm = {
  username: "",
  password: "",
  email: "",
  fullname: "",
  gender: "Male",
  phone: "",
  address: "",
  role: "Admin",
};

const AddUserModal = ({ open, onClose }) => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const { createUser, loading } = useUser();

  const validateField = (name, value) => {
    const errors = {};
    switch (name) {
      case "username":
        if (!value.trim()) errors.username = "Tên đăng nhập không được để trống";
        else if (value.length < 3) errors.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
        break;
      case "password":
        if (!value) errors.password = "Mật khẩu không được để trống";
        else if (value.length < 6) errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
        break;
      case "email":
        if (!value) errors.email = "Email không được để trống";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errors.email = "Email không hợp lệ";
        break;
      case "fullname":
        if (!value.trim()) errors.fullname = "Họ tên không được để trống";
        break;
      case "phone":
        if (!value.trim()) errors.phone = "Số điện thoại không được để trống";
        else if (!/^\d{9,11}$/.test(value)) errors.phone = "Số điện thoại không hợp lệ";
        break;
      case "address":
        if (!value.trim()) errors.address = "Địa chỉ không được để trống";
        break;
      default:
        break;
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
    // Real-time validation
    const errors = validateField(name, value);
    setFieldErrors((prev) => ({ ...prev, ...errors, [name]: errors[name] || "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    // Validate all fields
    let allErrors = {};
    Object.keys(form).forEach((field) => {
      const errors = validateField(field, form[field]);
      allErrors = { ...allErrors, ...errors };
    });
    setFieldErrors(allErrors);
    if (Object.keys(allErrors).length > 0) return;

    try {
      await createUser(form);
      setSuccess("Thêm người dùng thành công!");
      setForm(initialForm);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setError("Thêm người dùng thất bại!");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-8 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-blue-50">
            <UserPlus className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Thêm Người Dùng Mới</h2>
        </div>
        {error && (
          <div className="mb-4 flex items-center bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-sm" role="alert">
            <XCircle className="w-5 h-5 mr-3 text-red-500" />
            <span className="font-medium">{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-4 flex items-center bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-sm" role="alert">
            <CheckCircle className="w-5 h-5 mr-3 text-green-500" />
            <span className="font-medium">{success}</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 text-gray-500" />
                  Tên đăng nhập *
                </label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    fieldErrors.username
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                  } focus:ring-4 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500`}
                  placeholder="Nhập tên đăng nhập..."
                />
                {fieldErrors.username && (
                  <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {fieldErrors.username}
                  </div>
                )}
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Lock className="w-4 h-4 text-gray-500" />
                  Mật khẩu *
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    fieldErrors.password
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                  } focus:ring-4 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500`}
                  placeholder="Nhập mật khẩu..."
                />
                {fieldErrors.password && (
                  <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {fieldErrors.password}
                  </div>
                )}
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    fieldErrors.email
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                  } focus:ring-4 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500`}
                  placeholder="Nhập email..."
                />
                {fieldErrors.email && (
                  <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {fieldErrors.email}
                  </div>
                )}
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 text-gray-500" />
                  Họ tên *
                </label>
                <input
                  type="text"
                  name="fullname"
                  value={form.fullname}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    fieldErrors.fullname
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                  } focus:ring-4 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500`}
                  placeholder="Nhập họ tên..."
                />
                {fieldErrors.fullname && (
                  <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {fieldErrors.fullname}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  Số điện thoại *
                </label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    fieldErrors.phone
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                  } focus:ring-4 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500`}
                  placeholder="Nhập số điện thoại..."
                />
                {fieldErrors.phone && (
                  <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {fieldErrors.phone}
                  </div>
                )}
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  Địa chỉ *
                </label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    fieldErrors.address
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                  } focus:ring-4 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500`}
                  placeholder="Nhập địa chỉ..."
                />
                {fieldErrors.address && (
                  <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {fieldErrors.address}
                  </div>
                )}
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Shield className="w-4 h-4 text-gray-500" />
                  Vai trò *
                </label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 focus:ring-4 transition-all duration-200 bg-white text-gray-900"
                >
                  <option value="Admin">Admin</option>
                  <option value="Employee">Employee</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 text-gray-500" />
                  Giới tính *
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 focus:ring-4 transition-all duration-200 bg-white text-gray-900"
                >
                  <option value="Male">Nam</option>
                  <option value="Female">Nữ</option>
                  <option value="Other">Khác</option>
                </select>
              </div>
            </div>
          </div>
          <div className="pt-8">
            <button
              type="submit"
              disabled={
                loading ||
                Object.values(fieldErrors).some((err) => err)
              }
              className={`w-full px-6 py-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
                loading || Object.values(fieldErrors).some((err) => err)
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-slate-800 hover:bg-slate-700 text-white shadow-sm hover:shadow-md"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang thêm người dùng...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Thêm Người Dùng
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;