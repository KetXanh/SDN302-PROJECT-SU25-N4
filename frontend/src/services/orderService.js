import axios from "axios";
import authorAPI from "../api/base/authorAPI";
const API_URL = "http://localhost:3000/api/order";

export const getOrders = () => authorAPI.get(API_URL);
export const getOrderById = (id) => authorAPI.get(`${API_URL}/${id}`);
export const createOrder = (data) => authorAPI.post(API_URL, data);
export const updateOrder = (id, data) => authorAPI.put(`${API_URL}/${id}`, data);
export const deleteOrder = (id) => authorAPI.delete(`${API_URL}/${id}`);

// KH public tạo order
export const createOrderPublic = (data) => authorAPI.post(`${API_URL}/public`, data);

// Nhân viên xác nhận (gán employeeId)
export const assignOrderEmployee = (id, employeeId, status) =>
  authorAPI.put(`${API_URL}/${id}/assign`, { employeeId, ...(status ? { status } : {}) });

