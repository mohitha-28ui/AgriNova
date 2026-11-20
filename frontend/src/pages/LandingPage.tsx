import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  Database,
  Cpu,
  Radio,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  CheckCircle,
  BarChart3,
  Bot
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500 selection:text-white">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-2xl tracking-wider bg-gradient-to-r from-emerald-400 via-teal-200 to-white bg-clip-text text-transparent">AgriNova</span>
            <span className="block text-[10px] text-emerald-400 font-medium tracking-wide">Smart Farming, Better Tomorrow.</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/about" className="text-sm font-medium text-slate-300 hover:text-white transition">About</Link>
          <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition">Sign In</Link>
          <Link
            to="/register"
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-lg shadow-emerald-500/20"
          >
            Launch Platform
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 text-xs font-semibold mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          AgriNova • Smart Farming, Better Tomorrow • Apache Hadoop HDFS + PySpark + Kafka + MongoDB + MySQL
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
          AGRINOVA – AI and Big Data Platform for <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Smart Agriculture</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Transforming agricultural data into intelligent decisions through distributed storage, Apache Spark analytics, real-time IoT data streaming and predictive machine learning.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base transition shadow-xl shadow-emerald-500/25"
          >
            Enter Farmer Dashboard <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/bigdata-analytics"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-base transition"
          >
            Explore Big Data Center <Database className="w-5 h-5 text-emerald-400" />
          </Link>
        </div>

        {/* Big Data Metrics Banner */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <p className="text-3xl font-extrabold text-emerald-400">43,940+</p>
            <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">Agricultural Records Processed</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <p className="text-3xl font-extrabold text-emerald-400">98.86%</p>
            <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">Crop Recommendation Accuracy</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <p className="text-3xl font-extrabold text-emerald-400">100 GB</p>
            <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">HDFS Storage Capacity</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <p className="text-3xl font-extrabold text-emerald-400">4 Topics</p>
            <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">Kafka Telemetry Streams</p>
          </div>
        </div>
      </section>

      {/* Architecture Highlights */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Core Distributed Architecture Pillars</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-emerald-500/50 transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-950 flex items-center justify-center text-emerald-400 mb-4">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Hadoop Distributed HDFS</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Fault-tolerant, high-throughput distributed storage for multi-gigabyte raw soil, crop yield, weather, and Mandi APMC spot records across NameNodes and DataNodes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-emerald-500/50 transition">
            <div className="w-12 h-12 rounded-xl bg-blue-950 flex items-center justify-center text-blue-400 mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">PySpark Distributed ETL</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Resilient in-memory Spark SQL transformations, schema validation, data deduplication, and feature engineering outputting partitioned Parquet datasets.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-emerald-500/50 transition">
            <div className="w-12 h-12 rounded-xl bg-purple-950 flex items-center justify-center text-purple-400 mb-4">
              <Radio className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Apache Kafka Streaming</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Real-time Pub/Sub broker ingesting high-frequency IoT soil probes, micro-weather stations, and live Mandi trade transactions with windowed aggregations.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-8 border-t border-slate-900 text-center text-xs text-slate-500">
        AgriNova – AI and Big Data Platform for Smart Agriculture © 2026. Smart Farming, Better Tomorrow.
      </footer>
    </div>
  );
};
