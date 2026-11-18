import axios from 'axios';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://127.0.0.1:8000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('agrinova_token');
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
};
