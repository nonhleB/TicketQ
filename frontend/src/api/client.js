import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({ baseURL });

// Attach the stored JWT (if any) to every outgoing request.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('deskflow_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is invalid or has expired, the API returns 401 — clear the
// stale session so the user is dropped back to the login screen instead of
// being stuck staring at cryptic auth errors on every subsequent action.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('deskflow_token');
      localStorage.removeItem('deskflow_user');
      if (typeof window !== 'undefined' && !window.location.pathname.includes('login')) {
        window.dispatchEvent(new Event('deskflow:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
