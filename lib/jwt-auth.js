// jwt-auth.js (Axios setup with refresh token support)

import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

const API = axios.create({
  baseURL: 'https://zwishh-gateway-ce7mtpkb.an.gateway.dev/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

API.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return API(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        // Ensure this specific endpoint is correct as per docs
        const { data } = await axios.post(
          'https://zwishh-gateway-ce7mtpkb.an.gateway.dev/api/auth/v1/refresh-token',
          { refresh_token: refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        await SecureStore.setItemAsync('accessToken', data.access_token);
        await SecureStore.setItemAsync('refreshToken', data.refresh_token);

        API.defaults.headers.Authorization = `Bearer ${data.access_token}`;
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        processQueue(null, data.access_token);
        return API(originalRequest);
      } catch (err) {
        processQueue(err, null);
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        router.replace('/sign-in'); // Ensure '/login' is the correct route
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default API;
