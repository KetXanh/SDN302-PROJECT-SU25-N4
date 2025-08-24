import React from "react";

function OrderSummary() {
  const order = {
    items: [
      { name: "Phở Bò Tái", quantity: 2, price: "75.000đ", total: "150.000đ" },
      {
        name: "Cà Phê Sữa Đá",
        quantity: 1,
        price: "35.000đ",
        total: "35.000đ",
      },
    ],
    subtotal: "185.000đ",
    tax: "18.500đ",
    total: "203.500đ",
  };

  return (
    <div
      style={{
        width: "35%",
        padding: "24px",
        backgroundColor: "white",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
      }}
    >
      <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "4px" }}>
        Order #2508
      </h2>
      <p style={{ color: "#6b7280", marginBottom: "20px" }}>
        21/08/2025 - 14:30
      </p>

      {/* Items */}
      {order.items.map((item, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "8px 0",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <span>
            {item.name}{" "}
            <span style={{ color: "#6b7280" }}>x{item.quantity}</span>
          </span>
          <span>{item.total}</span>
        </div>
      ))}

      {/* Subtotal */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "8px 0",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <span>Tạm tính</span>
        <span>{order.subtotal}</span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "8px 0",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <span>VAT (10%)</span>
        <span>{order.tax}</span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "8px 0",
          fontWeight: "700",
        }}
      >
        <span>Tổng cộng</span>
        <span style={{ color: "#22c55e" }}>{order.total}</span>
      </div>

      {/* Buttons */}
      <button
        style={{
          width: "100%",
          backgroundColor: "#22c55e",
          color: "white",
          padding: "12px",
          borderRadius: "8px",
          border: "none",
          marginTop: "16px",
          cursor: "pointer",
          fontWeight: "600",
          fontSize: "16px",
        }}
      >
        Xác nhận Order
      </button>
      <button
        style={{
          width: "100%",
          border: "1px solid #22c55e",
          color: "#22c55e",
          padding: "12px",
          borderRadius: "8px",
          marginTop: "10px",
          cursor: "pointer",
          background: "transparent",
          fontWeight: "600",
          fontSize: "16px",
        }}
      >
        In Hóa Đơn
      </button>
    </div>
  );
}

export default OrderSummary;
