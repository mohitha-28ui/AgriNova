import React, { useState } from 'react';
import {
  Sprout,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FlaskConical,
  CloudSun,
  Droplets,
  Layers
} from 'lucide-react';
import { api } from '../services/api';

export const CropRecommendationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    N: 80,
    P: 45,
    K: 40,
    temperature: 24.5,
    humidity: 82.0,
    ph: 6.5,
    rainfall: 220.0
  });

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.recommendCrop(formData);
      setResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error running recommendation model.');
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (preset: string) => {
    if (preset === 'rice') {
      setFormData({ N: 80, P: 48, K: 40, temperature: 24.0, humidity: 82.0, ph: 6.4, rainfall: 230.0 });
    } else if (preset === 'maize') {
      setFormData({ N: 77, P: 48, K: 20, temperature: 22.5, humidity: 65.0, ph: 6.2, rainfall: 85.0 });
    } else if (preset === 'cotton') {
      setFormData({ N: 117, P: 46, K: 19, temperature: 24.0, humidity: 79.0, ph: 6.9, rainfall: 80.0 });
    } else if (preset === 'apple') {
      setFormData({ N: 20, P: 134, K: 199, temperature: 22.5, humidity: 92.0, ph: 5.9, rainfall: 110.0 });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-800 rounded-3xl p-8 text-white shadow-xl">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/30 uppercase tracking-wider">
          Machine Learning Classifier
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight mt-2">Smart Crop Recommendation Engine</h1>
        <p className="text-emerald-100 text-sm mt-1 max-w-2xl leading-relaxed">
          Trained on benchmark ICAR & FAO agricultural datasets with Random Forest multi-class classification (98.86% accuracy). Evaluates soil chemistry and micro-meteorological variables.
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 font-bold uppercase tracking-wider text-[11px] whitespace-nowrap">Load Agronomic Presets:</span>
        <button
          type="button"
          onClick={() => applyPreset('rice')}
          className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 hover:bg-emerald-100 transition whitespace-nowrap"
        >
          Paddy / Rice Profile
        </button>
        <button
          type="button"
          onClick={() => applyPreset('maize')}
          className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 font-semibold border border-amber-200 hover:bg-amber-100 transition whitespace-nowrap"
        >
          Maize / Corn Profile
        </button>
        <button
          type="button"
          onClick={() => applyPreset('cotton')}
          className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 font-semibold border border-blue-200 hover:bg-blue-100 transition whitespace-nowrap"
        >
          Cotton Profile
        </button>
        <button
          type="button"
          onClick={() => applyPreset('apple')}
          className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-800 font-semibold border border-rose-200 hover:bg-rose-100 transition whitespace-nowrap"
        >
          Apple Orchard Profile
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-emerald-600" /> Soil & Climate Parameters
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nitrogen (N)
                </label>
                <input
                  type="number"
                  min="0"
                  max="250"
                  required
                  value={formData.N}
                  onChange={(e) => setFormData({ ...formData, N: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-800"
                />
                <span className="text-[10px] text-slate-400">Ratio in soil</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Phosphorus (P)
                </label>
                <input
                  type="number"
                  min="0"
                  max="200"
                  required
                  value={formData.P}
                  onChange={(e) => setFormData({ ...formData, P: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-800"
                />
                <span className="text-[10px] text-slate-400">Ratio in soil</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Potassium (K)
                </label>
                <input
                  type="number"
                  min="0"
                  max="250"
                  required
                  value={formData.K}
                  onChange={(e) => setFormData({ ...formData, K: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-800"
                />
                <span className="text-[10px] text-slate-400">Ratio in soil</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Relative Humidity (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.humidity}
                  onChange={(e) => setFormData({ ...formData, humidity: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Soil pH (0 - 14)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="3.5"
                  max="10.0"
                  required
                  value={formData.ph}
                  onChange={(e) => setFormData({ ...formData, ph: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Annual Rainfall (mm)
                </label>
                <input
                  type="number"
                  step="1"
                  required
                  value={formData.rainfall}
                  onChange={(e) => setFormData({ ...formData, rainfall: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? 'Evaluating ML Model...' : 'Generate Crop Recommendation'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" /> Recommendation Analysis
            </h2>

            {result ? (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                  <span className="text-xs uppercase font-bold text-emerald-700 tracking-wider">Top Recommended Crop</span>
                  <p className="text-3xl font-black text-emerald-900 capitalize mt-1">{result.recommended_crop}</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {result.suitability_score}% Suitability Score
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 font-semibold block">Soil Condition</span>
                    <span className="font-bold text-slate-800">{result.soil_suitability}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 font-semibold block">Climate Rating</span>
                    <span className="font-bold text-slate-800">{result.weather_suitability}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed">
                  <p className="font-bold text-slate-800 mb-1">Agronomic Explanation:</p>
                  {result.explanation}
                </div>

                {result.alternative_crops && result.alternative_crops.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Alternative Matches:</p>
                    <div className="flex flex-wrap gap-2">
                      {result.alternative_crops.map((alt: any, idx: number) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-semibold text-xs capitalize">
                          {alt.crop} ({alt.confidence}%)
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400">
                <Sprout className="w-12 h-12 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
                <p className="text-sm font-semibold text-slate-600">No recommendation generated yet</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Fill the soil and meteorological parameters on the left and submit.</p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center font-mono">
            Model: RandomForestClassifier • Accuracy: 98.86% • Version: 1.0.0
          </div>
        </div>
      </div>
    </div>
  );
};
