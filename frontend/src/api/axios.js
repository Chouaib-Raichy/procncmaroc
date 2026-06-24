import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Accept': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  let token;
  try { token = localStorage.getItem('token'); } catch { /* private mode */ }
  if (!token) { try { token = sessionStorage.getItem('token'); } catch { /* private mode */ } }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  } else {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

export default api;
