import React, { useState } from "react";
import { createDiscount } from "../../services/discountService";
import * as Dialog from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";

const AddDiscountModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    code: "",
    type: "percent",
    value: "",
    maxAmount: "",
    minOrderValue: "",
    usageLimit: "",
    channel: "counter",
    customerRank: "Normal",
  });

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (e.target.type === "number") {
      value = Number(value);
      if (value < 0) value = 0;
    }

    if (name === "value" && formData.type === "percent" && value > 100) {
      value = 100;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createDiscount(formData);
      onSuccess && onSuccess();
      onClose();
      setFormData({
        code: "",
        type: "percent",
        value: "",
        maxAmount: "",
        minOrderValue: "",
        usageLimit: "",
        channel: "counter",
        customerRank: "Normal",
      });
    } catch (error) {
      console.error("Thêm mã giảm giá thất bại:", error);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white p-6 rounded-xl shadow-lg">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Thêm mã giảm giá
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Code */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                Mã giảm giá
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="VD: SUMMER20"
                required
              />
            </div>

            {/* Type */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                Loại giảm giá
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="percent">Giảm theo %</option>
                <option value="amount">Giảm số tiền (VNĐ)</option>
              </select>
            </div>

            {/* Value */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                Giá trị giảm
              </label>
              <input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleChange}
                min="0"
                max={formData.type === "percent" ? "100" : undefined}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="VD: 20 = 20% hoặc 50000 = 50k"
                required
              />
            </div>

            {/* Max Amount */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                Giảm tối đa (VNĐ)
              </label>
              <input
                type="number"
                name="maxAmount"
                value={formData.maxAmount}
                onChange={handleChange}
                min="0"
                className="w-full border rounded-lg px-3 py-2"
                placeholder="VD: 100000"
              />
            </div>

            {/* Min Order Value */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                Đơn hàng tối thiểu (VNĐ)
              </label>
              <input
                type="number"
                name="minOrderValue"
                value={formData.minOrderValue}
                onChange={handleChange}
                min="0"
                className="w-full border rounded-lg px-3 py-2"
                placeholder="VD: 200000"
              />
            </div>

            {/* Usage Limit */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                Số lần sử dụng
              </label>
              <input
                type="number"
                name="usageLimit"
                value={formData.usageLimit}
                onChange={handleChange}
                min="0"
                className="w-full border rounded-lg px-3 py-2"
                placeholder="VD: 100"
              />
            </div>

            {/* Channel */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                Kênh áp dụng
              </label>
              <select
                name="channel"
                value={formData.channel}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="counter">Quầy (Offline)</option>
                <option value="online">Online</option>
                <option value="all">Tất cả kênh</option>
              </select>
            </div>

            {/* Customer Rank */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                Rank khách hàng
              </label>
              <select
                name="customerRank"
                value={formData.customerRank}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="Normal">Normal</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Platinum">Platinum</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"
              >
                Lưu
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AddDiscountModal;
