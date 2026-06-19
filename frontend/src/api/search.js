import api from './axios';

export const searchAll = (q) => api.get('/search', { params: { q } });
