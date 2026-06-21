import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token from persisted Redux state
api.interceptors.request.use(
  (config) => {
    try {
      const persistedState = localStorage.getItem('persist:root');
      if (persistedState) {
        const parsed = JSON.parse(persistedState);
        if (parsed.auth) {
          const authState = JSON.parse(parsed.auth);
          if (authState.token) {
            config.headers.Authorization = `Bearer ${authState.token}`;
          }
        }
      }
    } catch {
      // ignore parse errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('persist:root');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
