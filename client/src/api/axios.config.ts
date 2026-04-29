import axios from 'axios';
import { API_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Response interceptor to normalize errors
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;
