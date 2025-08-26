import React from "react";

const ConfirmModal = ({ open, onClose, onConfirm, message, type = "default" }) => {
  if (!open) return null;

  // type: "ban" | "active" | "default"
  const confirmBtnClass =
    type === "ban"
      ? "bg-red-600 hover:bg-red-700 text-white"
      : "bg-blue-600 hover:bg-blue-700 text-white";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Xác nhận</h3>
        <p className="mb-6 text-gray-700">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className={`px-4 py-2 rounded ${confirmBtnClass}`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;