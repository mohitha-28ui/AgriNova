import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FlaskConical,
  Scale,
  Calendar,
  Layers
} from 'lucide-react';
import { api } from '../services/api';

export const FertilizerRecommendationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    crop: 'Wheat',
    current_n: 80,
    current_p: 30,
    current_k: 25,
    soil_ph: 6.8,
    land_acres: 2.0
  });

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const crops = ['Wheat', 'Rice', 'Maize', 'Cotton', 'Sugarcane', 'Soybean', 'Mustard', 'Gram'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.recommendFertilizer(formData);
      setResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error calculating fertilizer dosage.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-800 to-slate-900 text-white p-8 rounded-3xl shadow-xl">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/30 uppercase tracking-wider">
          Agronomic Nutrient Optimization
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight mt-2">Smart Fertilizer Dosage Advisor</h1>
        <p className="text-emerald-100 text-sm mt-1 max-w-2xl leading-relaxed">
          Calculates commercial fertilizer bag requirements (Urea, DAP, MOP) by computing soil NPK deficits against crop targets, outputting a timed 3-phase split application schedule.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Form */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-600" /> Soil Test & Field Acreage Inputs
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Target Crop</label>
                <select
                  value={formData.crop}
                  onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                >
                  {crops.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Land Size (Acres)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  required
                  value={formData.land_acres}
                  onChange={(e) => setFormData({ ...formData, land_acres: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Available N</label>
                <input
                  type="number"
                  required
                  value={formData.current_n}
                  onChange={(e) => setFormData({ ...formData, current_n: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-slate-400">kg/ha in soil</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Available P</label>
                <input
                  type="number"
                  required
                  value={formData.current_p}
                  onChange={(e) => setFormData({ ...formData, current_p: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-slate-400">kg/ha in soil</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Available K</label>
                <input
                  type="number"
                  required
                  value={formData.current_k}
                  onChange={(e) => setFormData({ ...formData, current_k: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-slate-400">kg/ha in soil</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Soil pH (0 - 14)</label>
              <input
                type="number"
                step="0.1"
                min="3.5"
                max="10.0"
                required
                value={formData.soil_ph}
                onChange={(e) => setFormData({ ...formData, soil_ph: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? 'Computing Dosages...' : 'Calculate Fertilizer Dosage'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" /> Fertilizer Recommendation Report
            </h2>

            {result ? (
              <div className="space-y-4">
                {/* Fertilizer Bags Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">Urea (46% N)</span>
                    <p className="text-xl font-black text-emerald-950 mt-1">{result.recommended_fertilizers?.urea_kg} kg</p>
                    <span className="text-[11px] font-bold text-emerald-700">~{result.recommended_fertilizers?.urea_50kg_bags} Bags</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-center">
                    <span className="text-[10px] font-bold text-blue-800 uppercase block">DAP (18:46:0)</span>
                    <p className="text-xl font-black text-blue-950 mt-1">{result.recommended_fertilizers?.dap_kg} kg</p>
                    <span className="text-[11px] font-bold text-blue-700">~{result.recommended_fertilizers?.dap_50kg_bags} Bags</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                    <span className="text-[10px] font-bold text-amber-800 uppercase block">MOP (60% K2O)</span>
                    <p className="text-xl font-black text-amber-950 mt-1">{result.recommended_fertilizers?.mop_kg} kg</p>
                    <span className="text-[11px] font-bold text-amber-700">~{result.recommended_fertilizers?.mop_50kg_bags} Bags</span>
                  </div>
                </div>

                {/* Application Schedule */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <p className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-600" /> 3-Stage Split Application Schedule:
                  </p>
                  <div className="space-y-2 text-xs">
                    {result.application_schedule?.map((s: any, i: number) => (
                      <div key={i} className="p-2 rounded-lg bg-white border border-slate-200 flex justify-between">
                        <span className="font-semibold text-slate-800">{s.timing}</span>
                        <span className="text-slate-600 font-mono text-[11px]">
                          Urea: {s.urea_bags}b | DAP: {s.dap_bags}b | MOP: {s.mop_bags}b
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {result.warnings_and_soil_amendments?.length > 0 && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                    <p className="font-bold flex items-center gap-1.5 mb-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Soil Amendment Action:
                    </p>
                    {result.warnings_and_soil_amendments.map((w: string, i: number) => (
                      <p key={i}>• {w}</p>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400">
                <Scale className="w-12 h-12 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
                <p className="text-sm font-semibold text-slate-600">No dosage calculated yet</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Select crop, land acreage, and available NPK on the left.</p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center font-mono">
            Standard: ICAR Fertilizer Calculus (50kg Standard Bag Conversion)
          </div>
        </div>
      </div>
    </div>
  );
};
