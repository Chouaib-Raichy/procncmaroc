import api from './axios';

const BASE = import.meta.env.VITE_API_URL || '';

export const trackVisit = (pageUrl, referrerUrl) =>
  fetch(BASE + '/api/track-visit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
    body: JSON.stringify({ page_url: pageUrl, referrer_url: referrerUrl || document.referrer }),
    keepalive: true,
  });

export const getVisitors = (page = 1, perPage = 50) =>
  api.get('/admin/visitors', { params: { page, per_page: perPage } });

export const getStatsSummary = () => api.get('/admin/stats/summary');
