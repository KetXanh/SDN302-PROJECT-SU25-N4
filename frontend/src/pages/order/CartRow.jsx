import React from "react";
import { FiTrash2 } from "react-icons/fi";

const currency = (n) =>
  (Number(n) || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const CartRow = ({ item = {}, onRemove, onInc, onDec, showRemove = true }) => {
  const { productId = "", name = "", price = 0, quantity = 0 } = item || {};
  const lineTotal = (Number(price) || 0) * (Number(quantity) || 0);
  if (!productId && !name) return null;

  const decOne = () => {
    if (quantity <= 1) onRemove?.(productId);
    else onDec?.(productId);
  };

  const incOne = () => onInc?.(productId);

  return (
    <div className="flex items-center justify-between py-2">
      {/* Thông tin món */}
      <div className="flex-1">
        <div className="font-medium whitespace-normal break-words">{name}</div>
        <div className="text-xs text-gray-500">{currency(price)}</div>
      </div>

      {/* Điều khiển số lượng */}
      {showRemove && (
        <div className="flex items-center gap-2 mx-2">
          <button
            onClick={decOne}
            className="w-7 h-7 rounded border text-sm hover:bg-gray-50"
            title="Giảm 1"
          >
            −
          </button>
          <div className="min-w-[24px] text-center">{quantity}</div>
          <button
            onClick={incOne}
            className="w-7 h-7 rounded border text-sm hover:bg-gray-50"
            title="Thêm 1"
          >
            +
          </button>
        </div>
      )}

      {/* Thành tiền + Xoá */}
      <div className="flex items-center gap-2 ml-2">
        <div className="text-sm font-medium w-[90px] text-right">
          {currency(lineTotal)}
        </div>
        {showRemove && (
          <button
            onClick={() => onRemove?.(productId)}
            className="text-red-500 hover:text-red-700"
            title="Xóa khỏi giỏ"
          >
            <FiTrash2 size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default CartRow;
