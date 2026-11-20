import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  RefreshCw,
  Search,
  Activity,
  User,
  Trash2,
  Edit2,
  X,
  Gauge,
  Sliders,
  Filter
} from 'lucide-react';
import { api } from '../services/api';

export const SoilAnalyticsPage: React.FC = () => {
  const [soils, setSoils] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [soilTypeFilter, setSoilTypeFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSoil, setEditingSoil] = useState<any | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [newSoil, setNewSoil] = useState({
    user_id: 1,
    soil_type: 'Alluvial Loam',
    ph_level: 6.8,
    nitrogen: 85.0,
    phosphorus: 44.0,
    potassium: 48.0
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [sRes, uRes] = await Promise.all([
        api.getSqlSoil(),
        api.getSqlUsers()
      ]);
      setSoils(sRes.data || []);
      setUsers(uRes.data || []);
      if (uRes.data && uRes.data.length > 0 && !newSoil.user_id) {
        setNewSoil(prev => ({ ...prev, user_id: uRes.data[0].user_id }));
      }
    } catch (e: any) {
      console.error(e);
      setErrorMsg('Failed to fetch soil data from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateSoil = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      await api.createSqlSoil(newSoil);
      setSuccessMsg('Soil telemetry sample registered successfully!');
      setShowAddModal(false);
      setNewSoil({
        user_id: users[0]?.user_id || 1,
        soil_type: 'Alluvial Loam',
        ph_level: 6.8,
        nitrogen: 85.0,
        phosphorus: 44.0,
        potassium: 48.0
      });
      await loadData();
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (e: any) {
      setErrorMsg(e.response?.data?.detail || 'Error saving soil sample');
    }
  };

  const handleUpdateSoil = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSoil) return;
    setErrorMsg(null);
    try {
      await api.updateSqlSoil(editingSoil.soil_id, {
        soil_type: editingSoil.soil_type,
        ph_level: parseFloat(editingSoil.ph_level),
        nitrogen: parseFloat(editingSoil.nitrogen),
        phosphorus: parseFloat(editingSoil.phosphorus),
        potassium: parseFloat(editingSoil.potassium)
      });
      setSuccessMsg(`Soil record #${editingSoil.soil_id} updated successfully!`);
      setEditingSoil(null);
      await loadData();
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (e: any) {
      setErrorMsg(e.response?.data?.detail || 'Error updating soil record');
    }
  };

  const handleDeleteSoil = async (soilId: number) => {
    if (!window.confirm(`Delete soil telemetry record #${soilId} from database?`)) return;
    try {
      await api.deleteSqlSoil(soilId);
      setSuccessMsg(`Soil record #${soilId} deleted.`);
      await loadData();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (e: any) {
      setErrorMsg(e.response?.data?.detail || 'Error deleting soil record');
    }
  };

  const filteredSoils = soils.filter(s => {
    const matchesSearch = s.soil_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.farmer_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = soilTypeFilter === 'ALL' || s.soil_type?.toLowerCase().includes(soilTypeFilter.toLowerCase());
    return matchesSearch && matchesType;
  });

  // Aggregates
  const meanPh = soils.length ? (soils.reduce((a, b) => a + parseFloat(b.ph_level || 7), 0) / soils.length).toFixed(1) : '7.0';
  const meanN = soils.length ? (soils.reduce((a, b) => a + parseFloat(b.nitrogen || 0), 0) / soils.length).toFixed(0) : '80';
  const meanP = soils.length ? (soils.reduce((a, b) => a + parseFloat(b.phosphorus || 0), 0) / soils.length).toFixed(0) : '40';
  const meanK = soils.length ? (soils.reduce((a, b) => a + parseFloat(b.potassium || 0), 0) / soils.length).toFixed(0) : '50';

  return (
    <div className="space-y-6 max-w-[1500px] mx-auto">
      {/* Top Banner */}
      <div className="bg-[#092218] text-white p-6 md:p-8 rounded-2xl border border-[#143e2e] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]"></span>
            <span className="text-[11px] font-bold text-[#86efac] uppercase tracking-wider">
              Module 3 – Relational SQL Soil Science
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
            Soil Information & Health Analytics
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Live NPK spectrometry, pH balance, and soil health indices backed by <code className="bg-[#143e2e] px-1.5 py-0.5 rounded text-[#86efac]">agrinova_db.soil_details</code> table.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded-xl shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Soil Sample</span>
          </button>
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2.5 rounded-xl bg-[#143e2e] hover:bg-[#1b523c] text-slate-200 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)}><X className="w-4 h-4" /></button>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Agronomic Means Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Soil pH</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{meanPh}</p>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-[#16a34a]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#16a34a]" />
            <span>Neutral / Optimal</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mean Nitrogen (N)</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{meanN} <span className="text-xs font-normal text-slate-400">kg/ha</span></p>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-emerald-600">
            <span>Adequate for Tillering</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mean Phosphorus (P)</span>
          <p className="text-2xl font-black text-blue-600 mt-1">{meanP} <span className="text-xs font-normal text-slate-400">kg/ha</span></p>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-blue-600">
            <span>Root Vigor Baseline</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mean Potassium (K)</span>
          <p className="text-2xl font-black text-purple-600 mt-1">{meanK} <span className="text-xs font-normal text-slate-400">kg/ha</span></p>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-purple-600">
            <span>Resilience & Grain Fill</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search soil type or farmer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Soil Type:</span>
          <select
            value={soilTypeFilter}
            onChange={(e) => setSoilTypeFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
          >
            <option value="ALL">All Soil Types</option>
            <option value="Alluvial">Alluvial Loam</option>
            <option value="Black">Black Soil</option>
            <option value="Clayey">Clayey Loam</option>
            <option value="Red">Red Sandy Loam</option>
          </select>
        </div>
      </div>

      {/* Soil Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Soil Details Registry (soil_details table)</h3>
            <p className="text-[11px] text-slate-400">Showing {filteredSoils.length} tested plots</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Soil ID</th>
                <th className="px-5 py-3">Farmer (FK)</th>
                <th className="px-5 py-3">Soil Type</th>
                <th className="px-5 py-3">pH Level</th>
                <th className="px-5 py-3">Nitrogen (N)</th>
                <th className="px-5 py-3">Phosphorus (P)</th>
                <th className="px-5 py-3">Potassium (K)</th>
                <th className="px-5 py-3">Health Score</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredSoils.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-8 text-center text-slate-400">
                    No soil telemetry records found.
                  </td>
                </tr>
              ) : (
                filteredSoils.map((s) => (
                  <tr key={s.soil_id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-3.5 font-bold text-slate-900">#{s.soil_id}</td>
                    <td className="px-5 py-3.5 text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold">{s.farmer_name || `Farmer #${s.user_id}`}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px] border border-slate-200">
                        {s.soil_type}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-black ${parseFloat(s.ph_level) < 6.0 ? 'text-amber-600' : (parseFloat(s.ph_level) > 7.5 ? 'text-blue-600' : 'text-emerald-600')}`}>
                          {s.ph_level}
                        </span>
                        <span className="text-[10px] text-slate-400">({s.ph_status || 'Optimal'})</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-900 font-bold">
                      {s.nitrogen} <span className="text-[10px] font-normal text-slate-400">kg/ha</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-900 font-bold">
                      {s.phosphorus} <span className="text-[10px] font-normal text-slate-400">kg/ha</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-900 font-bold">
                      {s.potassium} <span className="text-[10px] font-normal text-slate-400">kg/ha</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#16a34a] rounded-full"
                            style={{ width: `${Math.min(100, s.soil_health_score || 80)}%` }}
                          ></div>
                        </div>
                        <span className="font-black text-slate-800 text-[11px]">{s.soil_health_score || 82}/100</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingSoil(s)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#16a34a] hover:bg-emerald-50 transition"
                          title="Edit Soil Record"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSoil(s.soil_id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Delete Soil Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE SOIL MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Log New Soil Sample</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSoil} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Farmer (FK)</label>
                <select
                  value={newSoil.user_id}
                  onChange={(e) => setNewSoil({ ...newSoil, user_id: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                >
                  {users.map(u => (
                    <option key={u.user_id} value={u.user_id}>{u.name} (ID #{u.user_id})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Soil Type</label>
                  <select
                    value={newSoil.soil_type}
                    onChange={(e) => setNewSoil({ ...newSoil, soil_type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  >
                    <option value="Alluvial Loam">Alluvial Loam</option>
                    <option value="Black Soil">Black Soil</option>
                    <option value="Clayey Loam">Clayey Loam</option>
                    <option value="Red Sandy Loam">Red Sandy Loam</option>
                    <option value="Laterite">Laterite</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Soil pH (0 - 14)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="3.0"
                    max="10.0"
                    required
                    value={newSoil.ph_level}
                    onChange={(e) => setNewSoil({ ...newSoil, ph_level: parseFloat(e.target.value) || 7.0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nitrogen (N)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newSoil.nitrogen}
                    onChange={(e) => setNewSoil({ ...newSoil, nitrogen: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  />
                  <span className="text-[9px] text-slate-400">kg/ha</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phosphorus (P)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newSoil.phosphorus}
                    onChange={(e) => setNewSoil({ ...newSoil, phosphorus: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  />
                  <span className="text-[9px] text-slate-400">kg/ha</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Potassium (K)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newSoil.potassium}
                    onChange={(e) => setNewSoil({ ...newSoil, potassium: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  />
                  <span className="text-[9px] text-slate-400">kg/ha</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold"
                >
                  Save Soil Sample
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT SOIL MODAL */}
      {editingSoil && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Edit Soil Record #{editingSoil.soil_id}</h3>
              <button onClick={() => setEditingSoil(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSoil} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Soil Type</label>
                  <input
                    type="text"
                    required
                    value={editingSoil.soil_type}
                    onChange={(e) => setEditingSoil({ ...editingSoil, soil_type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">pH Level</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={editingSoil.ph_level}
                    onChange={(e) => setEditingSoil({ ...editingSoil, ph_level: parseFloat(e.target.value) || 7.0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nitrogen</label>
                  <input
                    type="number"
                    required
                    value={editingSoil.nitrogen}
                    onChange={(e) => setEditingSoil({ ...editingSoil, nitrogen: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phosphorus</label>
                  <input
                    type="number"
                    required
                    value={editingSoil.phosphorus}
                    onChange={(e) => setEditingSoil({ ...editingSoil, phosphorus: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Potassium</label>
                  <input
                    type="number"
                    required
                    value={editingSoil.potassium}
                    onChange={(e) => setEditingSoil({ ...editingSoil, potassium: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingSoil(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold"
                >
                  Update Soil Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
