import React from "react";

const currency = (n) =>
  (Number(n) || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const ProductCard = ({ product, onAdd }) => {
  const { name, price, image, status } = product || {};
  const disabled = status === "Unavailable";

  return (
    <button
      onClick={onAdd}
      disabled={disabled}
      className={`w-full text-left rounded-2xl border p-3 shadow-sm hover:shadow transition ${
        disabled ? "opacity-60 cursor-not-allowed" : "bg-white"
      }`}
      title={disabled ? "Sản phẩm tạm hết" : "Thêm vào giỏ"}
    >
      <div className="aspect-square w-full overflow-hidden rounded-xl mb-3 bg-gray-50">
        {image?.url ? (
          <img src={image.url} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </div>
      <div className="font-medium whitespace-normal break-words">{name}</div>
      <div className="text-emerald-600 font-semibold">{currency(price)}</div>
    </button>
  );
};

export default ProductCard;
