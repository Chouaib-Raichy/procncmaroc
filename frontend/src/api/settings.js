import api from './axios';

export const getSettings = () => api.get('/settings');
export const toggleSetting = (key) => api.post(`/admin/settings/${key}/toggle`);
