import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Leaf,
  Sparkles,
  ArrowRight,
  Info,
  Plus,
  Trash2,
  Edit2,
  X,
  RefreshCw,
  Search,
  BookOpen,
  History,
  FileCheck,
  Activity
} from 'lucide-react';
import { api } from '../services/api';

export const DiseaseDetectionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'diagnose' | 'catalog' | 'history'>('diagnose');

  // DIAGNOSE FORM STATE
  const [crop, setCrop] = useState('Wheat');
  const [symptomNotes, setSymptomNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<any>(null);
  const [diagnosing, setDiagnosing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // DISEASES DATABASE & CRUD
  const [diseases, setDiseases] = useState<any[]>([]);
  const [historyLogs, setHistoryLogs] = useState<any[]>([]);
  const [loadingDiseases, setLoadingDiseases] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDisease, setEditingDisease] = useState<any | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [newDisease, setNewDisease] = useState({
    disease_name: '',
    symptoms: '',
    treatment: '',
    affected_crops: 'Wheat, Rice, Tomato',
    confidence_score: 95.0
  });

  const cropsList = ['Wheat', 'Rice (Paddy)', 'Potato', 'Tomato', 'Mustard', 'Cotton', 'Maize'];

  const loadDiseases = async () => {
    setLoadingDiseases(true);
    try {
      const res = await api.getSqlDiseases();
      setDiseases(res.data || []);
    } catch (e: any) {
      console.error(e);
      setErrorMsg('Failed to load SQL disease knowledge base.');
    } finally {
      setLoadingDiseases(false);
    }
  };

  useEffect(() => {
    loadDiseases();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) {
        setUploadError('Invalid format. Please upload JPG, JPEG, PNG, or WEBP.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File size exceeds the 5MB limit. Please upload an optimized leaf photo.');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDiagnose = async (e: React.FormEvent) => {
    e.preventDefault();
    setDiagnosing(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append('crop', crop);
      formData.append('symptom_notes', symptomNotes);
      if (selectedFile) {
        formData.append('file', selectedFile);
      }
      const res = await api.detectSqlDisease(formData);
      setDiagnosisResult(res.data);
      // Append to history
      setHistoryLogs(prev => [res.data, ...prev]);
      setSuccessMsg(`Diagnosis complete: ${res.data.disease_detected}`);
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      setUploadError(err.response?.data?.detail || 'Error running disease detection.');
    } finally {
      setDiagnosing(false);
    }
  };

  const handleCreateDisease = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      await api.createSqlDisease(newDisease);
      setSuccessMsg(`Pathogen '${newDisease.disease_name}' registered in database!`);
      setShowAddModal(false);
      setNewDisease({
        disease_name: '',
        symptoms: '',
        treatment: '',
        affected_crops: 'Wheat, Rice, Tomato',
        confidence_score: 95.0
      });
      await loadDiseases();
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (e: any) {
      setErrorMsg(e.response?.data?.detail || 'Error saving disease entry');
    }
  };

  const handleUpdateDisease = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDisease) return;
    setErrorMsg(null);
    try {
      await api.updateSqlDisease(editingDisease.disease_id, {
        disease_name: editingDisease.disease_name,
        symptoms: editingDisease.symptoms,
        treatment: editingDisease.treatment,
        affected_crops: editingDisease.affected_crops,
        confidence_score: parseFloat(editingDisease.confidence_score)
      });
      setSuccessMsg(`Disease #${editingDisease.disease_id} updated successfully!`);
      setEditingDisease(null);
      await loadDiseases();
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (e: any) {
      setErrorMsg(e.response?.data?.detail || 'Error updating disease entry');
    }
  };

  const handleDeleteDisease = async (diseaseId: number, name: string) => {
    if (!window.confirm(`Delete disease pathogen '${name}' (#${diseaseId})?`)) return;
    try {
      await api.deleteSqlDisease(diseaseId);
      setSuccessMsg(`Disease record #${diseaseId} removed.`);
      await loadDiseases();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (e: any) {
      setErrorMsg(e.response?.data?.detail || 'Error deleting disease record');
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
              Module 6 – Plant Pathology & Computer Vision
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
            Plant Disease Detection & Pathology Registry
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Image diagnostic matching against <code className="bg-[#143e2e] px-1.5 py-0.5 rounded text-[#86efac]">agrinova_db.diseases</code> with IPM chemical treatment protocols and leaf inspection history.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-[#143e2e] p-1.5 rounded-xl border border-[#1b523c]">
          <button
            onClick={() => setActiveTab('diagnose')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${activeTab === 'diagnose' ? 'bg-[#16a34a] text-white shadow-sm' : 'text-slate-300 hover:text-white'}`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Leaf Diagnosis
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${activeTab === 'catalog' ? 'bg-[#16a34a] text-white shadow-sm' : 'text-slate-300 hover:text-white'}`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Disease Database ({diseases.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${activeTab === 'history' ? 'bg-[#16a34a] text-white shadow-sm' : 'text-slate-300 hover:text-white'}`}
          >
            <History className="w-3.5 h-3.5" />
            Recent Scans ({historyLogs.length})
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

      {/* TAB 1: DIAGNOSE LEAF */}
      {activeTab === 'diagnose' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#16a34a]" />
              <span>Upload Leaf Specimen / Symptom Notes</span>
            </h2>

            {uploadError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {uploadError}
              </div>
            )}

            <form onSubmit={handleDiagnose} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Host Crop Species</label>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                >
                  {cropsList.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Leaf Image Upload Dropzone */}
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-[#16a34a] transition bg-slate-50/50 relative">
                {previewUrl ? (
                  <div className="space-y-2">
                    <img src={previewUrl} alt="Leaf Preview" className="h-44 mx-auto rounded-xl object-cover shadow-sm border border-slate-200" />
                    <p className="text-xs text-slate-700 font-bold">{selectedFile?.name}</p>
                    <p className="text-[10px] text-slate-400">{(selectedFile ? selectedFile.size / 1024 : 0).toFixed(1)} KB • Validated format</p>
                    <button
                      type="button"
                      onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                      className="text-rose-600 text-[11px] font-bold hover:underline"
                    >
                      Remove image
                    </button>
                  </div>
                ) : (
                  <div>
                    <Leaf className="w-10 h-10 mx-auto text-emerald-500 mb-2 opacity-80" />
                    <p className="text-xs font-bold text-slate-700">Drag leaf photograph or click to select</p>
                    <p className="text-[11px] text-slate-400 mt-1">Accepts JPG, JPEG, PNG, WEBP (Max: 5MB)</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={!!previewUrl}
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Observed Symptoms / Lesions (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Yellow stripe rust streaks on leaves, powdery white mildew, dark water-soaked spots..."
                  value={symptomNotes}
                  onChange={(e) => setSymptomNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={diagnosing}
                className="w-full mt-2 py-3 px-4 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{diagnosing ? 'Analyzing Specimen & Cross-Referencing SQL Pathogens...' : 'Run Automated Disease Diagnosis'}</span>
              </button>
            </form>
          </div>

          {/* Diagnostic Result */}
          <div className="lg:col-span-6 space-y-4">
            {diagnosisResult ? (
              <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-rose-100">
                  <span className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    Pathology Diagnosis Report
                  </span>
                  <span className="text-[10px] font-black bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full">
                    {diagnosisResult.confidence_pct}% Confidence Match
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    {diagnosisResult.disease_detected}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Identified on {diagnosisResult.crop} specimen</p>
                </div>

                <div className="p-3.5 bg-rose-50/70 rounded-xl border border-rose-100 text-xs">
                  <span className="font-bold text-rose-900 block mb-1">Pathological Symptoms:</span>
                  <p className="text-rose-800 text-[11px] leading-relaxed">
                    {diagnosisResult.symptoms}
                  </p>
                </div>

                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100 text-xs">
                  <span className="font-bold text-emerald-900 block mb-1">Recommended Treatment & IPM Protocol:</span>
                  <p className="text-emerald-800 text-[11px] leading-relaxed">
                    {diagnosisResult.treatment}
                  </p>
                </div>

                {diagnosisResult.file_details?.filename && (
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Validated specimen: <strong>{diagnosisResult.file_details.filename}</strong> ({(diagnosisResult.file_details.size_bytes / 1024).toFixed(1)} KB)</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400">
                <ShieldAlert className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p className="text-xs font-semibold text-slate-600">No diagnostic scan executed yet</p>
                <p className="text-[11px] text-slate-400 mt-1">Upload a leaf specimen photograph or select crop to query plant pathology knowledge base.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: DISEASE DATABASE (diseases table CRUD) */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Pathology Knowledge Base (diseases table)</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Disease Pathogen
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {diseases.map((d) => (
              <div key={d.disease_id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold text-[10px] border border-rose-200">
                      ID #{d.disease_id}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">Score: {d.confidence_score}%</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-2">{d.disease_name}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2"><strong>Symptoms:</strong> {d.symptoms}</p>

                  <div className="mt-3 p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 text-[11px] text-emerald-800">
                    <strong className="text-emerald-950 block mb-0.5">Treatment:</strong>
                    {d.treatment}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-4 border-t border-slate-100 text-xs">
                  <span className="text-[10px] font-semibold text-slate-400 truncate max-w-[150px]">
                    Crops: {d.affected_crops}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingDisease(d)}
                      className="p-1 rounded-md text-slate-500 hover:text-[#16a34a] hover:bg-emerald-50"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteDisease(d.disease_id, d.disease_name)}
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

      {/* TAB 3: RECENT SCANS AUDIT LOG */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Diagnosis History</h3>
            <span className="text-xs font-semibold text-slate-400">{historyLogs.length} scans performed</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {historyLogs.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                No scans recorded in this session.
              </div>
            ) : (
              historyLogs.map((log, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{log.disease_detected}</p>
                      <p className="text-[11px] text-slate-500">Crop: {log.crop} • Specimen: {log.file_details?.filename || 'Sensor query'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-emerald-600">{log.confidence_pct}% match</span>
                    <p className="text-[10px] text-slate-400">{log.timestamp}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ADD DISEASE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Add Disease to Database</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDisease} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pathogen Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bacterial Leaf Blight (Xanthomonas oryzae)"
                  value={newDisease.disease_name}
                  onChange={(e) => setNewDisease({ ...newDisease, disease_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Affected Crops</label>
                <input
                  type="text"
                  placeholder="Wheat, Rice, Tomato"
                  value={newDisease.affected_crops}
                  onChange={(e) => setNewDisease({ ...newDisease, affected_crops: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinical Symptoms</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Lesion morphology, color changes, chlorosis..."
                  value={newDisease.symptoms}
                  onChange={(e) => setNewDisease({ ...newDisease, symptoms: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Treatment & IPM Protocol</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Chemical spray dosage, bactericide/fungicide name..."
                  value={newDisease.treatment}
                  onChange={(e) => setNewDisease({ ...newDisease, treatment: e.target.value })}
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
                  Save Disease Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT DISEASE MODAL */}
      {editingDisease && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Edit Disease #{editingDisease.disease_id}</h3>
              <button onClick={() => setEditingDisease(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateDisease} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pathogen Name</label>
                <input
                  type="text"
                  required
                  value={editingDisease.disease_name}
                  onChange={(e) => setEditingDisease({ ...editingDisease, disease_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Affected Crops</label>
                <input
                  type="text"
                  value={editingDisease.affected_crops}
                  onChange={(e) => setEditingDisease({ ...editingDisease, affected_crops: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Symptoms</label>
                <textarea
                  rows={2}
                  required
                  value={editingDisease.symptoms}
                  onChange={(e) => setEditingDisease({ ...editingDisease, symptoms: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Treatment</label>
                <textarea
                  rows={2}
                  required
                  value={editingDisease.treatment}
                  onChange={(e) => setEditingDisease({ ...editingDisease, treatment: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingDisease(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold"
                >
                  Update Disease Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
