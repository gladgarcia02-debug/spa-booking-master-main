import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the admin token (if present) to every request.
// Public endpoints simply ignore the header; protected ones require it.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('spa_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is invalid/expired, the backend returns 401 —
// clear it and bounce to login rather than leaving the user stuck.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('spa_admin_token');
      localStorage.removeItem('spa_admin_user');
    }
    return Promise.reject(error);
  }
);

export default api;