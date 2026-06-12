import api from './axios';

export const trackVisit = (pageUrl, referrerUrl) =>
  api.post('/track-visit', { page_url: pageUrl, referrer_url: referrerUrl || document.referrer });

export const getVisitors = (page = 1, perPage = 50) =>
  api.get('/admin/visitors', { params: { page, per_page: perPage } });

export const getStatsSummary = () => api.get('/admin/stats/summary');
