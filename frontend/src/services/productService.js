import axios from "axios";

const API_URL = "http://localhost:3000/api/product"; 

export const getProducts = () => axios.get(API_URL);
export const getProductById = (id) => axios.get(`${API_URL}/${id}`);
export const createProduct = (data) => axios.post(API_URL, data);
export const updateProduct = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteProduct = (id) => axios.delete(`${API_URL}/${id}`);

export const getProductsCus = async (
  q = "",
  category = "",
  status = "Available",
  page = 1,
  limit = 50
) => {
  // helper build params
  const params = {
    ...(q ? { q } : {}),
    ...(category ? { category } : {}),
    ...(status ? { status } : {}),
    page,
    limit,
  };

  let res;
  try {
    // thử endpoint chuẩn bạn mong muốn
    res = await axios.get(API_URL, { params });
  } catch (e) {
    // fallback nếu backend hiện chỉ có /api/products
    if (e?.response?.status === 404) {
      res = await axios.get("http://localhost:3000/api/products", { params });
    } else {
      throw e;
    }
  }

  const payload = res.data;

  // HỖ TRỢ 3 KIỂU TRẢ VỀ:
  // 1) mảng thuần: [...]
  // 2) { data: [...] }
  // 3) { products: [...], totalProducts, totalPages, ... }  <-- của bạn hiện tại
  let list = [];
  if (Array.isArray(payload)) {
    list = payload;
  } else if (Array.isArray(payload?.data)) {
    list = payload.data;
  } else if (Array.isArray(payload?.products)) {
    list = payload.products;
  }

  const meta =
    Array.isArray(payload)
      ? { page, limit, total: list.length, totalPages: 1 }
      : payload?.meta ?? {
          page: payload?.currentPage ?? page,
          limit,
          total: payload?.totalProducts ?? list.length,
          totalPages: payload?.totalPages ?? 1,
        };

  return { data: list, meta };
};

export const getProductByIdCus = (id) => axios.get(`${API_URL}/${id}`);
