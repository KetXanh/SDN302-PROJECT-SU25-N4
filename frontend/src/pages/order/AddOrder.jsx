// src/components/order/AddOrder.jsx
import React, { useMemo, useState } from "react";
import ProductGrid from "./ProductGrid";
import Cart from "./Cart";
import { useNavigate } from "react-router-dom";

const AddOrder = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({});
  const [submitting, setSubmitting] = useState(false); 

  const cartItems = useMemo(() => Object.values(cart).filter(Boolean), [cart]);
  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (s, it) => s + (Number(it.price) || 0) * (Number(it.quantity) || 0),
        0
      ),
    [cartItems]
  );

  const addToCart = (p) =>
    setCart((prev) => ({
      ...prev,
      [p._id]: {
        productId: p._id,
        name: p.name || "Sản phẩm",
        price: Number(p.price) || 0,
        quantity: (prev[p._id]?.quantity || 0) + 1,
      },
    }));

  const dec = (pid) =>
    setCart((prev) => {
      const q = (prev[pid]?.quantity || 0) - 1;
      if (q <= 0) {
        const { [pid]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [pid]: { ...prev[pid], quantity: q } };
    });

  const inc = (pid) =>
    setCart((prev) => ({
      ...prev,
      [pid]: { ...prev[pid], quantity: prev[pid].quantity + 1 },
    }));

  const removeItem = (pid) =>
    setCart((prev) => {
      const { [pid]: _, ...rest } = prev;
      return rest;
    });

  const goToCheckout = () => {
    if (cartItems.length === 0) {
      alert("Giỏ hàng đang trống");
      return;
    }
    navigate("/checkout", {
      state: {
        items: cartItems,
        subtotal,
      },
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 lg:p-6">
      <div className="lg:col-span-2">
        <ProductGrid onAdd={addToCart} />
      </div>

      <div className="lg:col-span-1">
        <div className="rounded-2xl border bg-white p-4 shadow-sm sticky top-4">
          <Cart
            items={cartItems}
            subtotal={subtotal}
            onInc={inc}
            onDec={dec}
            onRemove={removeItem}
            showDiscount={false}
            onConfirm={goToCheckout}
            submitting={submitting}
            showPrint={false}
          />
        </div>
      </div>
    </div>
  );
};

export default AddOrder;
