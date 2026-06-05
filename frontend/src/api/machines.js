import api from './axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const getMachines = (page = 1) => api.get(`/machines?page=${page}&per_page=9`);
export const getAllMachines = () => api.get('/machines?all=1');

export const getAdminMachines = () => api.get('/admin/machines');

export const getMachine = (id) => api.get(`/admin/machines/${id}`);

export const createMachine = (formData) => api.post('/admin/machines', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});

export const updateMachine = (id, formData) => api.post(`/admin/machines/update/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});

export const deleteMachine = (id) => api.delete(`/admin/machines/${id}`);

export const getImageUrl = (path) => path ? `${BASE_URL.replace('/api', '')}/storage/${path}` : null;
export const getPdfUrl = (path) => path ? `${BASE_URL.replace('/api', '')}/storage/${path}` : null;
