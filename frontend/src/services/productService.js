import axios from "axios";

const API_URL = "http://localhost:3000/api/product"; 

export const getProducts = () => axios.get(API_URL); // lấy tất cả sản phẩm
export const getProductById = (id) => axios.get(`${API_URL}/${id}`);
export const createProduct = (data) => axios.post(API_URL, data);
export const updateProduct = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteProduct = (id) => axios.delete(`${API_URL}/${id}`);
