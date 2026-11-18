import React, { useState, useEffect } from 'react';
import {
  Database,
  Cpu,
  Server,
  Radio,
  Play,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Layers,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';

export const BigDataAnalyticsPage: React.FC = () => {
  const [hdfsStatus, setHdfsStatus] = useState<any>(null);
  const [sparkJobs, setSparkJobs] = useState<any[]>([]);
  const [hdfsFiles, setHdfsFiles] = useState<any[]>([]);
  const [executing, setExecuting] = useState(false);
  const [selectedPipeline, setSelectedPipeline] = useState('ALL');
  const [message, setMessage] = useState('');

  const loadData = async () => {
    try {
      const [hRes, sRes, fRes] = await Promise.all([
        api.getHdfsStatus(),
        api.getSparkJobs(),
        api.getHdfsFiles('/agrinova/raw')
      ]);
      setHdfsStatus(hRes.data);
      setSparkJobs(sRes.data || []);
      setHdfsFiles(fRes.data?.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const triggerPipeline = async () => {
    setExecuting(true);
    setMessage('');
    try {
      const res = await api.triggerSparkPipeline(selectedPipeline);
      setMessage(res.data?.message || 'Pipeline executed successfully!');
      await loadData();
    } catch (err: any) {
      setMessage('Execution error: ' + (err.response?.data?.detail || err.message));
    } finally {
      setExecuting(false);
    }
  };

  const syncHdfsDatasets = async () => {
    try {
      const res = await api.syncHdfs();
      setMessage(`Successfully synchronized ${res.data?.count} datasets to HDFS!`);
      await loadData();
    } catch (err) {
      setMessage('Failed to sync HDFS files.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
            Big Data Processing Engine
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-2">AgriNova Big Data Analytics Center</h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
            Directly orchestrates Apache Hadoop HDFS distributed storage, Apache Spark / PySpark 3.5+ ETL transformations, Parquet serialization, and MongoDB application loading.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={syncHdfsDatasets}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
          >
            Sync Raw Datasets to HDFS
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Cluster Status Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">HDFS NameNode</span>
          <p className="text-2xl font-black text-emerald-600 mt-2">{hdfsStatus?.namenode_status || 'ACTIVE'}</p>
          <p className="text-xs text-slate-500 mt-1">{hdfsStatus?.cluster_mode || 'Distributed Storage'}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live DataNodes</span>
          <p className="text-2xl font-black text-slate-800 mt-2">{hdfsStatus?.datanodes_live || 2} Nodes</p>
          <p className="text-xs text-slate-500 mt-1">Replication Factor: 2x</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">PySpark Jobs Executed</span>
          <p className="text-2xl font-black text-blue-600 mt-2">{sparkJobs.length}</p>
          <p className="text-xs text-slate-500 mt-1">All Pipelines Completed</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">HDFS Allocated</span>
          <p className="text-2xl font-black text-slate-800 mt-2">100 GB</p>
          <p className="text-xs text-slate-500 mt-1">Used: {roundMb(hdfsStatus?.capacity_used_bytes)} MB ({hdfsStatus?.used_percent || 0.17}%)</p>
        </div>
      </div>

      {/* Pipeline Trigger Control */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Execute PySpark Distributed Processing Job</h3>
          <p className="text-xs text-slate-500">Reads raw CSVs from HDFS, applies cleaning, schema validation, and saves Parquet</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedPipeline}
            onChange={(e) => setSelectedPipeline(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All 8 Pipelines (Master Suite)</option>
            <option value="CROP_PRODUCTION">Crop Production & Yield Analytics</option>
            <option value="SOIL_HEALTH">Soil Chemistry & Nutrient Profiling</option>
            <option value="WEATHER">Meteorological Rainfall Trends</option>
            <option value="MARKET">Mandi APMC Spot Price Engine</option>
          </select>

          <button
            onClick={triggerPipeline}
            disabled={executing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md shadow-emerald-600/25 flex-shrink-0"
          >
            <Play className={`w-3.5 h-3.5 ${executing ? 'animate-spin' : ''}`} />
            {executing ? 'Processing...' : 'Run Pipeline'}
          </button>
        </div>
      </div>

      {/* Spark Jobs Execution Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-600" /> PySpark Job Execution Log
          </h3>
          <span className="text-xs text-slate-400 font-semibold">{sparkJobs.length} Jobs Total</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-6">Job Name</th>
                <th className="py-3 px-6">Input Records</th>
                <th className="py-3 px-6">Output Records</th>
                <th className="py-3 px-6">Duration</th>
                <th className="py-3 px-6">Target Format</th>
                <th className="py-3 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {sparkJobs.map((j, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-6 font-semibold text-slate-900">
                    <p>{j.job_name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{j.input_hdfs_path}</p>
                  </td>
                  <td className="py-3 px-6 font-mono">{j.input_records?.toLocaleString()}</td>
                  <td className="py-3 px-6 font-mono text-emerald-600 font-semibold">{j.output_records?.toLocaleString()}</td>
                  <td className="py-3 px-6">{j.duration_seconds}s</td>
                  <td className="py-3 px-6">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">Parquet / Mongo</span>
                  </td>
                  <td className="py-3 px-6">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3" /> {j.status}
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

function roundMb(bytes: number = 0) {
  return (bytes / (1024 * 1024)).toFixed(1);
}
