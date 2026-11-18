import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart2,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  MapPin,
  Calendar
} from 'lucide-react';
import { api } from '../services/api';

export const YieldPredictionPage: React.FC = () => {
  const [formData, setFormData] = useState({
    state: 'Punjab',
    crop: 'Wheat',
    season: 'Rabi',
    area_hectares: 10.0,
    annual_rainfall_mm: 650.0,
    fertilizer_used_kg: 1400.0,
    pesticide_used_kg: 15.0
  });

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const states = ['Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh', 'Maharashtra', 'Karnataka', 'Gujarat', 'Tamil Nadu', 'Andhra Pradesh', 'West Bengal'];
  const crops = ['Wheat', 'Rice', 'Maize', 'Cotton', 'Sugarcane', 'Soybean', 'Gram', 'Groundnut', 'Mustard', 'Potato'];
  const seasons = ['Kharif', 'Rabi', 'Whole Year', 'Summer'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.predictYield(formData);
      setResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error running yield prediction model.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-900 rounded-3xl p-8 text-white shadow-xl">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/30 uppercase tracking-wider">
          Machine Learning Regressor
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight mt-2">Crop Yield & Production Predictor</h1>
        <p className="text-blue-100 text-sm mt-1 max-w-2xl leading-relaxed">
          Predicts metric agricultural productivity (Tonnes / Hectare) using Gradient Boosting Regression (R² = 0.9865) based on regional weather, input dosages, and historical Ministry of Agriculture statistics.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-blue-600" /> Cultivation & Agro-Climatic Parameters
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">State</label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500"
                >
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Crop</label>
                <select
                  value={formData.crop}
                  onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500"
                >
                  {crops.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Season</label>
                <select
                  value={formData.season}
                  onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500"
                >
                  {seasons.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Area (Hectares)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  required
                  value={formData.area_hectares}
                  onChange={(e) => setFormData({ ...formData, area_hectares: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Annual Rainfall (mm)
                </label>
                <input
                  type="number"
                  required
                  value={formData.annual_rainfall_mm}
                  onChange={(e) => setFormData({ ...formData, annual_rainfall_mm: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 font-semibold text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Total Fertilizer (kg)
                </label>
                <input
                  type="number"
                  required
                  value={formData.fertilizer_used_kg}
                  onChange={(e) => setFormData({ ...formData, fertilizer_used_kg: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 font-semibold text-slate-800"
                />
                <span className="text-[10px] text-slate-400">Total NPK applied</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Total Pesticide (kg)
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={formData.pesticide_used_kg}
                  onChange={(e) => setFormData({ ...formData, pesticide_used_kg: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 font-semibold text-slate-800"
                />
                <span className="text-[10px] text-slate-400">Plant protection active</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? 'Executing Regressor...' : 'Calculate Predicted Yield'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Results Card */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" /> Yield Forecast Report
            </h2>

            {result ? (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 text-center">
                  <span className="text-xs uppercase font-bold text-blue-700 tracking-wider">Predicted Yield Productivity</span>
                  <p className="text-3xl font-black text-blue-900 mt-1">
                    {result.predicted_yield_tonnes_per_ha} <span className="text-base font-semibold text-blue-700">Tonnes / Ha</span>
                  </p>
                  <p className="text-xs text-blue-600 font-semibold mt-1">
                    Gross Production: <strong>{result.predicted_total_production_tonnes} Tonnes</strong> across {result.area_hectares} Ha
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 font-semibold block">National Benchmark</span>
                    <span className="font-bold text-slate-800">{result.benchmark_yield_tonnes_per_ha} T/Ha</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 font-semibold block">Performance Variance</span>
                    <span className={`font-bold ${result.variance_from_benchmark_pct >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {result.variance_from_benchmark_pct >= 0 ? '+' : ''}{result.variance_from_benchmark_pct}%
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                  <p className="font-bold text-slate-800">Key Agronomic Drivers:</p>
                  {result.key_factors?.map((f: string, i: number) => (
                    <p key={i} className="text-slate-600 text-[11px]">• {f}</p>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400">
                <TrendingUp className="w-12 h-12 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
                <p className="text-sm font-semibold text-slate-600">No prediction calculated yet</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Select crop, location, acreage, and input metrics on the left.</p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center font-mono">
            Model: GradientBoostingRegressor • R²: 0.9865 • RMSE: 2.59
          </div>
        </div>
      </div>
    </div>
  );
};
