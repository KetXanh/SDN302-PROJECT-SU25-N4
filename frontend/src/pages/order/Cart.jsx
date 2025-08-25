// src/components/order/Cart.jsx
import React, { forwardRef, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import CartRow from "./CartRow";
import { getDiscountByCode } from "../../services/discountService";

const currency = (n) =>
  (Number(n) || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const VAT_RATE = 0.1;

export function computeDiscountAmount(snapshot, subtotal) {
  if (!snapshot || !snapshot.type || !snapshot.value) return 0;
  const { type, value, maxAmount = 0, minOrderValue = 0 } = snapshot;
  const sub = Number(subtotal) || 0;
  if ((Number(minOrderValue) || 0) > sub) return 0;

  let discount = 0;
  if (type === "percent") discount = Math.round(sub * (Number(value) / 100));
  else if (type === "fixed") discount = Number(value) || 0;

  if (maxAmount > 0) discount = Math.min(discount, Number(maxAmount) || 0);
  return Math.max(0, Math.min(discount, sub));
}

/** -------- NEW: Printable Receipt ---------- */
const PrintableReceipt = forwardRef(function PrintableReceipt(
  { items = [], subtotal = 0, discountSnap = null },
  ref
) {
  const discountAmount = computeDiscountAmount(discountSnap, subtotal);
  const vat = Math.round(subtotal * VAT_RATE);
  const grandTotal = Math.max(0, subtotal - discountAmount + vat);
  const now = new Date();
  const dateStr = now.toLocaleDateString("vi-VN");
  const timeStr = now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

  return (
    <div ref={ref} className="print-only hidden">
      <div style={{ fontFamily: "ui-sans-serif, system-ui", width: 320 }}>
        <h2 style={{ textAlign: "center", margin: 0 }}>HÓA ĐƠN BÁN HÀNG</h2>
        <div style={{ textAlign: "center", fontSize: 12, marginBottom: 8 }}>
          {dateStr} – {timeStr}
        </div>
        <hr />
        <div style={{ fontSize: 12 }}>
          {items.map((it, idx) => (
            <div key={it?.productId || idx} style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ marginRight: 8 }}>
                <div style={{ fontWeight: 600 }}>{it?.name || "Sản phẩm"}</div>
                <div style={{ opacity: 0.7 }}>
                  {it?.quantity} × {currency(it?.price)}
                </div>
              </div>
              <div>{currency((Number(it?.price) || 0) * (Number(it?.quantity) || 0))}</div>
            </div>
          ))}
        </div>
        <hr />
        <div style={{ fontSize: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Tạm tính</span>
            <strong>{currency(subtotal)}</strong>
          </div>
          {discountAmount > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Giảm giá{discountSnap?.code ? ` (${discountSnap.code})` : ""}</span>
              <strong>- {currency(discountAmount)}</strong>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>VAT (10%)</span>
            <strong>{currency(vat)}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontWeight: 700 }}>Tổng cộng</span>
            <span style={{ fontWeight: 700 }}>{currency(grandTotal)}</span>
          </div>
        </div>
        <hr />
        <div style={{ textAlign: "center", fontSize: 12 }}>Cảm ơn quý khách!</div>
      </div>
    </div>
  );
});
/** -------- END Printable Receipt ---------- */

const Cart = ({
  items = [],
  subtotal = 0,
  onRemove,
  onInc,
  onDec,
  discountSnap,
  onDiscountChange,
  onConfirm,
  submitting = false,
  showDiscount = false, // ở Checkout = true
  showPrint = false,    // NEW: chỉ ở Checkout = true
}) => {
  const safeItems = Array.isArray(items) ? items.filter(Boolean) : [];
  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `HoaDon_${new Date().toISOString().slice(0,19).replace(/[:T]/g,"-")}`,
    removeAfterPrint: true,
    pageStyle: `
      @page { size: auto; margin: 10mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; }
        .print-only { display: block !important; }
        .no-print { display: none !important; }
      }
    `,
  });

  // Apply coupon
  const [code, setCode] = useState("");
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState("");
  const snap = discountSnap || null;

  const applyCode = async () => {
    setApplyError("");
    const codeUpper = code.trim().toUpperCase();
    if (!codeUpper) {
      setApplyError("Vui lòng nhập mã giảm giá");
      return;
    }
    setApplying(true);
    try {
      const resp = await getDiscountByCode(codeUpper);
      const d = resp?.data ?? resp;
      if (!d) {
        setApplyError("Mã không tồn tại hoặc không khả dụng");
        onDiscountChange?.(null);
        return;
      }
      const now = Date.now();
      if (
        d.isActive === false ||
        (d.startDate && new Date(d.startDate).getTime() > now) ||
        (d.endDate && new Date(d.endDate).getTime() < now) ||
        (d.usageLimit && d.usedCount && d.usedCount >= d.usageLimit)
      ) {
        setApplyError("Mã hiện không thể áp dụng");
        onDiscountChange?.(null);
        return;
      }

      const newSnap = {
        discountId: d._id,
        code: d.code?.toUpperCase() || codeUpper,
        type: d.type,
        value: d.value,
        maxAmount: d.maxAmount || 0,
        minOrderValue: d.minOrderValue || 0,
        amountApplied: 0,
      };
      newSnap.amountApplied = computeDiscountAmount(newSnap, subtotal);

      if (newSnap.amountApplied <= 0) {
        setApplyError("Đơn hàng chưa đủ điều kiện áp dụng");
        onDiscountChange?.(null);
      } else {
        onDiscountChange?.(newSnap);
      }
    } catch (e) {
      console.error(e);
      setApplyError(e?.response?.data?.message || "Áp dụng mã thất bại");
      onDiscountChange?.(null);
    } finally {
      setApplying(false);
    }
  };

  const clearCode = () => {
    setApplyError("");
    setCode("");
    onDiscountChange?.(null);
  };

  const now = new Date();
  const dateStr = now.toLocaleDateString("vi-VN");
  const timeStr = now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-4">
      {/* --------- Printable area (hidden on screen) --------- */}
      <PrintableReceipt ref={printRef} items={safeItems} subtotal={subtotal} discountSnap={snap} />
      {/* ----------------------------------------------------- */}

      {/* Hiển thị trên màn hình */}
      <div className="space-y-4">
        <div>
          <div className="text-lg font-semibold">Order #Tạm</div>
          <div className="text-sm text-gray-500">
            {dateStr} – {timeStr}
          </div>
        </div>

        <div className="divide-y">
          {safeItems.length === 0 ? (
            <div className="py-10 text-center text-gray-500">Chưa có sản phẩm</div>
          ) : (
            safeItems.map((it) => (
              <CartRow
                key={it?.productId || Math.random()}
                item={it}
                onRemove={onRemove}
                onInc={onInc}
                onDec={onDec}
                showRemove={true}
              />
            ))
          )}
        </div>

        {/* KHU MÃ GIẢM GIÁ — chỉ hiện khi showDiscount = true */}
        {showDiscount && (
          <div>
            <div className="flex gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Nhập mã giảm giá"
                className="flex-1 border rounded-lg px-3 py-2"
                disabled={!!snap}
              />
              {snap ? (
                <button
                  onClick={clearCode}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  Hủy mã
                </button>
              ) : (
                <button
                  onClick={applyCode}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                  disabled={applying}
                >
                  {applying ? "Đang áp dụng..." : "Áp dụng"}
                </button>
              )}
            </div>
            {applyError && <div className="text-red-600 text-sm mt-1">{applyError}</div>}
          </div>
        )}
      </div>

      {/* Nút */}
      <div className="pt-2 flex flex-col gap-2">
        <button
          onClick={onConfirm}
          className="w-full px-4 py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-60"
          disabled={submitting || safeItems.length === 0}
        >
          {submitting ? "Đang xử lý..." : showDiscount ? "Tạo đơn hàng" : "Xác nhận Order"}
        </button>

        {/* CHỈ hiển thị ở Checkout khi showPrint = true */}
        {showPrint && (
          <button
            type="button"
            className="w-full px-4 py-3 rounded-lg bg-white border hover:bg-gray-50"
            onClick={handlePrint}
            disabled={safeItems.length === 0}
          >
            In Hóa Đơn
          </button>
        )}
      </div>
    </div>
  );
};

export default Cart;
