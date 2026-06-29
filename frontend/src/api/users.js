import api from './axios';

export const getUsers = (params) => api.get('/admin/users', { params });
export const getUserDetail = (id) => api.get(`/admin/users/${id}`);
export const updateUser = (id, formData) => api.put(`/admin/users/${id}`, formData);
export const toggleBanUser = (id) => api.post(`/admin/users/${id}/toggle-ban`);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
export const getPendingUsers = (page = 1) => api.get('/admin/users/pending', { params: { page: page - 1, size: 10 } });
export const approveUser = (id) => api.post(`/admin/users/${id}/approve`);
export const rejectUser = (id) => api.delete(`/admin/users/${id}/reject`);
