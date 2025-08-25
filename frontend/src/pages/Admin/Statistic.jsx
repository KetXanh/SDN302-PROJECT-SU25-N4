import React, { useEffect, useState } from "react";
import { getOrders } from "../../services/orderService";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function formatCurrency(amount) {
  return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay() || 7;
  if (day !== 1) d.setHours(-24 * (day - 1));
  d.setHours(0, 0, 0, 0);
  return d;
}

const Statistic = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Revenue states
  const [yearRevenue, setYearRevenue] = useState(0);
  const [monthRevenue, setMonthRevenue] = useState(0);
  const [weekRevenue, setWeekRevenue] = useState(0);

  // Chart data
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const res = await getOrders();
        const ordersComplete = res.data?.filter((o) => o.status === "completed") || [];
        setOrders(ordersComplete || []);
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  useEffect(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const startOfWeek = getStartOfWeek(now);

    let yearSum = 0,
      monthSum = 0,
      weekSum = 0;

    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt || order.updatedAt || order.paidAt);
      const total = order.finalTotal || 0;

      if (orderDate.getFullYear() === currentYear) yearSum += total;
      if (
        orderDate.getFullYear() === currentYear &&
        orderDate.getMonth() === currentMonth
      )
        monthSum += total;
      if (orderDate >= startOfWeek) weekSum += total;
    });

    setYearRevenue(yearSum);
    setMonthRevenue(monthSum);
    setWeekRevenue(weekSum);

    // Chart: Revenue by month in current year
    const months = Array.from({ length: 12 }, (_, i) => i);
    const monthLabels = [
      "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
      "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ];
    const monthlyRevenue = months.map((m) =>
      orders
        .filter(
          (order) => {
            const orderDate = new Date(order.createdAt || order.updatedAt || order.paidAt);
            return (
              orderDate.getFullYear() === currentYear &&
              orderDate.getMonth() === m
            );
          }
        )
        .reduce((sum, order) => sum + (order.finalTotal || 0), 0)
    );

    setChartData({
      labels: monthLabels,
      datasets: [
        {
          label: "Doanh thu theo tháng",
          data: monthlyRevenue,
          backgroundColor: "rgba(59,130,246,0.7)",
        },
      ],
    });
  }, [orders]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Thống kê doanh thu</h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-700">💰</span>
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-gray-700">
                    {orders.length}
                  </span>{" "}
                  đơn hàng
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
            <span className="text-sm text-gray-600">Đang tải dữ liệu...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow h-36 flex flex-col justify-center">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Doanh thu tuần này</h2>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(weekRevenue)}
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow h-36 flex flex-col justify-center">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Doanh thu tháng này</h2>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(monthRevenue)}
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow h-36 flex flex-col justify-center">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Doanh thu năm nay</h2>
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(yearRevenue)}
                </div>
              </div>
            </div>
            {/* Chart */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Biểu đồ doanh thu theo tháng</h2>
              {chartData ? (
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                      title: { display: false },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: Math.ceil((Math.max(...chartData.datasets[0].data) * 1.2) / 6),
                          maxTicksLimit: 6,
                          callback: function (value) {
                            return formatCurrency(value);
                          },
                        },
                        max: Math.ceil(Math.max(...chartData.datasets[0].data) * 1.2),
                      },
                    },
                  }}
                  height={300} // Each milestone ~100px apart (6*100px)
                  style={{ maxHeight: "300px" }}
                />
              ) : (
                <div className="text-gray-500 text-center">Không có dữ liệu biểu đồ.</div>
              )}
            </div>
          </>
        )}

        {/* Orders Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mt-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã đơn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nhân viên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4">{order._id}</td>
                    <td className="px-6 py-4">{order.employeeId?.fullname || "N/A"}</td>
                    <td className="px-6 py-4">{order.customerId?.fullname || order.customerPhone || "Khách lẻ"}</td>
                    <td className="px-6 py-4 font-semibold text-blue-600">
                      {formatCurrency(order.finalTotal || 0)}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(order.createdAt || order.updatedAt || order.paidAt).toLocaleString("vi-VN")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                          }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      Không có đơn hàng nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistic;