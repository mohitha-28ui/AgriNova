import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { FarmerDashboardPage } from './pages/FarmerDashboardPage';
import { BigDataAnalyticsPage } from './pages/BigDataAnalyticsPage';
import { HadoopMonitoringPage } from './pages/HadoopMonitoringPage';
import { SparkMonitoringPage } from './pages/SparkMonitoringPage';
import { KafkaStreamingPage } from './pages/KafkaStreamingPage';
import { CropRecommendationPage } from './pages/CropRecommendationPage';
import { YieldPredictionPage } from './pages/YieldPredictionPage';
import { SoilAnalyticsPage } from './pages/SoilAnalyticsPage';
import { WeatherAnalyticsPage } from './pages/WeatherAnalyticsPage';
import { FertilizerRecommendationPage } from './pages/FertilizerRecommendationPage';
import { DiseaseDetectionPage } from './pages/DiseaseDetectionPage';
import { MarketIntelligencePage } from './pages/MarketIntelligencePage';
import { IrrigationAnalyticsPage } from './pages/IrrigationAnalyticsPage';
import { CopilotPage } from './pages/CopilotPage';
import { ReportsPage } from './pages/ReportsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { SystemHealthPage } from './pages/SystemHealthPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Marketing & Auth Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Authenticated Application Shell */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<FarmerDashboardPage />} />
          <Route path="/bigdata-analytics" element={<BigDataAnalyticsPage />} />
          <Route path="/hadoop-monitor" element={<HadoopMonitoringPage />} />
          <Route path="/spark-monitor" element={<SparkMonitoringPage />} />
          <Route path="/kafka-monitor" element={<KafkaStreamingPage />} />
          <Route path="/crop-recommendation" element={<CropRecommendationPage />} />
          <Route path="/yield-prediction" element={<YieldPredictionPage />} />
          <Route path="/soil-analytics" element={<SoilAnalyticsPage />} />
          <Route path="/weather-analytics" element={<WeatherAnalyticsPage />} />
          <Route path="/fertilizer-recommendation" element={<FertilizerRecommendationPage />} />
          <Route path="/disease-detection" element={<DiseaseDetectionPage />} />
          <Route path="/market-intelligence" element={<MarketIntelligencePage />} />
          <Route path="/irrigation-analytics" element={<IrrigationAnalyticsPage />} />
          <Route path="/copilot" element={<CopilotPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
          <Route path="/system-health" element={<SystemHealthPage />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
