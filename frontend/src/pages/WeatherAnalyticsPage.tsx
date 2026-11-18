import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  CloudRain,
  Wind,
  Sun,
  Droplets,
  Thermometer,
  ShieldAlert,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { api } from '../services/api';

export const WeatherAnalyticsPage: React.FC = () => {
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [selectedState, setSelectedState] = useState('Punjab');
  const [selectedDistrict, setSelectedDistrict] = useState('Ludhiana');

  const loadWeather = async () => {
    try {
      const res = await api.getCurrentWeather(selectedState, selectedDistrict);
      setCurrentWeather(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadWeather();
  }, [selectedState, selectedDistrict]);

  const rainfallTrends = [
    { month: 'Jan', rain: 24, temp: 14 },
    { month: 'Feb', rain: 30, temp: 17 },
    { month: 'Mar', rain: 18, temp: 22 },
    { month: 'Apr', rain: 12, temp: 29 },
    { month: 'May', rain: 15, temp: 36 },
    { month: 'Jun', rain: 75, temp: 38 },
    { month: 'Jul', rain: 210, temp: 32 },
    { month: 'Aug', rain: 240, temp: 31 },
    { month: 'Sep', rain: 130, temp: 29 },
    { month: 'Oct', rain: 20, temp: 26 },
    { month: 'Nov', rain: 8, temp: 20 },
    { month: 'Dec', rain: 14, temp: 15 },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-sky-600 via-sky-700 to-blue-900 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-400/30 uppercase tracking-wider">
            Automated Weather Station (AWS) Network
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-2">Meteorological & Rainfall Analytics</h1>
          <p className="text-sky-100 text-sm mt-1 max-w-xl">
            High-resolution telemetric observations: solar radiation, vapor saturation, wind velocities, and district monsoon accumulation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white text-slate-800 text-xs font-bold shadow-md focus:outline-none"
          >
            <option value="Ludhiana">Ludhiana (Punjab)</option>
            <option value="Karnal">Karnal (Haryana)</option>
            <option value="Varanasi">Varanasi (UP)</option>
            <option value="Pune">Pune (Maharashtra)</option>
            <option value="Indore">Indore (MP)</option>
          </select>
        </div>
      </div>

      {/* Current Conditions Card */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Mean Temperature</span>
            <Thermometer className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-black text-slate-900">{currentWeather?.Mean_Temp_C || 24.2}°C</p>
          <p className="text-xs text-slate-500 mt-1">
            Max: {currentWeather?.Max_Temp_C || 28}°C • Min: {currentWeather?.Min_Temp_C || 18}°C
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Relative Humidity</span>
            <Droplets className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-black text-blue-600">{currentWeather?.Relative_Humidity_pct || 65}%</p>
          <p className="text-xs text-slate-500 mt-1">Atmospheric Vapor Saturation</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Wind Velocity</span>
            <Wind className="w-5 h-5 text-teal-500" />
          </div>
          <p className="text-3xl font-black text-slate-900">{currentWeather?.Wind_Speed_kmh || 12.4} <span className="text-sm font-semibold">km/h</span></p>
          <p className="text-xs text-slate-500 mt-1">Gentle Surface Breeze</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Weather Condition</span>
            <Sun className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-xl font-black text-slate-900 mt-1">{currentWeather?.Weather_Condition || 'Clear / Sunny'}</p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">Favorable for Spraying</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Annual Monsoon & Rainfall Accumulation (mm)</h3>
            <p className="text-xs text-slate-500">Aggregated monthly precipitation baseline</p>
          </div>
          <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full">PySpark Aggregated</span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rainfallTrends}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip />
              <Bar dataKey="rain" fill="#0ea5e9" radius={[8, 8, 0, 0]} name="Precipitation (mm)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Agricultural Weather Advisory */}
      <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-bold text-amber-900">Agrometeorological Advisory for {selectedDistrict}:</p>
          <p className="text-amber-800 mt-0.5 leading-relaxed">
            Clear sky conditions anticipated for the next 48 hours. Night temperatures are ideal for Rabi wheat tillering. Safe window for foliar nutrient sprays and weed management. Avoid evening flood irrigation due to low dew-point evaporation.
          </p>
        </div>
      </div>
    </div>
  );
};
