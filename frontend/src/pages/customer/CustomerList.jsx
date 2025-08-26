import React, { useEffect, useState } from "react";
import { getCustomers, deleteCustomer ,exportCustomers} from "../../services/customerService";
import { Edit, Trash2, Plus, Download } from "lucide-react";
import AddCustomerModal from "./AddCustomer";
import EditCustomerModal from "./EditCustomer";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await getCustomers();
      setCustomers(res.data);
    } catch (err) {
      console.error("Error fetching customers", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
      try {
        await deleteCustomer(id);
        fetchCustomers();
      } catch (err) {
        console.error("Error deleting customer", err);
        alert("Xóa thất bại");
      }
    }
  };

  const openEdit = (id) => {
    setEditId(id);
    setEditOpen(true);
  };

  const filtered = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Khách hàng</h1>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue
            focus:ring-blue-300"
          />
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            <Plus className="w-4 h-4" /> Thêm
          </button>
          <button
            onClick={async () => {
              try {
                const res = await exportCustomers();
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "customers.xlsx"); // tên file tải về
                document.body.appendChild(link);
                link.click();
                link.remove();
              } catch (err) {
                console.error("Error exporting customers", err);
                alert("Xuất Excel thất bại!");
              }
            }}
            className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download className="w-4 h-4" /> Xuất Excel
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100 text-sm text-gray-600 uppercase">
              <th className="p-3">STT</th>
              <th className="p-3">Tên</th>
              <th className="p-3">SĐT</th>
              <th className="p-3">Email</th>
              <th className="p-3">Điểm tích lũy</th>
              <th className="p-3">Rank</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((c, idx) => (
                <tr
                  key={c._id}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3">{c.name || "N/A"}</td>
                  <td className="p-3">{c.phone || "N/A"}</td>
                  <td className="p-3">{c.email || "N/A"}</td>
                  <td className="p-3">{c.totalPoints}</td>
                  <td className="p-3">{c.rank}</td>
                  <td className="p-3">{c.status}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => openEdit(c._id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-4 text-center text-gray-500">
                  Không có khách hàng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <AddCustomerModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={fetchCustomers}
      />
      <EditCustomerModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        customerId={editId}
        onSuccess={fetchCustomers}
      />
    </div>
  );
};

export default CustomerList;
