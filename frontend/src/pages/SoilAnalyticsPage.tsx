import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  RefreshCw,
  Search
} from 'lucide-react';
import { api } from '../services/api';

export const SoilAnalyticsPage: React.FC = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSample, setNewSample] = useState({
    state: 'Punjab',
    district: 'Ludhiana',
    soil_type: 'Alluvial',
    nitrogen_kg_ha: 280,
    phosphorus_kg_ha: 45,
    potassium_kg_ha: 220,
    soil_ph: 6.8,
    electrical_conductivity: 0.45,
    organic_carbon_pct: 0.72,
    moisture_pct: 26.5
  });

  const loadSoil = async () => {
    setLoading(true);
    try {
      const res = await api.getSoilRecords();
      setRecords(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSoil();
  }, []);

  const handleAddSample = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createSoilRecord(newSample);
      setShowAddForm(false);
      await loadSoil();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = records.filter(r =>
    (r.District?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     r.State?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     r.Soil_Type?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-950 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/30 uppercase tracking-wider">
            Soil Health Card Scheme Standards
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-2">Soil Health & Chemistry Analytics</h1>
          <p className="text-amber-100 text-sm mt-1 max-w-xl">
            Quantitative assessment of Nitrogen, Phosphorus, Potassium, electrical conductivity, organic carbon %, and pH status across 3,500+ soil samples.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-amber-900 font-bold text-xs shadow-lg hover:bg-amber-50 transition"
        >
          <Plus className="w-4 h-4 text-amber-700" /> Log Soil Health Test
        </button>
      </div>

      {/* New Sample Modal/Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-amber-600" /> Enter Soil Laboratory Test Results
          </h3>
          <form onSubmit={handleAddSample} className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">State</label>
                <input
                  type="text"
                  required
                  value={newSample.state}
                  onChange={(e) => setNewSample({ ...newSample, state: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">District</label>
                <input
                  type="text"
                  required
                  value={newSample.district}
                  onChange={(e) => setNewSample({ ...newSample, district: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Soil Type</label>
                <select
                  value={newSample.soil_type}
                  onChange={(e) => setNewSample({ ...newSample, soil_type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
                >
                  <option value="Alluvial">Alluvial</option>
                  <option value="Black Soil (Regur)">Black Soil (Regur)</option>
                  <option value="Red & Yellow Soil">Red & Yellow Soil</option>
                  <option value="Laterite">Laterite</option>
                  <option value="Loamy Sand">Loamy Sand</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Soil pH (0-14)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newSample.soil_ph}
                  onChange={(e) => setNewSample({ ...newSample, soil_ph: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nitrogen (kg/ha)</label>
                <input
                  type="number"
                  required
                  value={newSample.nitrogen_kg_ha}
                  onChange={(e) => setNewSample({ ...newSample, nitrogen_kg_ha: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Phosphorus (kg/ha)</label>
                <input
                  type="number"
                  required
                  value={newSample.phosphorus_kg_ha}
                  onChange={(e) => setNewSample({ ...newSample, phosphorus_kg_ha: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Potassium (kg/ha)</label>
                <input
                  type="number"
                  required
                  value={newSample.potassium_kg_ha}
                  onChange={(e) => setNewSample({ ...newSample, potassium_kg_ha: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Organic Carbon (%)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newSample.organic_carbon_pct}
                  onChange={(e) => setNewSample({ ...newSample, organic_carbon_pct: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/25"
              >
                Save Record to MongoDB
              </button>
            </div>
          </form>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Benchmark Soil pH</span>
          <p className="text-2xl font-black text-slate-900 mt-2">6.5 - 7.5</p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">Neutral / Highly Productive</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Target N:P:K Balance</span>
          <p className="text-2xl font-black text-slate-900 mt-2">4 : 2 : 1</p>
          <p className="text-xs text-slate-500 mt-1">ICAR Agronomic Standard</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Organic Carbon Target</span>
          <p className="text-2xl font-black text-emerald-600 mt-2">&gt; 0.75 %</p>
          <p className="text-xs text-slate-500 mt-1">Fertile Soil Threshold</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Samples Tested</span>
          <p className="text-2xl font-black text-amber-600 mt-2">3,500+</p>
          <p className="text-xs text-slate-500 mt-1">Parquet Data Lakehouse</p>
        </div>
      </div>

      {/* Table of Soil Health Records */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold text-slate-900">Soil Health Test Card Registry</h3>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search district or state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-6">Sample ID</th>
                <th className="py-3 px-6">Location</th>
                <th className="py-3 px-6">Soil Type</th>
                <th className="py-3 px-6">N - P - K (kg/ha)</th>
                <th className="py-3 px-6">Soil pH</th>
                <th className="py-3 px-6">Organic Carbon</th>
                <th className="py-3 px-6">Health Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.slice(0, 25).map((r, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-6 font-mono font-bold text-slate-900">{r.Sample_ID}</td>
                  <td className="py-3 px-6 font-semibold">{r.District}, {r.State}</td>
                  <td className="py-3 px-6">{r.Soil_Type}</td>
                  <td className="py-3 px-6 font-mono font-semibold">
                    {Math.round(r.Nitrogen_kg_ha)} - {Math.round(r.Phosphorus_kg_ha)} - {Math.round(r.Potassium_kg_ha)}
                  </td>
                  <td className="py-3 px-6 font-bold">{r.Soil_pH}</td>
                  <td className="py-3 px-6">{r.Organic_Carbon_pct}%</td>
                  <td className="py-3 px-6">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      r.Health_Status === 'Optimal' ? 'bg-emerald-100 text-emerald-800' :
                      r.Health_Status === 'Nutrient Deficient' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {r.Health_Status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
