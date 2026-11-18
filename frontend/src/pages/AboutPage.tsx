import React from 'react';
import { Database, Cpu, Radio, ShieldCheck, Sprout, Layers, Code, Award } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-8 md:p-12 text-white shadow-xl">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-700/60 uppercase tracking-wider">Project Specification</span>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mt-3">About AgriNova</h1>
        <p className="mt-4 text-emerald-100 max-w-2xl leading-relaxed text-sm md:text-base">
          AgriNova is an AI-powered Big Data Intelligence Platform engineered to solve complex data ingestion, storage, processing, and predictive analytics challenges in modern agriculture.
        </p>
      </div>

      {/* Problem Statement & Objectives */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" /> Problem Statement
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Agricultural data is inherently high-velocity and fragmented across weather telemetry, soil testing laboratories, historical crop harvests, satellite spectral indices, and physical APMC Mandi commodity transactions. Monolithic relational systems fail to process historical multi-gigabyte agricultural datasets or correlate real-time IoT events with yield outcomes.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" /> Core Engineering Objectives
          </h2>
          <ul className="text-sm text-slate-600 space-y-2">
            <li className="flex items-start gap-2">✓ Demonstrate distributed storage using Hadoop HDFS</li>
            <li className="flex items-start gap-2">✓ High-throughput ETL & feature extraction using Apache Spark & PySpark</li>
            <li className="flex items-start gap-2">✓ Real-time event streaming and window aggregations via Apache Kafka</li>
            <li className="flex items-start gap-2">✓ Operational & analytical persistence using MongoDB</li>
            <li className="flex items-start gap-2">✓ Machine learning models for Crop Recommendation and Yield Prediction</li>
          </ul>
        </div>
      </div>

      {/* Technology Stack Grid */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Code className="w-5 h-5 text-emerald-600" /> Production Technology Stack
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">Frontend</p>
            <p className="font-bold text-slate-800 mt-1">React 18 + TypeScript</p>
            <p className="text-xs text-slate-500 mt-1">Vite, Tailwind CSS, Recharts, Lucide Icons, Axios</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">Backend API</p>
            <p className="font-bold text-slate-800 mt-1">Python FastAPI</p>
            <p className="text-xs text-slate-500 mt-1">Pydantic v2, JWT Security, Swagger/OpenAPI</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">Big Data & Storage</p>
            <p className="font-bold text-slate-800 mt-1">Hadoop HDFS + PySpark</p>
            <p className="text-xs text-slate-500 mt-1">WebHDFS, Spark SQL, Parquet, Kafka Streaming</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">Database & ML</p>
            <p className="font-bold text-slate-800 mt-1">MongoDB + Scikit-learn</p>
            <p className="text-xs text-slate-500 mt-1">agrinova_db (17 Collections), Random Forest, GBDT</p>
          </div>
        </div>
      </div>
    </div>
  );
};
