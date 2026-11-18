import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Play,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  RefreshCw,
  Activity,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';

export const SparkMonitoringPage: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const res = await api.getSparkJobs();
      setJobs(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const triggerAll = async () => {
    setRunning(true);
    try {
      await api.triggerSparkPipeline('ALL');
      await loadJobs();
    } catch (e) {
      console.error(e);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-wider">
            In-Memory Processing Cluster
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-2">Apache Spark & PySpark Monitor</h1>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Real-time tracking of distributed PySpark DataFrame operations, partitioning, and Parquet serialization.
          </p>
        </div>

        <button
          onClick={triggerAll}
          disabled={running}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-600/30"
        >
          <Play className={`w-3.5 h-3.5 ${running ? 'animate-spin' : ''}`} />
          {running ? 'Executing Pipelines...' : 'Trigger PySpark Pipelines'}
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Spark Master Status</span>
          <p className="text-2xl font-black text-emerald-600 mt-2">RUNNING</p>
          <p className="text-xs text-slate-500 mt-1">Port 7077 / UI Port 8080</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Completed Jobs</span>
          <p className="text-2xl font-black text-slate-900 mt-2">{jobs.length}</p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">0 Failed Pipelines</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Avg Job Duration</span>
          <p className="text-2xl font-black text-slate-900 mt-2">0.12s</p>
          <p className="text-xs text-slate-500 mt-1">In-Memory Transformation</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Parquet Sinks</span>
          <p className="text-2xl font-black text-blue-600 mt-2">5 Datasets</p>
          <p className="text-xs text-slate-500 mt-1">Snappy Compressed</p>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-3">
        {jobs.map((j, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-3 h-3" /> {j.status}
                </span>
                <span className="font-bold text-sm text-slate-900">{j.job_name}</span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                Source: {j.input_hdfs_path} → Target: {j.output_path}
              </p>
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-600">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Input Records</span>
                <span className="font-mono font-bold text-slate-800">{j.input_records?.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Output Records</span>
                <span className="font-mono font-bold text-emerald-600">{j.output_records?.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Duration</span>
                <span className="font-mono font-bold text-slate-800">{j.duration_seconds}s</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
