import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Attach JWT token to every request
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh on 401
apiClient.interceptors.response.use(
  (res) => res.data,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        const { accessToken } = (response.data as any).data;

        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

// API methods
export const api = {
  auth: {
    login: (email: string, password: string) =>
      apiClient.post('/auth/login', { email, password }),
    register: (data: any) => apiClient.post('/auth/register', data),
    logout: (refreshToken: string) => apiClient.post('/auth/logout', { refreshToken }),
    me: () => apiClient.get('/auth/me'),
  },

  prescriptions: {
    upload: (file: File, pharmacyId?: string) => {
      const form = new FormData();
      form.append('file', file);
      if (pharmacyId) form.append('pharmacyId', pharmacyId);
      return apiClient.post('/prescriptions/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    findAll: () => apiClient.get('/prescriptions'),
    findOne: (id: string) => apiClient.get(`/prescriptions/${id}`),
    ocrStatus: (id: string) => apiClient.get(`/prescriptions/${id}/ocr-status`),
    pending: () => apiClient.get('/prescriptions/pharmacy/pending'),
    validate: (id: string, data: any) => apiClient.put(`/prescriptions/${id}/validate`, data),
  },

  orders: {
    create: (data: any) => apiClient.post('/orders', data),
    findAll: (page = 1) => apiClient.get(`/orders?page=${page}`),
    findOne: (id: string) => apiClient.get(`/orders/${id}`),
    tracking: (id: string) => apiClient.get(`/orders/${id}/tracking`),
    cancel: (id: string) => apiClient.delete(`/orders/${id}/cancel`),
    updateStatus: (id: string, status: string, note?: string) =>
      apiClient.put(`/orders/${id}/status`, { status, note }),
  },

  payments: {
    createIntent: (orderId: string) => apiClient.post('/payments/intent', { orderId }),
    refund: (orderId: string, reason: string) =>
      apiClient.post('/payments/refund', { orderId, reason }),
  },

  pharmacy: {
    dashboard: () => apiClient.get('/analytics/pharmacy'),
    orders: (status?: string) =>
      apiClient.get(`/orders/pharmacy${status ? `?status=${status}` : ''}`),
  },

  notifications: {
    findAll: () => apiClient.get('/notifications'),
    markAllRead: () => apiClient.put('/notifications/read-all'),
  },

  analytics: {
    dashboard: (start?: string, end?: string) => {
      const params = new URLSearchParams();
      if (start) params.append('start', start);
      if (end) params.append('end', end);
      return apiClient.get(`/analytics/dashboard?${params}`);
    },
  },
};
