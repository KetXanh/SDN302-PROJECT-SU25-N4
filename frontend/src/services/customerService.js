const API_URL = "http://localhost:3000/api/customer";
import authorApi from "../api/base/authorApi";
export const getCustomers = () => authorApi.get(API_URL);
export const getCustomerById = (id) => authorApi.get(`${API_URL}/${id}`);
export const createCustomer = (data) => authorApi.post(API_URL, data);
export const updateCustomer = (id, data) => authorApi.put(`${API_URL}/${id}`, data);
export const deleteCustomer = (id) => authorApi.delete(`${API_URL}/${id}`);
