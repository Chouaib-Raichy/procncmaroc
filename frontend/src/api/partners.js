import api from './axios';

export const getPartners = () => api.get('/partners');
export const getPartner = (id) => api.get(`/partners/${id}`);
