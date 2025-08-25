import React, { useState } from "react";
import Modal from "react-modal";
import { createDiscount } from "../../services/discountService";

Modal.setAppElement("#root");

const AddDiscountModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    code: "",
    type: "percent",
    value: 0,
    customerRank: "Normal",
    channel: "counter",
    minOrderValue: 0,
    maxAmount: 0,
    usageLimit: 0,
    isActive: true,
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm({ ...form, [name]: type === "number" ? Number(value) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createDiscount(form);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Error creating discount", err);
      alert("Thêm mã giảm giá thất bại");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: "500px",
          padding: "20px",
          borderRadius: "8px",
        },
        overlay: { backgroundColor: "rgba(0,0,0,0.5)" },
      }}
    >
      <h2 className="text-xl font-semibold mb-4">Thêm mã giảm giá</h2>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <input
          name="code"
          value={form.code}
          onChange={handleChange}
          placeholder="Mã giảm giá"
          className="w-full border px-3 py-2 rounded"
          required
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="percent">Phần trăm (%)</option>
          <option value="fixed">Số tiền cố định</option>
        </select>
        <input
          type="number"
          name="value"
          value={form.value}
          onChange={handleChange}
          placeholder="Giá trị"
          className="w-full border px-3 py-2 rounded"
          required
        />
        <select
          name="customerRank"
          value={form.customerRank}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="Normal">Normal</option>
          <option value="Silver">Silver</option>
          <option value="Gold">Gold</option>
          <option value="Platinum">Platinum</option>
        </select>
        <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Thêm
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddDiscountModal;
