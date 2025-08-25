import axios from "axios";

const API_URL = "http://localhost:3000/api/order";

export const getOrders = () => axios.get(API_URL);
export const getOrderById = (id) => axios.get(`${API_URL}/${id}`);
export const createOrder = (data) => axios.post(API_URL, data);
export const updateOrder = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteOrder = (id) => axios.delete(`${API_URL}/${id}`);

