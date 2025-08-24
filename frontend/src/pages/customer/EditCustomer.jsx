import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import {
  getCustomerById,
  updateCustomer,
} from "../../services/customerService";

Modal.setAppElement("#root");

const EditCustomerModal = ({ isOpen, onClose, customerId, onSuccess }) => {
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (isOpen && customerId) {
      const fetchCustomer = async () => {
        try {
          const res = await getCustomerById(customerId);
          setForm(res.data);
        } catch (err) {
          console.error("Error fetching customer", err);
          alert("Không thể tải dữ liệu khách hàng");
        }
      };
      fetchCustomer();
    }
  }, [isOpen, customerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "totalPoints" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCustomer(customerId, form);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Error updating customer", err);
      alert(err.response?.data?.message || "Cập nhật khách hàng thất bại");
    }
  };

  if (!form) return null;

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
      contentLabel="Cập nhật khách hàng"
    >
      <h2 className="text-xl font-semibold mb-4">Cập nhật khách hàng</h2>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Tên khách hàng"
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          name="phone"
          value={form.phone || ""}
          onChange={handleChange}
          placeholder="Số điện thoại"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="email"
          value={form.email || ""}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="totalPoints"
          type="number"
          min={0}
          value={form.totalPoints}
          onChange={handleChange}
          placeholder="Điểm tích lũy"
          className="w-full border px-3 py-2 rounded"
          required
        />
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Banned">Banned</option>
        </select>
        <textarea
          name="note"
          value={form.note || ""}
          onChange={handleChange}
          placeholder="Ghi chú"
          className="w-full border px-3 py-2 rounded"
        />
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
            Lưu
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditCustomerModal;
