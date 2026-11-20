import axios from 'axios';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('mythora_token') || localStorage.getItem('agrinova_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Agricultural API methods
export const api = {
  // Auth
  login: (data: any) => apiClient.post('/auth/login', data),
  register: (data: any) => apiClient.post('/auth/register', data),
  getMe: () => apiClient.get('/auth/me'),

  // ML Recommendations & Predictions
  recommendCrop: (data: any) => apiClient.post('/recommendations/crop', data),
  recommendFertilizer: (data: any) => apiClient.post('/recommendations/fertilizer', data),
  predictYield: (data: any) => apiClient.post('/predictions/yield', data),
  diagnoseDisease: (data: any) => apiClient.post('/disease/diagnose', data),
  queryCopilot: (data: any) => apiClient.post('/copilot/query', data),

  // Big Data Infrastructure
  getHdfsStatus: () => apiClient.get('/bigdata/hdfs/status'),
  getHdfsFiles: (path = '/agrinova') => apiClient.get(`/bigdata/hdfs/files?path=${path}`),
  syncHdfs: () => apiClient.post('/bigdata/hdfs/sync'),
  getSparkJobs: () => apiClient.get('/bigdata/spark/jobs'),
  triggerSparkPipeline: (pipeline_name = 'ALL') => apiClient.post('/bigdata/spark/run', { pipeline_name }),
  getKafkaMetrics: () => apiClient.get('/bigdata/kafka/metrics'),
  getKafkaEvents: (limit = 30) => apiClient.get(`/bigdata/kafka/events?limit=${limit}`),
  generateKafkaEvents: (count = 8) => apiClient.post(`/bigdata/kafka/generate-events?count=${count}`),

  // Operational Data & Analytics
  getDashboardSummary: () => apiClient.get('/analytics/dashboard-summary'),
  getAnalyticsResult: (key: string) => apiClient.get(`/analytics/result/${key}`),
  getAllAnalyticsResults: () => apiClient.get('/analytics/all-results'),
  getCrops: () => apiClient.get('/agriculture/crops'),
  getSoilRecords: (state?: string) => apiClient.get(`/agriculture/soil/records${state ? `?state=${state}` : ''}`),
  createSoilRecord: (data: any) => apiClient.post('/agriculture/soil/records', data),
  getCurrentWeather: (state = 'Punjab', district = 'Ludhiana') => 
    apiClient.get(`/agriculture/weather/current?state=${state}&district=${district}`),
  getWeatherRecords: () => apiClient.get('/agriculture/weather/records'),
  getMarketPrices: (commodity?: string) => 
    apiClient.get(`/agriculture/market/prices${commodity ? `?commodity=${commodity}` : ''}`),
  getIrrigationStatus: () => apiClient.get('/agriculture/irrigation/status'),

  // Admin & System Health
  getSystemHealth: () => apiClient.get('/admin/health'),
  getUsers: () => apiClient.get('/admin/users'),
  getNotifications: () => apiClient.get('/admin/notifications'),
  submitFeedback: (data: any) => apiClient.post('/admin/feedback', data),
  getFeedback: () => apiClient.get('/admin/feedback'),

  // AgriNova Relational SQL 7 Core Modules
  getSqlDashboardStats: () => apiClient.get('/sql/dashboard/stats'),
  
  // Module 1: Users
  getSqlUsers: (params?: any) => apiClient.get('/sql/users', { params }),
  getSqlUser: (id: number) => apiClient.get(`/sql/users/${id}`),
  createSqlUser: (data: any) => apiClient.post('/sql/users', data),
  updateSqlUser: (id: number, data: any) => apiClient.put(`/sql/users/${id}`, data),
  deleteSqlUser: (id: number) => apiClient.delete(`/sql/users/${id}`),

  // Module 2: Crops
  getSqlCrops: (params?: any) => apiClient.get('/sql/crops', { params }),
  getSqlCrop: (id: number) => apiClient.get(`/sql/crops/${id}`),
  createSqlCrop: (data: any) => apiClient.post('/sql/crops', data),
  updateSqlCrop: (id: number, data: any) => apiClient.put(`/sql/crops/${id}`, data),
  deleteSqlCrop: (id: number) => apiClient.delete(`/sql/crops/${id}`),

  // Module 3: Soil
  getSqlSoil: (params?: any) => apiClient.get('/sql/soil', { params }),
  getSqlSoilItem: (id: number) => apiClient.get(`/sql/soil/${id}`),
  createSqlSoil: (data: any) => apiClient.post('/sql/soil', data),
  updateSqlSoil: (id: number, data: any) => apiClient.put(`/sql/soil/${id}`, data),
  deleteSqlSoil: (id: number) => apiClient.delete(`/sql/soil/${id}`),

  // Module 4: Weather
  getSqlWeather: (location?: string) => apiClient.get(`/sql/weather${location ? `?location=${encodeURIComponent(location)}` : ''}`),
  getSqlCurrentWeather: (location?: string) => apiClient.get(`/sql/weather/current${location ? `?location=${encodeURIComponent(location)}` : ''}`),
  createSqlWeather: (data: any) => apiClient.post('/sql/weather', data),
  updateSqlWeather: (id: number, data: any) => apiClient.put(`/sql/weather/${id}`, data),
  deleteSqlWeather: (id: number) => apiClient.delete(`/sql/weather/${id}`),

  // Module 5: Fertilizer & Recommendations
  getSqlFertilizers: () => apiClient.get('/sql/fertilizers'),
  createSqlFertilizer: (data: any) => apiClient.post('/sql/fertilizers', data),
  updateSqlFertilizer: (id: number, data: any) => apiClient.put(`/sql/fertilizers/${id}`, data),
  deleteSqlFertilizer: (id: number) => apiClient.delete(`/sql/fertilizers/${id}`),
  recommendSqlFertilizer: (data: any) => apiClient.post('/sql/fertilizers/recommend', data),
  getSqlRecommendations: () => apiClient.get('/sql/recommendations'),

  // Module 6: Diseases
  getSqlDiseases: (crop?: string) => apiClient.get(`/sql/diseases${crop ? `?crop=${encodeURIComponent(crop)}` : ''}`),
  createSqlDisease: (data: any) => apiClient.post('/sql/diseases', data),
  updateSqlDisease: (id: number, data: any) => apiClient.put(`/sql/diseases/${id}`, data),
  deleteSqlDisease: (id: number) => apiClient.delete(`/sql/diseases/${id}`),
  detectSqlDisease: (formData: FormData) => apiClient.post('/sql/diseases/detect', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  // Module 7: Market Prices
  getSqlMarketPrices: (params?: any) => apiClient.get('/sql/market-prices', { params }),
  getSqlMarketTrends: () => apiClient.get('/sql/market-prices/trends'),
  createSqlMarketPrice: (data: any) => apiClient.post('/sql/market-prices', data),
  updateSqlMarketPrice: (id: number, data: any) => apiClient.put(`/sql/market-prices/${id}`, data),
  deleteSqlMarketPrice: (id: number) => apiClient.delete(`/sql/market-prices/${id}`),
};
