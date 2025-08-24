// src/utils/api/authorAPI.js
import axios from 'axios';
import AuthAPI from '../AuthAPI';

// Create an Axios instance for authenticated requests
const authorAPI = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true 
});

// Add a request interceptor to include the token in the headers
authorAPI.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken'); // Use the key name as 'accessToken'
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Add a response interceptor to handle errors globally
authorAPI.interceptors.response.use(response => {
    return response;
}, async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401) {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            const data = await AuthAPI.refreshToken(refreshToken);
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            return authorAPI(originalRequest);
        } catch (error) {
            console.log("Error refreshing token:", error);
            return Promise.reject(error);
        }
    }
    return Promise.reject(error);
});

export default authorAPI;
