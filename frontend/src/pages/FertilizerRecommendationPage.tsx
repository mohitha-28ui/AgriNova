import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FlaskConical,
  Scale,
  Calendar,
  Layers,
  Plus,
  Trash2,
  Edit2,
  X,
  RefreshCw,
  Search,
  BookOpen,
  User,
  History
} from 'lucide-react';
import { api } from '../services/api';

export const FertilizerRecommendationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'recommend' | 'catalog' | 'history'>('recommend');

  // RECOMMENDATION FORM
  const [formData, setFormData] = useState({
    user_id: 1,
    crop_name: 'Wheat',
    soil_type: 'Alluvial Loam',
    nitrogen: 85.0,
    phosphorus: 44.0,
    potassium: 48.0,
    ph_level: 6.8
  });

  const [recommendationResult, setRecommendationResult] = useState<any>(null);
  const [loadingRec, setLoadingRec] = useState(false);
  const [recError, setRecError] = useState('');

  // CATALOG & HISTORY
  const [fertilizers, setFertilizers] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFert, setEditingFert] = useState<any | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [newFert, setNewFert] = useState({
    fertilizer_name: '',
    description: '',
    application_guide: '',
    npk_ratio: '4:2:1',
    suitable_crops: 'Wheat, Rice, Maize'
  });

  const crops = ['Wheat', 'Rice', 'Maize', 'Cotton', 'Sugarcane', 'Soybean', 'Mustard', 'Chilli', 'Potato'];

  const loadAllData = async () => {
    setLoadingData(true);
    try {
      const [fRes, rRes, uRes] = await Promise.all([
        api.getSqlFertilizers(),
        api.getSqlRecommendations(),
        api.getSqlUsers()
      ]);
      setFertilizers(fRes.data || []);
      setRecommendations(rRes.data || []);
      setUsers(uRes.data || []);
      if (uRes.data?.length > 0 && !formData.user_id) {
        setFormData(prev => ({ ...prev, user_id: uRes.data[0].user_id }));
      }
    } catch (e: any) {
      console.error(e);
      setErrorMsg('Failed to load fertilizer records.');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleRecommendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingRec(true);
    setRecError('');
    try {
      const res = await api.recommendSqlFertilizer(formData);
      setRecommendationResult(res.data);
      setSuccessMsg('Agronomic fertilizer recommendation generated and persisted into database!');
      await loadAllData();
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      setRecError(err.response?.data?.detail || 'Error running recommendation engine.');
    } finally {
      setLoadingRec(false);
    }
  };

  const handleCreateFertilizer = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      await api.createSqlFertilizer(newFert);
      setSuccessMsg(`Fertilizer product '${newFert.fertilizer_name}' registered!`);
      setShowAddModal(false);
      setNewFert({
        fertilizer_name: '',
        description: '',
        application_guide: '',
        npk_ratio: '4:2:1',
        suitable_crops: 'Wheat, Rice, Maize'
      });
      await loadAllData();
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (e: any) {
      setErrorMsg(e.response?.data?.detail || 'Error registering fertilizer');
    }
  };

  const handleUpdateFertilizer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFert) return;
    setErrorMsg(null);
    try {
      await api.updateSqlFertilizer(editingFert.fertilizer_id, {
        fertilizer_name: editingFert.fertilizer_name,
        description: editingFert.description,
        application_guide: editingFert.application_guide,
        npk_ratio: editingFert.npk_ratio,
        suitable_crops: editingFert.suitable_crops
      });
      setSuccessMsg(`Fertilizer #${editingFert.fertilizer_id} updated successfully!`);
      setEditingFert(null);
      await loadAllData();
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (e: any) {
      setErrorMsg(e.response?.data?.detail || 'Error updating fertilizer');
    }
  };

  const handleDeleteFertilizer = async (fertId: number, name: string) => {
    if (!window.confirm(`Delete fertilizer product '${name}' (#${fertId})?`)) return;
    try {
      await api.deleteSqlFertilizer(fertId);
      setSuccessMsg(`Fertilizer '${name}' deleted.`);
      await loadAllData();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (e: any) {
      setErrorMsg(e.response?.data?.detail || 'Error deleting fertilizer');
    }
  };

  return (
    <div className="max-w-[1500px] mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-[#092218] text-white p-6 md:p-8 rounded-2xl border border-[#143e2e] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]"></span>
            <span className="text-[11px] font-bold text-[#86efac] uppercase tracking-wider">
              Module 5 – Relational SQL Fertilizer Intelligence
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
            Fertilizer Recommendation & Catalog
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Calculates NPK replenishment protocols, manages commercial fertilizer stock in <code className="bg-[#143e2e] px-1.5 py-0.5 rounded text-[#86efac]">fertilizers</code>, and logs recommendations in <code className="bg-[#143e2e] px-1.5 py-0.5 rounded text-[#86efac]">recommendations</code>.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-[#143e2e] p-1.5 rounded-xl border border-[#1b523c]">
          <button
            onClick={() => setActiveTab('recommend')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${activeTab === 'recommend' ? 'bg-[#16a34a] text-white shadow-sm' : 'text-slate-300 hover:text-white'}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Dosage Recommender
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${activeTab === 'catalog' ? 'bg-[#16a34a] text-white shadow-sm' : 'text-slate-300 hover:text-white'}`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Fertilizer Catalog ({fertilizers.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${activeTab === 'history' ? 'bg-[#16a34a] text-white shadow-sm' : 'text-slate-300 hover:text-white'}`}
          >
            <History className="w-3.5 h-3.5" />
            History ({recommendations.length})
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

      {/* TAB 1: RECOMMENDATION ENGINE */}
      {activeTab === 'recommend' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-[#16a34a]" />
              <span>Input Soil Telemetry & Crop Requirements</span>
            </h2>

            {recError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> {recError}
              </div>
            )}

            <form onSubmit={handleRecommendSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Farmer (FK)</label>
                  <select
                    value={formData.user_id}
                    onChange={(e) => setFormData({ ...formData, user_id: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  >
                    {users.map(u => (
                      <option key={u.user_id} value={u.user_id}>{u.name} (ID #{u.user_id})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Crop</label>
                  <select
                    value={formData.crop_name}
                    onChange={(e) => setFormData({ ...formData, crop_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  >
                    {crops.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Soil Type</label>
                  <select
                    value={formData.soil_type}
                    onChange={(e) => setFormData({ ...formData, soil_type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  >
                    <option value="Alluvial Loam">Alluvial Loam</option>
                    <option value="Black Soil">Black Soil</option>
                    <option value="Clayey Loam">Clayey Loam</option>
                    <option value="Red Sandy Loam">Red Sandy Loam</option>
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
                    value={formData.ph_level}
                    onChange={(e) => setFormData({ ...formData, ph_level: parseFloat(e.target.value) || 7.0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Available N</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.nitrogen}
                    onChange={(e) => setFormData({ ...formData, nitrogen: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  />
                  <span className="text-[10px] text-slate-400">kg/ha</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Available P</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.phosphorus}
                    onChange={(e) => setFormData({ ...formData, phosphorus: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  />
                  <span className="text-[10px] text-slate-400">kg/ha</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Available K</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.potassium}
                    onChange={(e) => setFormData({ ...formData, potassium: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  />
                  <span className="text-[10px] text-slate-400">kg/ha</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loadingRec}
                className="w-full mt-4 py-3 px-4 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loadingRec ? 'Computing Agronomic Protocol...' : 'Calculate Optimal Fertilizer Dosage & Persist'}</span>
              </button>
            </form>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-5 space-y-4">
            {recommendationResult ? (
              <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Recommended Fertilizer</span>
                  <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Persisted (Rec #{recommendationResult.recommendation_id})
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {recommendationResult.recommended_fertilizer?.fertilizer_name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    {recommendationResult.recommended_fertilizer?.description}
                  </p>
                </div>

                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100 text-xs">
                  <span className="font-bold text-emerald-900 block mb-1">Application Protocol:</span>
                  <p className="text-emerald-800 text-[11px] leading-relaxed">
                    {recommendationResult.recommended_fertilizer?.application_guide}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <span className="font-bold text-slate-700 block mb-1">Agronomic Notes:</span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {recommendationResult.recommendation_notes}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 block font-bold">N Status</span>
                    <span className="font-black text-slate-800">{recommendationResult.npk_status?.n_status}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 block font-bold">P Status</span>
                    <span className="font-black text-slate-800">{recommendationResult.npk_status?.p_status}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 block font-bold">K Status</span>
                    <span className="font-black text-slate-800">{recommendationResult.npk_status?.k_status}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400">
                <Sparkles className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p className="text-xs font-semibold text-slate-600">No recommendation computed yet</p>
                <p className="text-[11px] text-slate-400 mt-1">Specify target crop and available NPK to generate application recommendations.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: FERTILIZER CATALOG (fertilizers table CRUD) */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Commercial Fertilizer Database (fertilizers table)</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Fertilizer Product
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fertilizers.map((f) => (
              <div key={f.fertilizer_id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#16a34a] font-bold text-[10px] border border-emerald-200">
                      NPK {f.npk_ratio || 'Balanced'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">ID #{f.fertilizer_id}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-2">{f.fertilizer_name}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{f.description}</p>

                  <div className="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600">
                    <strong className="text-slate-700 block mb-0.5">Application Guide:</strong>
                    {f.application_guide}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-4 border-t border-slate-100 text-xs">
                  <span className="text-[10px] font-semibold text-slate-400 truncate max-w-[150px]">
                    Crops: {f.suitable_crops}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingFert(f)}
                      className="p-1 rounded-md text-slate-500 hover:text-[#16a34a] hover:bg-emerald-50"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteFertilizer(f.fertilizer_id, f.fertilizer_name)}
                      className="p-1 rounded-md text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RECOMMENDATION HISTORY (recommendations table) */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Recommendation Audit Log (recommendations table)</h3>
              <p className="text-[11px] text-slate-400">Saved agronomic prescriptions with joined farmer, crop, and soil details</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">Rec ID</th>
                  <th className="px-5 py-3">Farmer</th>
                  <th className="px-5 py-3">Crop Target</th>
                  <th className="px-5 py-3">Soil Type</th>
                  <th className="px-5 py-3">Fertilizer Prescribed</th>
                  <th className="px-5 py-3">Application Guide</th>
                  <th className="px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {recommendations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                      No past recommendations stored.
                    </td>
                  </tr>
                ) : (
                  recommendations.map((r) => (
                    <tr key={r.recommendation_id} className="hover:bg-slate-50/60 transition">
                      <td className="px-5 py-3.5 font-bold text-slate-900">#{r.recommendation_id}</td>
                      <td className="px-5 py-3.5 text-slate-800 font-semibold">
                        {r.farmer_name || 'Farmer'}
                      </td>
                      <td className="px-5 py-3.5 font-bold text-[#16a34a]">
                        {r.crop_name || 'Wheat'}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">
                        {r.soil_type || 'Alluvial'} (pH {r.ph_level || '6.8'})
                      </td>
                      <td className="px-5 py-3.5 font-bold text-slate-900">
                        {r.fertilizer_name || 'Urea'}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 max-w-xs truncate">
                        {r.application_guide || r.recommendation_notes}
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 text-[11px]">
                        {r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Active'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE FERTILIZER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Add Fertilizer Product</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFertilizer} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Fertilizer Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zinc Sulphate Monohydrate 33%"
                  value={newFert.fertilizer_name}
                  onChange={(e) => setNewFert({ ...newFert, fertilizer_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NPK Ratio</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 19:19:19"
                    value={newFert.npk_ratio}
                    onChange={(e) => setNewFert({ ...newFert, npk_ratio: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Suitable Crops</label>
                  <input
                    type="text"
                    placeholder="Wheat, Paddy, Chilli"
                    value={newFert.suitable_crops}
                    onChange={(e) => setNewFert({ ...newFert, suitable_crops: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Primary nutritional function..."
                  value={newFert.description}
                  onChange={(e) => setNewFert({ ...newFert, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Application Guide</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Dosage and timing..."
                  value={newFert.application_guide}
                  onChange={(e) => setNewFert({ ...newFert, application_guide: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                />
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
                  Save Fertilizer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT FERTILIZER MODAL */}
      {editingFert && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Edit Fertilizer #{editingFert.fertilizer_id}</h3>
              <button onClick={() => setEditingFert(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateFertilizer} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Fertilizer Name</label>
                <input
                  type="text"
                  required
                  value={editingFert.fertilizer_name}
                  onChange={(e) => setEditingFert({ ...editingFert, fertilizer_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NPK Ratio</label>
                  <input
                    type="text"
                    required
                    value={editingFert.npk_ratio}
                    onChange={(e) => setEditingFert({ ...editingFert, npk_ratio: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Suitable Crops</label>
                  <input
                    type="text"
                    value={editingFert.suitable_crops}
                    onChange={(e) => setEditingFert({ ...editingFert, suitable_crops: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={editingFert.description}
                  onChange={(e) => setEditingFert({ ...editingFert, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Application Guide</label>
                <textarea
                  rows={2}
                  required
                  value={editingFert.application_guide}
                  onChange={(e) => setEditingFert({ ...editingFert, application_guide: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingFert(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold"
                >
                  Update Fertilizer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
