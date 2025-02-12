import axios from 'axios';

const baseURL = 'http://localhost:8000/api/';

const axiosInstance = axios.create({
  baseURL,
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is not 401 or request has already been retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(`${baseURL}auth/token/refresh/`, {
        refresh: refreshToken
      });

      const { access } = response.data;
      localStorage.setItem('accessToken', access);
      
      originalRequest.headers.Authorization = `Bearer ${access}`;
      return axios(originalRequest);
    } catch (refreshError) {
      // Only clear tokens and redirect on refresh token failure
      if (refreshError.response?.status === 401) {
        localStorage.clear();
        window.location.href = '/login';
      }
      return Promise.reject(refreshError);
    }
  }
);

export default axiosInstance; 