import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cart from "./Cart";
import { createOrderPublic } from "../../services/orderService";
import { computeDiscountAmount } from "./Cart";

const currency = (n) =>
  (Number(n) || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });
const VAT_RATE = 0.1;

export default function Checkout() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const initialItems = Array.isArray(state?.items) ? state.items : [];
  const [items, setItems] = useState(initialItems);
  const [discountSnap, setDiscountSnap] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Nếu cần cho phép sửa số lượng ngay tại trang này:
  const mapById = useMemo(() => {
    const acc = {};
    for (const it of items) acc[it.productId] = it;
    return acc;
  }, [items]);

  const setItemsFromMap = (map) => setItems(Object.values(map).filter(Boolean));

  const onInc = (pid) => {
    const clone = { ...mapById };
    if (clone[pid]) clone[pid] = { ...clone[pid], quantity: clone[pid].quantity + 1 };
    setItemsFromMap(clone);
  };
  const onDec = (pid) => {
    const clone = { ...mapById };
    if (clone[pid]) {
      const q = clone[pid].quantity - 1;
      if (q <= 0) delete clone[pid];
      else clone[pid] = { ...clone[pid], quantity: q };
    }
    setItemsFromMap(clone);
  };
  const onRemove = (pid) => {
    const clone = { ...mapById };
    delete clone[pid];
    setItemsFromMap(clone);
  };

  const subtotal = useMemo(
    () =>
      items.reduce(
        (s, it) => s + (Number(it.price) || 0) * (Number(it.quantity) || 0),
        0
      ),
    [items]
  );
  const discountAmount = useMemo(
    () => computeDiscountAmount(discountSnap, subtotal),
    [discountSnap, subtotal]
  );
  const vat = useMemo(() => Math.round(subtotal * VAT_RATE), [subtotal]);
  const grandTotal = useMemo(
    () => Math.max(0, subtotal - discountAmount + vat),
    [subtotal, discountAmount, vat]
  );

  const handleCreateOrder = async () => {
    if (items.length === 0) {
      alert("Giỏ hàng đang trống");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        items: items.map((i) => ({
          productId: i.productId,
          price: i.price,
          quantity: i.quantity,
        })),
        subtotal,
        discount: discountSnap || undefined,
        finalTotal: grandTotal,
        paymentMethod: "cash",
        isPaid: true,
      };
      await createOrderPublic(payload);
      alert("Tạo đơn hàng thành công!");
      navigate("/pos"); 
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Tạo đơn hàng thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 lg:p-6 space-y-6">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Giỏ hàng chi tiết (có thể thay bằng bảng nếu muốn) */}
        <div className="lg:col-span-2 rounded-2xl border bg-white p-4 shadow-sm">
          <Cart
            items={items}
            subtotal={subtotal}
            onInc={onInc}
            onDec={onDec}
            onRemove={onRemove}
            discountSnap={discountSnap}
            onDiscountChange={setDiscountSnap}
            onConfirm={handleCreateOrder}
            submitting={submitting}
            showDiscount={true} 
            showPrint={true}
          />
        </div>

        {/* Tổng kết thanh toán */}
        <div className="lg:col-span-1 rounded-2xl border bg-white p-4 shadow-sm space-y-2">
          <div className="text-lg font-semibold mb-3">Chi tiết thanh toán</div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tạm tính</span>
            <span className="font-medium">{currency(subtotal)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Giảm giá</span>
              <span className="font-medium text-emerald-700">− {currency(discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">VAT (10%)</span>
            <span className="font-medium">{currency(vat)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold border-t pt-2">
            <span>Tổng cộng</span>
            <span>{currency(grandTotal)}</span>
          </div>

          <button
            onClick={handleCreateOrder}
            className="mt-4 w-full px-4 py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-60"
            disabled={submitting || items.length === 0}
          >
            {submitting ? "Đang tạo đơn..." : "Tạo đơn hàng"}
          </button>
        </div>
      </div>
    </div>
  );
}
