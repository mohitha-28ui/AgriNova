import React, { useState, useEffect } from 'react';
import {
  Sprout,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FlaskConical,
  CloudSun,
  Droplets,
  Layers,
  Info,
  ShieldCheck,
  Plus,
  Trash2,
  Edit2,
  Search,
  Filter,
  User,
  MapPin,
  Calendar,
  X,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';

export const CropRecommendationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'management' | 'ai'>('management');

  // CROP MANAGEMENT STATE (SQL Module 2)
  const [crops, setCrops] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingCrops, setLoadingCrops] = useState(true);
  const [searchCrop, setSearchCrop] = useState('');
  const [seasonFilter, setSeasonFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCrop, setEditingCrop] = useState<any | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [newCrop, setNewCrop] = useState({
    user_id: 1,
    crop_name: '',
    season: 'Kharif',
    area: 5.0
  });

  // AI RECOMMENDATION STATE
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

  const loadCropsData = async () => {
    setLoadingCrops(true);
    try {
      const [cropsRes, usersRes] = await Promise.all([
        api.getSqlCrops(),
        api.getSqlUsers()
      ]);
      setCrops(cropsRes.data || []);
      setUsers(usersRes.data || []);
      if (usersRes.data && usersRes.data.length > 0 && !newCrop.user_id) {
        setNewCrop(prev => ({ ...prev, user_id: usersRes.data[0].user_id }));
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Failed to load SQL crop records.');
    } finally {
      setLoadingCrops(false);
    }
  };

  useEffect(() => {
    loadCropsData();
  }, []);

  const handleCreateCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      await api.createSqlCrop(newCrop);
      setSuccessMsg(`Crop '${newCrop.crop_name}' registered successfully!`);
      setShowAddModal(false);
      setNewCrop({
        user_id: users[0]?.user_id || 1,
        crop_name: '',
        season: 'Kharif',
        area: 5.0
      });
      await loadCropsData();
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Error registering crop record');
    }
  };

  const handleUpdateCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCrop) return;
    setErrorMsg(null);
    try {
      await api.updateSqlCrop(editingCrop.crop_id, {
        crop_name: editingCrop.crop_name,
        season: editingCrop.season,
        area: parseFloat(editingCrop.area)
      });
      setSuccessMsg(`Crop #${editingCrop.crop_id} updated successfully!`);
      setEditingCrop(null);
      await loadCropsData();
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Error updating crop');
    }
  };

  const handleDeleteCrop = async (cropId: number, name: string) => {
    if (!window.confirm(`Delete crop '${name}' (ID #${cropId}) from database?`)) return;
    try {
      await api.deleteSqlCrop(cropId);
      setSuccessMsg(`Crop '${name}' deleted.`);
      await loadCropsData();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Error deleting crop');
    }
  };

  const handleAiSubmit = async (e: React.FormEvent) => {
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
    } else if (preset === 'wheat') {
      setFormData({ N: 85, P: 44, K: 48, temperature: 20.0, humidity: 60.0, ph: 6.8, rainfall: 95.0 });
    }
  };

  const filteredCrops = crops.filter(c => {
    const matchesSearch = c.crop_name?.toLowerCase().includes(searchCrop.toLowerCase()) ||
      c.farmer_name?.toLowerCase().includes(searchCrop.toLowerCase());
    const matchesSeason = seasonFilter === 'ALL' || c.season?.toLowerCase() === seasonFilter.toLowerCase();
    return matchesSearch && matchesSeason;
  });

  const totalArea = crops.reduce((acc, curr) => acc + (parseFloat(curr.area) || 0), 0);

  return (
    <div className="max-w-[1500px] mx-auto space-y-6">
      {/* Top Header Banner */}
      <div className="bg-[#092218] text-white p-6 md:p-8 rounded-2xl border border-[#143e2e] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]"></span>
            <span className="text-[11px] font-bold text-[#86efac] uppercase tracking-wider">
              Module 2 – Relational SQL & AI Intelligence
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
            Crop Management & Recommendation
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Manage cultivated crop inventory in <code className="bg-[#143e2e] px-1.5 py-0.5 rounded text-[#86efac]">agrinova_db.crops</code> and run multi-class Random Forest ML models.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-[#143e2e] p-1.5 rounded-xl border border-[#1b523c]">
          <button
            onClick={() => setActiveTab('management')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${activeTab === 'management' ? 'bg-[#16a34a] text-white shadow-sm' : 'text-slate-300 hover:text-white'}`}
          >
            Crop Management (SQL)
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${activeTab === 'ai' ? 'bg-[#16a34a] text-white shadow-sm' : 'text-slate-300 hover:text-white'}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Recommender
          </button>
        </div>
      </div>

      {/* Alert Messages */}
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
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* TAB 1: CROP MANAGEMENT (SQL CRUD) */}
      {activeTab === 'management' && (
        <div className="space-y-6">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold">Total Cultivated Crops</span>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#16a34a] flex items-center justify-center">
                  <Sprout className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 mt-2">{crops.length}</p>
              <p className="text-[11px] text-slate-400 mt-1">From agrinova_db.crops</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold">Total Cultivated Area</span>
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-blue-600 mt-2">{totalArea.toFixed(1)} <span className="text-xs font-semibold text-slate-400">acres/ha</span></p>
              <p className="text-[11px] text-slate-400 mt-1">Across registered farmer plots</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold">Active Cropping Seasons</span>
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-amber-600 mt-2">Kharif & Rabi</p>
              <p className="text-[11px] text-slate-400 mt-1">Synchronized agricultural calendar</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold">Registered Farmers</span>
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-purple-600 mt-2">{users.length}</p>
              <p className="text-[11px] text-slate-400 mt-1">Linked by foreign keys</p>
            </div>
          </div>

          {/* Action and Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search crop name or farmer..."
                value={searchCrop}
                onChange={(e) => setSearchCrop(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span>Season:</span>
                <select
                  value={seasonFilter}
                  onChange={(e) => setSeasonFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                >
                  <option value="ALL">All Seasons</option>
                  <option value="Kharif">Kharif</option>
                  <option value="Rabi">Rabi</option>
                  <option value="Zaid">Zaid</option>
                  <option value="Annual">Annual</option>
                </select>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold transition shadow-sm ml-auto"
              >
                <Plus className="w-4 h-4" />
                Add New Crop
              </button>
              <button
                onClick={loadCropsData}
                disabled={loadingCrops}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
              >
                <RefreshCw className={`w-4 h-4 ${loadingCrops ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Crops Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Crop Registry (crops table)</h3>
                <p className="text-[11px] text-slate-400">Showing {filteredCrops.length} records</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3">Crop ID</th>
                    <th className="px-5 py-3">Crop Name</th>
                    <th className="px-5 py-3">Season</th>
                    <th className="px-5 py-3">Cultivated Area</th>
                    <th className="px-5 py-3">Assigned Farmer (FK)</th>
                    <th className="px-5 py-3">Location</th>
                    <th className="px-5 py-3">Registered Date</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredCrops.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-5 py-8 text-center text-slate-400">
                        No crop records found.
                      </td>
                    </tr>
                  ) : (
                    filteredCrops.map((c) => (
                      <tr key={c.crop_id} className="hover:bg-slate-50/60 transition">
                        <td className="px-5 py-3.5 font-bold text-slate-900">#{c.crop_id}</td>
                        <td className="px-5 py-3.5 font-bold text-slate-900">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                              <Sprout className="w-4 h-4" />
                            </div>
                            <span>{c.crop_name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${c.season === 'Kharif' ? 'bg-amber-100 text-amber-800' : (c.season === 'Rabi' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800')}`}>
                            {c.season}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 font-bold text-slate-900">
                          {c.area} <span className="text-[11px] font-normal text-slate-400">acres/ha</span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-700">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>{c.farmer_name || `User #${c.user_id}`}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{c.farmer_location || 'Andhra Pradesh'}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-slate-400 text-[11px]">
                          {c.created_at ? new Date(c.created_at).toLocaleDateString() : 'Active'}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingCrop(c)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-[#16a34a] hover:bg-emerald-50 transition"
                              title="Edit Crop"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCrop(c.crop_id, c.crop_name)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Delete Crop"
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
        </div>
      )}

      {/* TAB 2: AI CROP RECOMMENDATION ENGINE */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px] whitespace-nowrap">Load Agronomic Preset:</span>
            <button
              type="button"
              onClick={() => applyPreset('rice')}
              className="px-3 py-1.5 rounded-lg bg-white text-slate-800 font-medium border border-slate-200 hover:border-[#16a34a] transition"
            >
              Paddy / Rice Profile
            </button>
            <button
              type="button"
              onClick={() => applyPreset('maize')}
              className="px-3 py-1.5 rounded-lg bg-white text-slate-800 font-medium border border-slate-200 hover:border-[#16a34a] transition"
            >
              Maize / Corn Profile
            </button>
            <button
              type="button"
              onClick={() => applyPreset('cotton')}
              className="px-3 py-1.5 rounded-lg bg-white text-slate-800 font-medium border border-slate-200 hover:border-[#16a34a] transition"
            >
              Cotton Profile
            </button>
            <button
              type="button"
              onClick={() => applyPreset('wheat')}
              className="px-3 py-1.5 rounded-lg bg-white text-slate-800 font-medium border border-slate-200 hover:border-[#16a34a] transition"
            >
              Wheat Profile
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Form */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-[#16a34a]" />
                <span>Soil Parameters & Weather Observation</span>
              </h2>

              <form onSubmit={handleAiSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Nitrogen (N)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="300"
                      required
                      value={formData.N}
                      onChange={(e) => setFormData({ ...formData, N: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                    />
                    <span className="text-[9px] text-slate-400">kg/ha in soil</span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Phosphorus (P)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="200"
                      required
                      value={formData.P}
                      onChange={(e) => setFormData({ ...formData, P: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                    />
                    <span className="text-[9px] text-slate-400">kg/ha in soil</span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Potassium (K)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="300"
                      required
                      value={formData.K}
                      onChange={(e) => setFormData({ ...formData, K: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                    />
                    <span className="text-[9px] text-slate-400">kg/ha in soil</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Temp (°C)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={formData.temperature}
                      onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Humidity (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={formData.humidity}
                      onChange={(e) => setFormData({ ...formData, humidity: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Soil pH
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={formData.ph}
                      onChange={(e) => setFormData({ ...formData, ph: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Rainfall (mm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={formData.rainfall}
                      onChange={(e) => setFormData({ ...formData, rainfall: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 py-3 px-4 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{loading ? 'Running Random Forest Classification...' : 'Run Crop Recommendation Inference'}</span>
                </button>
              </form>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-5 space-y-4">
              {result ? (
                <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Top Recommendation</span>
                    <span className="text-[11px] font-black bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                      {(result.confidence * 100).toFixed(1)}% Confidence
                    </span>
                  </div>

                  <div className="text-center py-2">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#16a34a] flex items-center justify-center mx-auto mb-2">
                      <Sprout className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 capitalize">{result.recommended_crop}</h3>
                    <p className="text-xs text-slate-500 mt-1">Optimal match for current soil NPK and climate telemetry.</p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                    <p className="font-bold text-slate-700">Model Architecture:</p>
                    <p className="text-[11px] text-slate-500">Random Forest Classifier (100 estimators, Gini criterion, max depth 12)</p>
                  </div>

                  <button
                    onClick={() => {
                      setNewCrop({
                        user_id: users[0]?.user_id || 1,
                        crop_name: result.recommended_crop.charAt(0).toUpperCase() + result.recommended_crop.slice(1),
                        season: 'Kharif',
                        area: 5.0
                      });
                      setActiveTab('management');
                      setShowAddModal(true);
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#092218] hover:bg-[#143e2e] text-white text-xs font-bold transition flex items-center justify-center gap-2"
                  >
                    <span>Register This Crop in SQL Database</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400">
                  <Sprout className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  <p className="text-xs font-semibold text-slate-600">No inference executed yet</p>
                  <p className="text-[11px] text-slate-400 mt-1">Adjust soil parameters and run the model to view predictions.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CREATE CROP MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Add Crop to Database</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCrop} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assign to Farmer (FK)</label>
                <select
                  value={newCrop.user_id}
                  onChange={(e) => setNewCrop({ ...newCrop, user_id: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                >
                  {users.map(u => (
                    <option key={u.user_id} value={u.user_id}>{u.name} (ID #{u.user_id} - {u.location})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Crop Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wheat, Rice, Cotton, Maize"
                  value={newCrop.crop_name}
                  onChange={(e) => setNewCrop({ ...newCrop, crop_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cropping Season</label>
                  <select
                    value={newCrop.season}
                    onChange={(e) => setNewCrop({ ...newCrop, season: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  >
                    <option value="Kharif">Kharif</option>
                    <option value="Rabi">Rabi</option>
                    <option value="Zaid">Zaid</option>
                    <option value="Annual">Annual</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cultivated Area (acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={newCrop.area}
                    onChange={(e) => setNewCrop({ ...newCrop, area: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  />
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
                  Save Crop Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CROP MODAL */}
      {editingCrop && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Edit Crop #{editingCrop.crop_id}</h3>
              <button onClick={() => setEditingCrop(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateCrop} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Crop Name</label>
                <input
                  type="text"
                  required
                  value={editingCrop.crop_name}
                  onChange={(e) => setEditingCrop({ ...editingCrop, crop_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Season</label>
                  <select
                    value={editingCrop.season}
                    onChange={(e) => setEditingCrop({ ...editingCrop, season: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  >
                    <option value="Kharif">Kharif</option>
                    <option value="Rabi">Rabi</option>
                    <option value="Zaid">Zaid</option>
                    <option value="Annual">Annual</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Area (acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={editingCrop.area}
                    onChange={(e) => setEditingCrop({ ...editingCrop, area: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCrop(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold"
                >
                  Update Crop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
