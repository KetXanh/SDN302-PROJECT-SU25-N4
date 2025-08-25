import React, { useEffect, useState } from "react";
import { getDiscounts, deleteDiscount } from "../../services/discountService";
import { Plus, Trash2, Edit } from "lucide-react";
import AddDiscountModal from "./AddDiscountModal";

const DiscountList = () => {
  const [discounts, setDiscounts] = useState([]);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const res = await getDiscounts();
      setDiscounts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa mã này?")) {
      try {
        await deleteDiscount(id);
        fetchDiscounts();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mã giảm giá</h1>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          <Plus className="w-4 h-4" /> Thêm
        </button>
      </div>
      <table className="w-full text-left bg-white rounded-xl shadow overflow-hidden">
        <thead className="bg-gray-100 text-sm text-gray-600 uppercase">
          <tr>
            <th className="p-3">STT</th>
            <th className="p-3">Code</th>
            <th className="p-3">Loại</th>
            <th className="p-3">Giá trị</th>
            <th className="p-3">Rank áp dụng</th>
            <th className="p-3">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {discounts.map((d, idx) => (
            <tr key={d._id} className="border-b last:border-0 hover:bg-gray-50">
              <td className="p-3">{idx + 1}</td>
              <td className="p-3">{d.code}</td>
              <td className="p-3">{d.type}</td>
              <td className="p-3">
                {d.value}
                {d.type === "percent" ? "%" : "đ"}
              </td>
              <td className="p-3">{d.customerRank}</td>
              <td className="p-3 flex gap-2">
                <button
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                  onClick={() => handleDelete(d._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AddDiscountModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={fetchDiscounts}
      />
    </div>
  );
};

export default DiscountList;
