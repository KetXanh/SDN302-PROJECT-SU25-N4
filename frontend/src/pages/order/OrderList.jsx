import React, { useEffect, useState } from "react";
import { getOrders, deleteOrder } from "../../services/orderService";
import { Edit, Trash2, Eye } from "lucide-react";
import OrderDetail from "./OrderDetails";
import EditOrderModal from "./EditOrder";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getOrders();
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá đơn hàng này?")) {
      await deleteOrder(id);
      fetchOrders();
    }
  };

  const filteredOrders = Array.isArray(orders)
    ? orders.filter(
        (o) =>
          o.customerId?.name?.toLowerCase().includes(search.toLowerCase()) ||
          o.customerPhone?.includes(search) ||
          o.employeeId?.fullname?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Đơn hàng</h1>
        <input
          type="text"
          placeholder="Tìm kiếm đơn hàng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100 text-sm text-gray-600 uppercase">
              <th className="p-3">STT</th>
              <th className="p-3">Khách hàng</th>
              <th className="p-3">Nhân viên</th>
              <th className="p-3">Tổng tiền</th>
              <th className="p-3">Thanh toán</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, index) => (
                <tr
                  key={order._id}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">
                    {order.customerId?.name ||
                      order.customerPhone ||
                      "Khách lẻ"}
                  </td>
                  <td className="p-3">{order.employeeId?.fullname}</td>
                  <td className="p-3 font-semibold">
                    {order.finalTotal.toLocaleString()} ₫
                  </td>
                  <td className="p-3">
                    {order.isPaid ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                        Đã thanh toán
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                        Chưa thanh toán
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : order.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => setSelectedOrderId(order._id)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingOrder(order)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  Không có đơn hàng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {selectedOrderId && (
        <OrderDetail
          isOpen={!!selectedOrderId}
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
      {editingOrder && (
        <EditOrderModal
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onUpdated={fetchOrders}
        />
      )}
    </div>
  );
};

export default OrderList;
