import React, { useState, useEffect } from 'react';
import {
  FileBarChart,
  Download,
  Calendar,
  Layers,
  Database,
  CheckCircle2,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

export const ReportsPage: React.FC = () => {
  const [analyticsList, setAnalyticsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAllAnalyticsResults()
      .then(res => setAnalyticsList(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const downloadReportJson = (item: any) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(item, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `${item.analytics_key}_report.json`);
    dlAnchorElem.click();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
            Enterprise Reporting
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-2">Analytical Intelligence Reports</h1>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Exportable summaries derived from distributed Apache Spark transformations, Parquet storage, and machine learning models.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {analyticsList.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                  {item.source || 'PySpark Analytics'}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {item.updated_at?.slice(0, 10)}
                </span>
              </div>
              <h3 className="font-bold text-base text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-500 mt-1 font-mono">Key: {item.analytics_key}</p>
              <p className="text-xs text-slate-600 mt-2">
                Total Records: <strong>{item.data?.length || 0} Aggregated Entities</strong>
              </p>
            </div>

            <button
              onClick={() => downloadReportJson(item)}
              className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
            >
              <Download className="w-3.5 h-3.5" /> Export Analytical Report (JSON)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
