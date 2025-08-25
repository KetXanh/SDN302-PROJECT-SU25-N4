import React, { useEffect, useMemo, useState } from "react";
import { getProductsCus } from "../../services/productService";   
import { getCategories } from "../../services/categoryService";  
import ProductCard from "./ProductCard";

const ProductGrid = ({ onAdd }) => {
  const [q, setQ] = useState("");
  const [active, setActive] = useState("all");      
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Load danh mục (tabs động)
  useEffect(() => {
    let mounted = true;
    getCategories("Active")
      .then(({ data }) => mounted && setCategories(Array.isArray(data) ? data : []))
      .catch(() => mounted && setCategories([]));
    return () => (mounted = false);
  }, []);

  // Load sản phẩm (search q)
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {          
       const { data } = await getProductsCus(q);
        if (mounted) setProducts(data || []);
      } catch {
        if (mounted) setProducts([]);
      } finally {
        setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [q]);

  // Lọc theo categoryId đã chọn (cover cả string hoặc object {_id})
  const filtered = useMemo(() => {
    if (active === "all") return products;
    return products.filter((p) => {
      const cat = p.categoryId;
      const catId = typeof cat === "string" ? cat : cat?._id;
      return catId === active;
    });
  }, [products, active]);

  return (
    <>
      {/* Search */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative w-full">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm kiếm món ăn..."
            className="w-full border rounded-2xl px-4 py-2 pl-10"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔎</span>
        </div>
      </div>

      {/* Tabs từ Category */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={() => setActive("all")}
          className={`px-3 py-1.5 rounded-full border ${
            active === "all" ? "bg-emerald-600 text-white border-emerald-600" : "bg-white"
          }`}
        >
          Tất cả
        </button>
        {categories.map((c) => (
          <button
            key={c._id}
            onClick={() => setActive(c._id)}
            className={`px-3 py-1.5 rounded-full border ${
              active === c._id ? "bg-emerald-600 text-white border-emerald-600" : "bg-white"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Grid sản phẩm */}
      {loading ? (
        <div className="py-10 text-center text-gray-500">Đang tải sản phẩm…</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <ProductCard key={p._id} product={p} onAdd={() => onAdd(p)} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-12">
              Không có sản phẩm phù hợp
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ProductGrid;
