import React, { useState } from 'react';
import {
  ShieldAlert,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Leaf,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { api } from '../services/api';

export const DiseaseDetectionPage: React.FC = () => {
  const [crop, setCrop] = useState('Potato');
  const [symptom, setSymptom] = useState('Dark water-soaked lesions and white mould on leaves');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDiagnose = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append('crop', crop);
        formData.append('symptoms', symptom);
        formData.append('file', selectedFile);
        const res = await api.diagnoseDisease({ crop, symptom_description: symptom });
        setResult(res.data);
      } else {
        const res = await api.diagnoseDisease({ crop, symptom_description: symptom });
        setResult(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-800 via-rose-900 to-slate-950 text-white p-8 rounded-3xl shadow-xl">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/30 uppercase tracking-wider">
          Computer Vision & Plant Pathology
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight mt-2">Plant Disease Diagnosis & Treatment</h1>
        <p className="text-rose-100 text-sm mt-1 max-w-2xl leading-relaxed">
          Identifies fungal, bacterial, and viral foliar diseases across Potato, Tomato, Rice, Maize, and Apple crops, delivering integrated pest management (IPM) chemical and organic treatment protocols.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Upload / Form */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-rose-600" /> Upload Infected Leaf / Describe Symptoms
          </h2>

          <form onSubmit={handleDiagnose} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Select Crop</label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-rose-500"
              >
                <option value="Potato">Potato (Solanum tuberosum)</option>
                <option value="Tomato">Tomato (Solanum lycopersicum)</option>
                <option value="Rice">Rice (Oryza sativa)</option>
              </select>
            </div>

            {/* Image Upload Box */}
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-rose-400 transition bg-slate-50/50">
              {previewUrl ? (
                <div className="space-y-2">
                  <img src={previewUrl} alt="Leaf Preview" className="h-40 mx-auto rounded-xl object-cover shadow-sm" />
                  <p className="text-xs text-slate-500 font-semibold">{selectedFile?.name}</p>
                </div>
              ) : (
                <div>
                  <Leaf className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="text-xs font-bold text-slate-700">Drag leaf image or click to browse</p>
                  <p className="text-[11px] text-slate-400 mt-1">PNG, JPG or JPEG up to 10MB</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="leaf-upload"
              />
              <label
                htmlFor="leaf-upload"
                className="mt-3 inline-block px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer transition"
              >
                {previewUrl ? 'Change Image' : 'Select Image'}
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Visual Symptoms Observed
              </label>
              <textarea
                rows={3}
                value={symptom}
                onChange={(e) => setSymptom(e.target.value)}
                placeholder="Describe leaf spots, color changes, chlorosis, or wilting..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500 font-medium text-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm transition shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2"
            >
              {loading ? 'Analyzing Pathology...' : 'Run Disease Diagnosis'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Diagnosis Results */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" /> Pathology Diagnostic Report
            </h2>

            {result ? (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">Identified Disease</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold">
                      {result.confidence_score}% Confidence
                    </span>
                  </div>
                  <p className="text-xl font-extrabold text-rose-950 mt-1">{result.detected_disease}</p>
                  <p className="text-xs text-rose-800 mt-1">{result.symptoms}</p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
                  <p className="font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Organic & Bio-Control Treatment:
                  </p>
                  <p className="text-emerald-800 leading-relaxed">{result.organic_treatment}</p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs">
                  <p className="font-bold text-blue-900 mb-1 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-blue-600" /> Chemical Fungicide Protocol:
                  </p>
                  <p className="text-blue-800 leading-relaxed">{result.chemical_treatment}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600">
                  <p className="font-bold text-slate-800 mb-0.5">Cultural Prevention:</p>
                  <p>{result.prevention}</p>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400">
                <ShieldAlert className="w-12 h-12 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
                <p className="text-sm font-semibold text-slate-600">No diagnosis performed yet</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Upload an infected leaf photograph or enter observed symptoms.</p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center font-mono">
            Diagnostic Engine: ICAR Integrated Pest Management (IPM) Standard
          </div>
        </div>
      </div>
    </div>
  );
};
