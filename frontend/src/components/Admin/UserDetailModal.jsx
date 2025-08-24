import React from "react";
import { User, Mail, Phone, MapPin, Shield, CheckCircle, XCircle } from "lucide-react";

const UserDetailModal = ({ open, onClose, user }) => {
  if (!open || !user) return null;

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
          <div className="p-2 rounded-lg bg-slate-100">
            <User className="w-6 h-6 text-slate-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Chi tiết Người Dùng</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 text-gray-500" />
                Họ tên
              </label>
              <div className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900">
                {user.fullname}
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 text-gray-500" />
                Email
              </label>
              <div className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900">
                {user.email}
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 text-gray-500" />
                Số điện thoại
              </label>
              <div className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900">
                {user.phone}
              </div>
            </div>
          </div>
          <div className="space-y-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                Địa chỉ
              </label>
              <div className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900">
                {user.address}
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Shield className="w-4 h-4 text-gray-500" />
                Vai trò
              </label>
              <div className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900">
                {user.role}
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 text-gray-500" />
                Giới tính
              </label>
              <div className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900">
                {user.gender}
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                {user.status === "Active" ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                Trạng thái
              </label>
              <div className={`w-full px-4 py-3 rounded-lg border bg-gray-50 text-gray-900 ${
                user.status === "Active"
                  ? "border-green-200 text-green-700"
                  : "border-red-200 text-red-700"
              }`}>
                {user.status}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;