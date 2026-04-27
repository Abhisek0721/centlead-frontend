'use client';

import axios from 'axios';
import envConstant from '@constants/envConstant';
import { getToken } from '@utils/localStorage';

const axiosInstance = axios.create({
  baseURL: envConstant.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
    }
    return Promise.reject(error);
  },
);

// Imported separately to avoid circular dep — keep removeToken local here
function removeToken() {
  localStorage.removeItem('centlead_token');
}

export default axiosInstance;
