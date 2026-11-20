import React, { useState, useEffect } from 'react';
import {
  FileBarChart,
  Download,
  Calendar,
  Layers,
  Database,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  FileText,
  FileSpreadsheet
} from 'lucide-react';
import { api } from '../services/api';

export const ReportsPage: React.FC = () => {
  const [analyticsList, setAnalyticsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAllAnalyticsResults()
      .then(res => setAnalyticsList(res.data?.results || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const downloadReportJson = (item: any) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(item, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `${item.pipeline_key || 'agrinova'}_report.json`);
    dlAnchorElem.click();
  };

  const downloadReportCsv = (item: any) => {
    // Generate simple CSV from data
    const records = item.data || [];
    if (records.length === 0) {
      alert('No tabular rows available to export.');
      return;
    }
    const headers = Object.keys(records[0]).join(',');
    const rows = records.map((r: any) => Object.values(r).join(',')).join('\n');
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(`${headers}\n${rows}`);
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", csvContent);
    dlAnchorElem.setAttribute("download", `${item.pipeline_key || 'agrinova'}_dataset.csv`);
    dlAnchorElem.click();
  };

  const printPdfReport = (item: any) => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-[#173F35] text-white p-6 md:p-8 rounded-xl border border-[#103028] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4E8B62]"></span>
            <span className="text-[11px] font-semibold text-[#A3C6AF] uppercase tracking-wider">
              Enterprise Reporting Suite
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">Analytical & Big Data Reports</h1>
          <p className="text-xs text-[#D0E2D5] mt-1 max-w-xl leading-relaxed">
            Exportable summaries derived from distributed Apache Spark transformations, Parquet storage, and machine learning models. Supports JSON, CSV, and printable PDF formats.
          </p>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {analyticsList.map((item, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-[#E5EAE5] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#E8F1E9] text-[#173F35]">
                  {item.source || 'Apache Spark 3.5'}
                </span>
                <span className="text-[11px] text-[#64748B] font-mono">
                  {item.generated_at?.slice(0, 10) || '2026-11-19'}
                </span>
              </div>
              <h3 className="font-bold text-sm text-[#173F35]">{item.title}</h3>
              <p className="text-[11px] text-[#64748B] mt-1 font-mono truncate">Key: {item.pipeline_key}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E5EAE5] flex items-center justify-between">
              <span className="text-[10px] text-[#64748B]">
                {item.data ? `${item.data.length} Records` : 'Aggregate Summary'}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => downloadReportCsv(item)}
                  className="px-2.5 py-1 bg-[#F7F9F6] hover:bg-[#E8F1E9] text-[#173F35] rounded-md text-[11px] font-semibold border border-[#E5EAE5] transition flex items-center gap-1"
                  title="Download CSV"
                >
                  <FileSpreadsheet className="w-3 h-3 text-[#4E8B62]" />
                  <span>CSV</span>
                </button>
                <button
                  onClick={() => downloadReportJson(item)}
                  className="px-2.5 py-1 bg-[#F7F9F6] hover:bg-[#E8F1E9] text-[#173F35] rounded-md text-[11px] font-semibold border border-[#E5EAE5] transition flex items-center gap-1"
                  title="Download JSON"
                >
                  <FileText className="w-3 h-3 text-[#4E8B62]" />
                  <span>JSON</span>
                </button>
                <button
                  onClick={() => printPdfReport(item)}
                  className="px-2.5 py-1 bg-[#173F35] hover:bg-[#234430] text-white rounded-md text-[11px] font-semibold transition flex items-center gap-1"
                  title="Export / Print PDF"
                >
                  <Download className="w-3 h-3" />
                  <span>PDF</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
