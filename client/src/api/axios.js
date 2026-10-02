import axios from 'axios';

const rawUrl = (import.meta.env.VITE_API_URL || '/api').trim();
const baseURL = rawUrl === '/api'
  ? '/api'
  : rawUrl.endsWith('/api')
  ? rawUrl
  : `${rawUrl.replace(/\/+$/, '')}/api`;

const api = axios.create({
  baseURL,
  timeout: 30000,
});

export default api;
