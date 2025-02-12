import axios from 'axios';

const baseURL = 'http://localhost:8000/api/';

const axiosInstance = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${baseURL}token/refresh/`, {
          refresh: refreshToken
        });

        const { access } = response.data;
        localStorage.setItem('accessToken', access);
        
        // Update the original request with the new token
        originalRequest.headers['Authorization'] = `Bearer ${access}`;
        return axios(originalRequest);
      } catch (error) {
        // If refresh token fails, redirect to login
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 