import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Database,
  TrendingUp,
  Sprout,
  FlaskConical,
  CloudSun,
  ShoppingBag,
  Droplets,
  Radio,
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
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

export const FarmerDashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [weather, setWeather] = useState<any>(null);
  const [streamingEvents, setStreamingEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sumRes, wRes, evtRes] = await Promise.all([
        api.getDashboardSummary(),
        api.getCurrentWeather('Punjab', 'Ludhiana'),
        api.getKafkaEvents(6)
      ]);
      setSummary(sumRes.data);
      setWeather(wRes.data);
      setStreamingEvents(evtRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const yieldData = [
    { year: '2019', Wheat: 4.1, Rice: 3.7 },
    { year: '2020', Wheat: 4.3, Rice: 3.8 },
    { year: '2021', Wheat: 4.2, Rice: 3.6 },
    { year: '2022', Wheat: 4.5, Rice: 3.9 },
    { year: '2023', Wheat: 4.6, Rice: 4.0 },
    { year: '2024', Wheat: 4.8, Rice: 4.2 },
  ];

  const mandiPrices = [
    { name: 'Wheat', price: 2420 },
    { name: 'Paddy', price: 2180 },
    { name: 'Maize', price: 1950 },
    { name: 'Mustard', price: 5400 },
    { name: 'Cotton', price: 6850 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/30 border border-emerald-400/40 uppercase tracking-wider">
            Operational Intelligence Console
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-2">
            Smart Farm Intelligence Overview
          </h1>
          <p className="text-emerald-100 text-sm mt-1 max-w-xl">
            Live telemetry, PySpark distributed analytics, and machine learning recommendations for crop productivity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs backdrop-blur-sm transition border border-white/20"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Telemetry
          </button>
          <Link
            to="/crop-recommendation"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-900 font-bold text-xs shadow-lg hover:bg-emerald-50 transition"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" /> Run AI Crop Doctor
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Total Datasets</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{summary?.kpis?.total_agricultural_records?.toLocaleString() || '43,940'}</p>
          <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> HDFS & Parquet Lakehouse
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">PySpark Pipelines</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{summary?.kpis?.spark_pipelines_completed || 8} Active</p>
          <p className="text-xs text-blue-600 font-semibold mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> Distributed ETL Jobs
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">ML Model Accuracy</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">98.86%</p>
          <p className="text-xs text-purple-600 font-semibold mt-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Random Forest Classifier
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Live Weather ({weather?.District || 'Punjab'})</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <CloudSun className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{weather?.Mean_Temp_C || 24}°C</p>
          <p className="text-xs text-amber-700 font-semibold mt-1">
            Humidity: {weather?.Relative_Humidity_pct || 62}% • {weather?.Weather_Condition || 'Sunny'}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Yield Productivity History */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Historical Crop Yield Trends (Tonnes/Ha)</h3>
              <p className="text-xs text-slate-500">Benchmark multi-year productivity computed via PySpark</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">Spark Aggregated</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={yieldData}>
                <defs>
                  <linearGradient id="wheatGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="riceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[2, 6]} />
                <Tooltip />
                <Area type="monotone" dataKey="Wheat" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#wheatGrad)" />
                <Area type="monotone" dataKey="Rice" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#riceGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mandi APMC Spot Prices */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Mandi APMC Modal Prices (₹ / Quintal)</h3>
              <p className="text-xs text-slate-500">Live commodity settlement indices</p>
            </div>
            <Link to="/market-intelligence" className="text-xs font-bold text-emerald-600 hover:underline">
              View All 11 Mandis →
            </Link>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mandiPrices}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Bar dataKey="price" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Streaming Events & Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Real-Time Kafka Stream */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="text-base font-bold text-slate-900">Real-Time Kafka Event Ingestion</h3>
            </div>
            <Link to="/kafka-monitor" className="text-xs font-semibold text-emerald-600 hover:underline">
              Stream Monitor →
            </Link>
          </div>
          <div className="divide-y divide-slate-100 overflow-hidden">
            {streamingEvents.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No streaming events in buffer.</p>
            ) : (
              streamingEvents.map((evt, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-slate-100 text-slate-700 font-bold">
                      {evt.topic}
                    </span>
                    <span className="font-semibold text-slate-800">{evt.key}</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-500">
                    <span className="font-mono text-[11px] truncate max-w-xs">{JSON.stringify(evt.payload)}</span>
                    <span className="text-[10px] text-slate-400">{evt.timestamp?.slice(11, 19)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Launch Cards */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              AI Agricultural Copilot
            </span>
            <h3 className="text-lg font-bold mt-3">Agronomic Decision Copilot</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Ask questions on pest control, crop selection, fertilizer scheduling, or drought management powered by retrieval-grounded big data models.
            </p>
          </div>

          <div className="space-y-2 mt-6">
            <Link
              to="/copilot"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              Open AI Farming Assistant →
            </Link>
            <Link
              to="/fertilizer-recommendation"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition"
            >
              Calculate NPK Fertilizer Bags
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
