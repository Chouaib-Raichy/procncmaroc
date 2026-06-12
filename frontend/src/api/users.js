import api from './axios';

export const getUsers = () => api.get('/admin/users');
export const getUserDetail = (id) => api.get(`/admin/users/${id}`);
export const toggleBanUser = (id) => api.post(`/admin/users/${id}/toggle-ban`);
export const getPendingUsers = (page = 1) => api.get(`/admin/users/pending/list?page=${page}`);
export const approveUser = (id) => api.post(`/admin/users/${id}/approve`);
export const rejectUser = (id) => api.delete(`/admin/users/${id}/reject`);
