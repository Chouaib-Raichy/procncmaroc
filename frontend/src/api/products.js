import api from './axios';

export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);

export const getAdminProducts = (params) => api.get('/admin/products', { params });
export const createProduct = (formData) => api.post('/admin/products', formData);
export const updateProduct = (id, formData) => api.put(`/admin/products/${id}`, formData);
export const deleteProduct = (id) => api.delete(`/admin/products/${id}`);
