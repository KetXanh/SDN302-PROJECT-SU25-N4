// src/api/authAPI.js
import unauthorApi from './base/unauthorAPI';

const authAPI = {
    // Login
    login: (credentials) => unauthorApi.post('/auth/login', credentials).then(response => response.data),

    // Register
    register: (form) => unauthorApi.post('/auth/register', form).then(response => response.data),

    // Refresh token
    refreshToken: async (refreshToken) => unauthorApi.post('/auth/refresh-token', { refreshToken }).then(response => response.data),

    // Forgot password
    forgotPassword: (email) => unauthorApi.post('/auth/forgot-password', { email }).then(response => response.data),

    // Verify OTP
    verifyOtp: (email, otp) => unauthorApi.post('/auth/verify-otp', { email, otp }).then(response => response.data),

    // Reset password
    resetPassword: (data) => unauthorApi.post('/auth/reset-password', data).then(response => response.data),

    //Logout
    logout: () => unauthorApi.post('/auth/logout').then(response => response.data)

};

export default authAPI;
