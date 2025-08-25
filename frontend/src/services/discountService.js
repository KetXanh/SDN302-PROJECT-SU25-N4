import axios from "axios";

const API_URL = "http://localhost:3000/api/discount";

export const getDiscounts = () => axios.get(API_URL);
export const getDiscountById = (id) => axios.get(`${API_URL}/${id}`);
export const createDiscount = (data) => axios.post(API_URL, data);
export const updateDiscount = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteDiscount = (id) => axios.delete(`${API_URL}/${id}`);
