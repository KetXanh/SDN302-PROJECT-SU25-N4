
const API_URL = "http://localhost:3000/api/discount";
import authorApi from "../api/base/authorApi";
export const getDiscounts = () => authorApi.get(API_URL);
export const getDiscountById = (id) => authorApi.get(`${API_URL}/${id}`);
export const createDiscount = (data) => authorApi.post(API_URL, data);
export const updateDiscount = (id, data) => authorApi.put(`${API_URL}/${id}`, data);
export const deleteDiscount = (id) => authorApi.delete(`${API_URL}/${id}`);

export const getDiscountByCode = async (code) => {
  try {
    const res = await authorApi.get(`${API_URL}/code/${code}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching discount by code", err);
    return null;
  }
};