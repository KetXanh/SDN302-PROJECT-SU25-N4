// src/api/userAPI.js
import authorApi from './base/authorAPI';
const USER_BASE = '/user';
const userAPI = {
    //Get all user
    getAll: () => authorApi.get(`${USER_BASE}/all`).then(response => response.data),

    //Get user by ID
    getById: (id) => authorApi.get(`${USER_BASE}/${id}`).then(response => response.data),

    //Create new user
    create: (user) => authorApi.post(`${USER_BASE}/create`, user).then(response => response.data),

    //Update user
    update: (id, user) => authorApi.put(`${USER_BASE}/update/${id}`, user).then(response => response.data),

    //Delete user
    delete: (id) => authorApi.delete(`${USER_BASE}/delete/${id}`).then(response => response.data),

    //Ban user
    ban: (id) => authorApi.put(`${USER_BASE}/ban/${id}`).then(response => response.data),

    //Activate user
    activate: (id) => authorApi.put(`${USER_BASE}/activate/${id}`).then(response => response.data),

    //Get Profile
    getProfile: () => authorApi.get(`${USER_BASE}/profile`).then(response => response.data),

    //Edit Profile
    editProfile: (data) => authorApi.put('/users/profile', data).then(response => response.data)
};

export default userAPI;
