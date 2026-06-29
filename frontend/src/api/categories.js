import api from './axios';

export const getCategories = () => api.get('/categories');
export const getAdminCategories = () => api.get('/admin/categories');

export const createCategory = (formData) => api.post('/admin/categories', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});

export const updateCategory = (id, formData) => api.put(`/admin/categories/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});

export const deleteCategory = (id) => api.delete(`/admin/categories/${id}`);
