import React, { useState } from "react";
import { updateOrder } from "../../services/orderService";

const EditOrderModal = ({ order, onClose, onUpdated }) => {
  const [status, setStatus] = useState(order?.status || "confirmed");
  const [isPaid, setIsPaid] = useState(order?.isPaid || false);
  const [paymentMethod, setPaymentMethod] = useState(
    order?.paymentMethod || "cash"
  );
  const [note, setNote] = useState(order?.note || "");

  if (!order) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateOrder(order._id, { status, isPaid, paymentMethod, note });
      onUpdated(); // gọi fetch lại order list
      onClose();
    } catch (err) {
      console.error("Lỗi cập nhật đơn hàng:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-11/12 max-w-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Chỉnh sửa đơn hàng</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block mb-1">Trạng thái:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border rounded px-2 py-1 w-full"
            >
              <option value="confirmed">confirmed</option>
              <option value="completed">completed</option>
              <option value="cancelled">cancelled</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Đã thanh toán:</label>
            <input
              type="checkbox"
              checked={isPaid}
              onChange={(e) => setIsPaid(e.target.checked)}
            />
          </div>
          <div>
            <label className="block mb-1">Phương thức thanh toán:</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="border rounded px-2 py-1 w-full"
            >
              <option value="cash">cash</option>
              <option value="bank">bank</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Ghi chú:</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOrderModal;
