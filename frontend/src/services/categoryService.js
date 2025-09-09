const API_URL = "http://localhost:3000/api/categories";
import authorApi from "../api/base/authorApi";
export const getCategories = () => authorApi.get(API_URL);
export const getCategoryById = (id) => authorApi.get(`${API_URL}/${id}`);
export const createCategory = (data) => authorApi.post(API_URL, data);
export const updateCategory = (id, data) => authorApi.put(`${API_URL}/${id}`, data);
export const deleteCategory = (id) => authorApi.delete(`${API_URL}/${id}`);

export const searchCategories = (status = "Active") =>
  authorApi.get(API_URL, { params: { status } });
