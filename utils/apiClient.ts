import axios from 'axios';

// Create the API client without interceptors initially
const apiClient = axios.create({
  baseURL: 'https://zwishh-gateway-ce7mtpkb.an.gateway.dev',
 
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Setup function to configure the interceptors after auth context is available
export const setupApiClientInterceptors = (
  getAccessToken: () => string | null,
  refreshTokens: () => Promise<void>,
  logOut: () => void
) => {
  // Request interceptor
  apiClient.interceptors.request.use(
    async (config) => {
      const accessToken = getAccessToken();
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          await refreshTokens();
          return apiClient(originalRequest);
        } catch {
          logOut();
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    }
  );
};

export default apiClient;
