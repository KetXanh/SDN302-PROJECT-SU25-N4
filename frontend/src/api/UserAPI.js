// src/api/userAPI.js
import authorApi from './base/authorAPI';

const USER_BASE = '/user';

const userAPI = {
    // Get all user
    getAll: () => authorApi.get(`${USER_BASE}/all`).then(response => response.data),

    // Get user by ID
    getById: (id) => authorApi.get(`${USER_BASE}/${id}`).then(response => response.data),

    // Create new user
    create: (user) => authorApi.post(`${USER_BASE}/create`, user).then(response => response.data),

    // Update user
    update: (id, user) => authorApi.put(`${USER_BASE}/update/${id}`, user).then(response => response.data),

    // Delete user
    delete: (id) => authorApi.delete(`${USER_BASE}/delete/${id}`).then(response => response.data),

    // Ban user
    ban: (id) => authorApi.put(`${USER_BASE}/ban/${id}`).then(response => response.data),

    // Activate user
    activate: (id) => authorApi.put(`${USER_BASE}/activate/${id}`).then(response => response.data),

    // Get Profile
    getProfile: () => authorApi.get(`${USER_BASE}/profile`).then(response => response.data),

    // Edit Profile
    editProfile: (data) => authorApi.put(`${USER_BASE}/profile`, data).then(response => response.data),

    // Import Users (accepts a File or list of users)
    importUsers: (formData) =>
        authorApi.post(`${USER_BASE}/import`, formData).then(response => response.data),

    // Export Users (downloads Excel file)
    exportUsers: () =>
        authorApi.get(`${USER_BASE}/export`, {
            responseType: 'blob', // important for file download
        }).then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'users.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            return true;
        }),
};

export default userAPI;
