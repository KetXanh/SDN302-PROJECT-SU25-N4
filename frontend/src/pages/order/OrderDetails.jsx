import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { ArrowLeft } from "lucide-react";
import { getOrderById } from "../../services/orderService";

Modal.setAppElement("#root");

const OrderDetail = ({ isOpen, onClose, orderId }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && orderId) {
      const fetchOrder = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await getOrderById(orderId);
          setOrder(res.data);
        } catch (err) {
          setError(
            err.response?.data?.message || "Không thể tải chi tiết đơn hàng."
          );
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [isOpen, orderId]);

  const formatCurrency = (value) =>
    value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const getStatusStyles = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: "600px",
          maxHeight: "80vh",
          overflowY: "auto",
          padding: "20px",
          borderRadius: "8px",
        },
        overlay: { backgroundColor: "rgba(0,0,0,0.5)" },
      }}
      contentLabel="Chi tiết đơn hàng"
    >
      {loading ? (
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-gray-600 mt-2">Đang tải...</p>
        </div>
      ) : error ? (
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md"
          >
            Đóng
          </button>
        </div>
      ) : order ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Đơn hàng #{order._id}</h2>
            <button onClick={onClose}>
              <ArrowLeft className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-3">
            <p>
              <span className="font-semibold">Nhân viên: </span>
              {order.employeeId?.fullname || "N/A"}
            </p>
            <p>
              <span className="font-semibold">SĐT khách: </span>
              {order.customerPhone || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Trạng thái: </span>
              <span
                className={`px-2 py-1 rounded-full text-xs ${getStatusStyles(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </p>
            <p>
              <span className="font-semibold">Thanh toán: </span>
              {order.isPaid
                ? `Đã thanh toán (${new Date(order.paidAt).toLocaleString()})`
                : "Chưa thanh toán"}
            </p>
            <p>
              <span className="font-semibold">Phương thức thanh toán: </span>
              {order.isPaid
                ? order.paymentMethod === "cash"
                  ? "Tiền mặt"
                  : order.paymentMethod === "bank"
                  ? "Chuyển khoản"
                  : order.paymentMethod
                : "Chưa thanh toán"}
            </p>

            <p>
              <span className="font-semibold">Ghi chú: </span>
              {order.note || "N/A"}
            </p>

            <div>
              <h3 className="font-semibold">Sản phẩm</h3>
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 border-b py-2"
                >
                  <img
                    src={
                      item.productId?.image || "https://via.placeholder.com/64"
                    }
                    alt={item.productId?.name || "Sản phẩm"}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                  <div>
                    <p>{item.productId?.name || "N/A"}</p>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(item.price)} x {item.quantity} ={" "}
                      {formatCurrency(item.lineTotal)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t pt-2">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discount && (
                <div className="flex justify-between">
                  <span>
                    Giảm giá ({order.discount.code}):{" "}
                    {order.discount.type === "percent"
                      ? `${order.discount.value}%`
                      : formatCurrency(order.discount.value)}
                  </span>
                  <span>-{formatCurrency(order.discount.amountApplied)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold mt-2">
                <span>Tổng cộng:</span>
                <span>{formatCurrency(order.finalTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
  );
};

export default OrderDetail;
