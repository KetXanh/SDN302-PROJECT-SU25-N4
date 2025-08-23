import React from "react";
import { Search } from "lucide-react";
function Menu() {
  const items = [
    {
      name: "Phở Bò Tái",
      price: "75.000đ",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9M7x7p11O6zgcoFD1LjL64g21jhOgRo4reQ&s",
    },
    {
      name: "Gỏi Cuốn Tôm",
      price: "45.000đ",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTT2tdDkEtW1NZt86ptwoaaP4QkmWRiSSQQw&s",
    },
    {
      name: "Cà Phê Sữa Đá",
      price: "35.000đ",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg0VUHE3-BTzLNd-Fyakq4KZMXEPueBooXOQ&s",
    },
  ];

  return (
    <div style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
      <div style={{ margin: "5px 15px 15px 0px", textAlign: "left" }}>
        <input
          type="text"
          placeholder="Tìm kiếm món ăn..."
          style={{
            width: "100%",
            padding: "15px 15px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "14px",
          }}
        />
      </div>
      {/* Tabs */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <button
          style={{
            backgroundColor: "#22c55e",
            color: "white",
            padding: "10px 20px",
            borderRadius: "9999px",
            border: "none",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Tất cả
        </button>
        <button
          style={{
            color: "#6b7280",
            padding: "10px 20px",
            borderRadius: "9999px",
            border: "none",
            background: "transparent",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          Món chính
        </button>
        <button
          style={{
            color: "#6b7280",
            padding: "10px 20px",
            borderRadius: "9999px",
            border: "none",
            background: "transparent",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          Đồ uống
        </button>
        <button
          style={{
            color: "#6b7280",
            padding: "10px 20px",
            borderRadius: "9999px",
            border: "none",
            background: "transparent",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          Tráng miệng
        </button>
      </div>

      {/* Items */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "20px",
        }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "white",
              padding: "12px",
              borderRadius: "16px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <img
              src={item.image}
              alt={item.name}
              style={{
                width: "100%",
                height: "160px",
                objectFit: "cover",
                borderRadius: "12px",
              }}
            />
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "600",
                marginTop: "10px",
                marginBottom: "4px",
              }}
            >
              {item.name}
            </h3>
            <p style={{ color: "#22c55e", fontWeight: "700" }}>{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;
