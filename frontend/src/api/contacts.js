import api from './axios';

export const getMessages = () => api.get('/admin/messages');