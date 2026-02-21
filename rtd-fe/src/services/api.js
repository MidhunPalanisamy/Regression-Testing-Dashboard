import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

export const buildAPI = {
  getAll: () => api.get('/builds'),
  getById: (id) => api.get(`/builds/${id}`),
  create: (data) => api.post('/builds', data),
  update: (id, data) => api.put(`/builds/${id}`, data),
  delete: (id) => api.delete(`/builds/${id}`),
};

export const testCaseAPI = {
  getAll: () => api.get('/testcases'),
  getByBuild: (buildId) => api.get(`/testcases/build/${buildId}`),
  getById: (id) => api.get(`/testcases/${id}`),
  create: (data) => api.post('/testcases', data),
  update: (id, data) => api.put(`/testcases/${id}`, data),
  delete: (id) => api.delete(`/testcases/${id}`),
  import: (buildId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/testcases/import/${buildId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  compare: (build1Id, build2Id) => api.get(`/testcases/compare?build1Id=${build1Id}&build2Id=${build2Id}`),
};

export const regressionAPI = {
  getAll: () => api.get('/regression'),
  getByBuild: (buildId) => api.get(`/regression/build/${buildId}`),
  execute: (buildId) => api.post(`/regression/execute/${buildId}`),
};

export const userAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export default api;
