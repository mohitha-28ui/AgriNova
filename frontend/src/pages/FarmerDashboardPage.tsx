import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Database,
  TrendingUp,
  Sprout,
  FlaskConical,
  CloudSun,
  ShoppingBag,
  Droplets,
  Radio,
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  HardDrive,
  Cpu,
  Layers,
  MapPin,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Sun,
  Wind,
  Thermometer,
  Shield,
  Activity,
  Check,
  Send,
  MoreHorizontal,
  Leaf,
  Bot,
  ArrowRight,
  Users,
  Server,
  Bell
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { api } from '../services/api';

export const FarmerDashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [weather, setWeather] = useState<any>(null);
  const [trafficFilter, setTrafficFilter] = useState<'24h' | '7d' | '30d'>('24h');
  const [copilotQuery, setCopilotQuery] = useState('');
  const [copilotAnswer, setCopilotAnswer] = useState<string | null>(null);
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Traffic & Agricultural Velocity Dataset matching screenshot
  const trafficData24h = [
    { time: '00:00', value: 0.8 },
    { time: '02:00', value: 0.9 },
    { time: '04:00', value: 1.2 },
    { time: '06:00', value: 1.0 },
    { time: '08:00', value: 1.7 },
    { time: '10:00', value: 1.5 },
    { time: '12:00', value: 2.1 },
    { time: '14:00', value: 1.9 },
    { time: '16:00', value: 2.5 },
    { time: '18:00', value: 2.4 },
    { time: '18:30', value: 2.4 },
    { time: '20:00', value: 2.1 },
    { time: '22:00', value: 1.6 },
    { time: '24:00', value: 1.3 },
  ];

  const trafficData7d = [
    { time: 'Mon', value: 1.8 },
    { time: 'Tue', value: 2.2 },
    { time: 'Wed', value: 2.0 },
    { time: 'Thu', value: 2.6 },
    { time: 'Fri', value: 2.4 },
    { time: 'Sat', value: 1.9 },
    { time: 'Sun', value: 1.5 },
  ];

  const trafficData30d = [
    { time: 'Week 1', value: 1.9 },
    { time: 'Week 2', value: 2.3 },
    { time: 'Week 3', value: 2.7 },
    { time: 'Week 4', value: 2.4 },
  ];

  const currentTrafficData = trafficFilter === '24h' ? trafficData24h : trafficFilter === '7d' ? trafficData7d : trafficData30d;

  const [sqlStats, setSqlStats] = useState<any>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sumRes, wRes, sqlRes] = await Promise.all([
        api.getDashboardSummary().catch(() => null),
        api.getCurrentWeather('Andhra Pradesh', 'Amaravati').catch(() => null),
        api.getSqlDashboardStats().catch(() => null),
      ]);
      if (sumRes?.data) setSummary(sumRes.data);
      if (wRes?.data) setWeather(wRes.data);
      if (sqlRes?.data) {
        setSqlStats(sqlRes.data);
        if (sqlRes.data.latest_weather) {
          setWeather({
            ...sqlRes.data.latest_weather,
            Mean_Temp_C: sqlRes.data.latest_weather.temperature,
            Condition: sqlRes.data.latest_weather.weather_condition,
            Humidity_pct: sqlRes.data.latest_weather.humidity,
            Wind_Speed_kmh: 14.0,
            Rainfall_mm: sqlRes.data.latest_weather.rainfall
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCopilotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotQuery.trim() || copilotLoading) return;
    setCopilotLoading(true);
    try {
      const res = await api.queryCopilot({ question: copilotQuery });
      setCopilotAnswer(res.data?.response || 'Your crop and soil telemetry is within optimal benchmarks.');
    } catch (err) {
      setCopilotAnswer('Wheat growth stage Tillering in Zone 3 requires 50kg/ha Nitrogen top-dressing prior to CRI irrigation.');
    } finally {
      setCopilotLoading(false);
    }
  };

  return (
    <div className="space-y-5 max-w-[1500px] mx-auto">
      {/* 1. TOP WELCOME BANNER (Clean, Natural, Professional SaaS Card) */}
      <div className="bg-[#F4F8F5] rounded-2xl p-6 md:p-8 border border-[#DCE6DF] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Natural subtle left accent border */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#16a34a]"></div>

        <div className="space-y-1.5 pl-2">
          {/* Small AgriNova Leaf Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#D0DFD4] text-[#16a34a] text-[11px] font-bold shadow-2xs">
            <Leaf className="w-3.5 h-3.5 text-[#16a34a]" />
            <span>Smart Farming, Better Tomorrow.</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Welcome back, <span className="text-[#16a34a]">Sana Mohitha</span>!
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Let's grow smarter with AgriNova.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/bigdata-analytics"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold transition shadow-xs"
          >
            <span>Explore Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 2. FOUR ANALYTICS CARDS (Total Agricultural Records, Data Processing Status, Pending Alerts, Active Farmers) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Agricultural Records / Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#EBF7EE] flex items-center justify-center text-[#16a34a]">
              <Leaf className="w-5 h-5 text-[#16a34a]" />
            </div>
            {/* Sparkline Visual */}
            <div className="flex items-end gap-1 h-6">
              <span className="w-1.5 h-3 bg-[#86efac] rounded-t-sm"></span>
              <span className="w-1.5 h-4 bg-[#86efac] rounded-t-sm"></span>
              <span className="w-1.5 h-2 bg-[#86efac] rounded-t-sm"></span>
              <span className="w-1.5 h-5 bg-[#22c55e] rounded-t-sm"></span>
              <span className="w-1.5 h-6 bg-[#16a34a] rounded-t-sm"></span>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-slate-500">Total Agricultural Records</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">$1,240,500</p>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[#16a34a]">
            <span>↑ +12.5%</span>
            <span className="text-slate-400 font-normal text-[11px]">vs last month</span>
          </div>
        </div>

        {/* Card 2: Server Uptime / Data Processing Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#EBF5FF] flex items-center justify-center text-[#2563eb]">
              <Server className="w-5 h-5 text-[#2563eb]" />
            </div>
            {/* Mini Wave line */}
            <svg className="w-16 h-6 text-[#3b82f6]" viewBox="0 0 60 20" fill="none">
              <path d="M0,15 Q15,5 30,12 T60,8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-slate-500">Server Uptime & Pipelines</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">99.99%</p>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[#2563eb]">
            <span>↑ +0.1%</span>
            <span className="text-slate-400 font-normal text-[11px]">HDFS & Spark Active</span>
          </div>
        </div>

        {/* Card 3: Pending Alerts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] flex items-center justify-center text-[#ea580c]">
              <Bell className="w-5 h-5 text-[#ea580c]" />
            </div>
            {/* Mini Alert Wave */}
            <svg className="w-16 h-6 text-[#f97316]" viewBox="0 0 60 20" fill="none">
              <path d="M0,10 Q12,18 25,6 T45,14 T60,8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-slate-500">Pending Alerts</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">45</p>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[#ea580c]">
            <span>↑ +8%</span>
            <span className="text-slate-400 font-normal text-[11px]">Action required</span>
          </div>
        </div>

        {/* Card 4: Active Farmers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#FAF5FF] flex items-center justify-center text-[#9333ea]">
              <Users className="w-5 h-5 text-[#9333ea]" />
            </div>
            {/* Mini User avatars graphic */}
            <div className="flex -space-x-1.5">
              <span className="w-5 h-5 rounded-full bg-[#c084fc] border border-white"></span>
              <span className="w-5 h-5 rounded-full bg-[#a855f7] border border-white"></span>
              <span className="w-5 h-5 rounded-full bg-[#9333ea] border border-white"></span>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-slate-500">Active Farmers</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">3,402</p>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[#9333ea]">
            <span>↑ +15%</span>
            <span className="text-slate-400 font-normal text-[11px]">Growing network</span>
          </div>
        </div>
      </div>

      {/* 3. MIDDLE ROW (Weather Today, Network Traffic / Agricultural Production Area Chart, System Resources) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Weather Card (Col 1-4) - Dark Forest Green with Landscape */}
        <div className="lg:col-span-4 bg-[#0a261c] text-white p-5 rounded-3xl border border-[#143e2e] shadow-md flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background grass silhouette */}
          <div className="absolute inset-x-0 bottom-0 h-16 opacity-25 pointer-events-none">
            <svg viewBox="0 0 400 60" preserveAspectRatio="none" className="w-full h-full fill-[#16a34a]">
              <path d="M0,45 Q50,25 100,40 T200,30 T300,42 T400,35 L400,60 L0,60 Z" />
            </svg>
          </div>

          <div>
            {/* Header: Weather Today - Andhra Pradesh ● Live */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CloudSun className="w-4 h-4 text-[#86efac]" />
                <h3 className="text-xs font-bold tracking-tight text-white">Weather Today – Andhra Pradesh</h3>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#16a34a]/30 text-[#86efac] border border-[#22c55e]/40 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse"></span> Live
              </span>
            </div>

            {/* Main Temp & Condition */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Sun Behind Cloud Illustration */}
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 shadow-md shadow-amber-500/50 absolute top-0 left-1"></div>
                  <CloudSun className="w-12 h-12 text-slate-100 relative z-10 drop-shadow-sm" />
                </div>
                <div>
                  <p className="text-3xl font-black text-white leading-none">28°C</p>
                  <p className="text-xs font-bold text-[#86efac] mt-1">Partly Cloudy</p>
                  <p className="text-[10px] text-slate-400">Feels like: 30°C</p>
                </div>
              </div>

              {/* Humidity, Wind, Rainfall */}
              <div className="space-y-1.5 text-right text-xs">
                <div className="text-[11px] text-slate-300">
                  <span className="text-slate-400 block text-[9px] uppercase font-semibold">Humidity</span>
                  <span className="font-bold text-white">72%</span>
                </div>
                <div className="text-[11px] text-slate-300">
                  <span className="text-slate-400 block text-[9px] uppercase font-semibold">Wind Speed</span>
                  <span className="font-bold text-white">14 km/h</span>
                </div>
                <div className="text-[11px] text-slate-300">
                  <span className="text-slate-400 block text-[9px] uppercase font-semibold">Rainfall</span>
                  <span className="font-bold text-white">2.1 mm</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5-Day Forecast Row matching Screenshot */}
          <div className="mt-5 pt-3 border-t border-[#143e2e]/80 grid grid-cols-5 gap-1 text-center relative z-10">
            {[
              { day: 'Mon', temp: '27°C' },
              { day: 'Tue', temp: '29°C' },
              { day: 'Wed', temp: '30°C' },
              { day: 'Thu', temp: '31°C' },
              { day: 'Fri', temp: '32°C' },
            ].map((f, i) => (
              <div key={i} className="p-1 rounded-lg hover:bg-white/5 transition">
                <p className="text-[10px] text-slate-400 font-semibold">{f.day}</p>
                <Sun className="w-3.5 h-3.5 mx-auto text-amber-400 my-1 fill-amber-400" />
                <p className="text-[10px] font-bold text-white">{f.temp}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Network Traffic / Agricultural Production Flow Chart (Col 5-8) */}
        <div className="lg:col-span-5 bg-[#0b241b] text-white p-5 rounded-3xl border border-[#143e2e] shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#86efac]" />
              <h3 className="text-xs font-bold tracking-tight text-white">Network Traffic & Agricultural Telemetry</h3>
            </div>
            {/* Filter Pills 24h / 7d / 30d */}
            <div className="flex items-center bg-[#061912] p-0.5 rounded-lg border border-[#143e2e] text-[10px] font-bold">
              {(['24h', '7d', '30d'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTrafficFilter(t)}
                  className={`px-2.5 py-1 rounded-md transition ${
                    trafficFilter === t
                      ? 'bg-[#22c55e] text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Area Chart Container */}
          <div className="h-44 w-full mt-2 relative">
            {/* Floating Tooltip Indicator from Screenshot */}
            <div className="absolute top-2 right-12 z-10 px-2 py-0.5 rounded-md bg-[#061912]/90 border border-[#22c55e]/50 text-[10px] font-bold text-[#86efac] shadow-sm">
              2.4 GB/s at 18:30
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentTrafficData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="neonGreenWave" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                    <stop offset="60%" stopColor="#16a34a" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0b241b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#475569" tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} />
                <YAxis stroke="#475569" tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} domain={[0, 3]} ticks={[0, 1, 2, 3]} tickFormatter={(v) => `${v}GB`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#061912', borderColor: '#22c55e', borderRadius: '8px', fontSize: '11px', color: '#fff' }}
                  labelStyle={{ color: '#86efac', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2.5} fillOpacity={1} fill="url(#neonGreenWave)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Resources Card (Col 9-12) - 3 Ring meters */}
        <div className="lg:col-span-3 bg-[#0a261c] text-white p-5 rounded-3xl border border-[#143e2e] shadow-md flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#86efac]" />
            <h3 className="text-xs font-bold tracking-tight text-white">System Resources</h3>
          </div>

          {/* 3 Circular Rings */}
          <div className="space-y-3 mt-3">
            {/* Ring 1: CPU Load */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 flex items-center justify-center">
                  <svg className="w-10 h-10 transform -rotate-90">
                    <circle cx="20" cy="20" r="15" stroke="#164332" strokeWidth="3.5" fill="none" />
                    <circle cx="20" cy="20" r="15" stroke="#22c55e" strokeWidth="3.5" fill="none" strokeDasharray="94" strokeDashoffset="23.5" strokeLinecap="round" />
                  </svg>
                  <Cpu className="w-4 h-4 text-[#22c55e] absolute" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">CPU Load</p>
                  <p className="text-[10px] text-slate-400">Cluster A</p>
                </div>
              </div>
              <span className="text-sm font-black text-white">75%</span>
            </div>

            {/* Ring 2: Memory */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 flex items-center justify-center">
                  <svg className="w-10 h-10 transform -rotate-90">
                    <circle cx="20" cy="20" r="15" stroke="#164332" strokeWidth="3.5" fill="none" />
                    <circle cx="20" cy="20" r="15" stroke="#38bdf8" strokeWidth="3.5" fill="none" strokeDasharray="94" strokeDashoffset="47" strokeLinecap="round" />
                  </svg>
                  <Activity className="w-4 h-4 text-[#38bdf8] absolute" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Memory</p>
                  <p className="text-[10px] text-slate-400">32GB / 64GB</p>
                </div>
              </div>
              <span className="text-sm font-black text-white">50%</span>
            </div>

            {/* Ring 3: Storage */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 flex items-center justify-center">
                  <svg className="w-10 h-10 transform -rotate-90">
                    <circle cx="20" cy="20" r="15" stroke="#164332" strokeWidth="3.5" fill="none" />
                    <circle cx="20" cy="20" r="15" stroke="#a855f7" strokeWidth="3.5" fill="none" strokeDasharray="94" strokeDashoffset="9.4" strokeLinecap="round" />
                  </svg>
                  <HardDrive className="w-4 h-4 text-[#a855f7] absolute" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Storage</p>
                  <p className="text-[10px] text-slate-400">NVMe SSD & HDFS</p>
                </div>
              </div>
              <span className="text-sm font-black text-white">90%</span>
            </div>
          </div>

          {/* Bandwidth Allocation bottom bar */}
          <div className="mt-4 pt-3 border-t border-[#143e2e]">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[11px] text-slate-400">Bandwidth Allocation</span>
              <span className="text-[11px] font-bold text-[#86efac]">Good</span>
            </div>
            <div className="w-full h-1.5 bg-[#061912] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#22c55e] to-[#38bdf8] rounded-full w-[85%]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. LOWER ROW (Crop Analytics – Zone 3 : Wheat, Plant Health Score, Recent Alerts & Activity) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Crop Analytics – Zone 3 : Wheat (Col 1-4) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sprout className="w-4 h-4 text-[#16a34a]" />
              <h3 className="text-xs font-bold text-slate-900">Crop Analytics – Zone 3 : Wheat</h3>
            </div>
            <Link to="/crop-recommendation" className="text-[11px] font-bold text-[#16a34a] hover:underline flex items-center gap-0.5">
              <span>View Details</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-12 gap-4 items-center">
            {/* Realistic Wheat Artwork */}
            <div className="col-span-5 h-24 rounded-2xl overflow-hidden bg-[#FEF9C3] p-2 flex items-center justify-center border border-amber-200">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Wheat Stalks */}
                <path d="M50,90 Q48,50 45,20" stroke="#ca8a04" strokeWidth="2.5" fill="none" />
                <path d="M50,90 Q55,55 60,25" stroke="#ca8a04" strokeWidth="2" fill="none" />
                <path d="M50,90 Q40,60 32,35" stroke="#ca8a04" strokeWidth="2" fill="none" />

                {/* Wheat grains */}
                {[20, 28, 36, 44, 52].map((y, i) => (
                  <g key={i}>
                    <ellipse cx="41" cy={y} rx="4" ry="6" fill="#eab308" stroke="#ca8a04" strokeWidth="1" transform={`rotate(-25 41 ${y})`} />
                    <ellipse cx="50" cy={y} rx="4" ry="6" fill="#facc15" stroke="#ca8a04" strokeWidth="1" transform={`rotate(25 50 ${y})`} />
                    <line x1="41" y1={y-4} x2="33" y2={y-12} stroke="#ca8a04" strokeWidth="0.8" />
                    <line x1="50" y1={y-4} x2="58" y2={y-12} stroke="#ca8a04" strokeWidth="0.8" />
                  </g>
                ))}
              </svg>
            </div>

            {/* Metrics */}
            <div className="col-span-7 space-y-2.5">
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Growth Stage</p>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs font-black text-slate-800">Tillering</span>
                  {/* 5-step indicators */}
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-1.5 rounded-full bg-[#16a34a]"></span>
                    <span className="w-2.5 h-1.5 rounded-full bg-[#16a34a]"></span>
                    <span className="w-2.5 h-1.5 rounded-full bg-[#16a34a]"></span>
                    <span className="w-2.5 h-1.5 rounded-full bg-[#16a34a]"></span>
                    <span className="w-2.5 h-1.5 rounded-full bg-slate-200"></span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                  <span>Stress Index</span>
                  <span className="font-bold text-amber-600">Low-Med</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-400 rounded-full w-[45%]"></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                  <span>Canopy Coverage</span>
                  <span className="font-bold text-slate-800">78%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-[#16a34a] rounded-full w-[78%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Plant Health Score (Col 5-7) */}
        <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#16a34a]" />
            <h3 className="text-xs font-bold text-slate-900">Plant Health Score</h3>
          </div>

          <div className="mt-2 flex items-center justify-between gap-3">
            {/* Semi-circular Ring Gauge 82/100 */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="36" stroke="#E2E8F0" strokeWidth="8" fill="none" strokeDasharray="226" strokeDashoffset="45" strokeLinecap="round" />
                <circle cx="48" cy="48" r="36" stroke="#22c55e" strokeWidth="8" fill="none" strokeDasharray="226" strokeDashoffset="85" strokeLinecap="round" />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-black text-slate-900 leading-none">82</span>
                <span className="text-[10px] text-slate-400 font-bold block">/100</span>
                <span className="text-[9px] font-bold text-[#16a34a] block mt-0.5">Good Health</span>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-700">
                <Check className="w-3.5 h-3.5 text-[#16a34a]" />
                <span className="text-[11px]">Vigor: <span className="font-normal text-slate-500">High</span></span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-slate-700">
                <Check className="w-3.5 h-3.5 text-[#16a34a]" />
                <span className="text-[11px]">Stress: <span className="font-normal text-slate-500">Low</span></span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-slate-700">
                <span className="w-2 h-2 rounded-full bg-amber-500 ml-1"></span>
                <span className="text-[11px]">Disease: <span className="font-normal text-slate-500">Med</span></span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Link
              to="/disease-detection"
              className="w-full block py-2 text-center rounded-xl bg-[#092218] hover:bg-[#123829] text-white text-xs font-bold transition shadow-xs"
            >
              View Analysis →
            </Link>
          </div>
        </div>

        {/* Recent Alerts & Activity Table (Col 8-12) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900">Recent Alerts & Activity</h3>
            <Link to="/admin-dashboard" className="text-[11px] font-bold text-[#16a34a] hover:underline">
              View All →
            </Link>
          </div>

          <div className="overflow-x-auto mt-2">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Event Name</th>
                  <th className="pb-2">Source</th>
                  <th className="pb-2">Timestamp</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                {/* Row 1: Critical */}
                <tr className="hover:bg-slate-50/80 transition">
                  <td className="py-2.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold text-[9px] border border-rose-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Critical
                    </span>
                  </td>
                  <td className="py-2.5 font-bold text-slate-800">Database Latency Spike</td>
                  <td className="py-2.5 text-slate-500">US-East-1</td>
                  <td className="py-2.5 text-slate-400 font-mono text-[10px]">Today, 10:42 AM</td>
                  <td className="py-2.5 text-right text-slate-400 hover:text-slate-700 cursor-pointer">
                    <MoreHorizontal className="w-4 h-4 ml-auto" />
                  </td>
                </tr>

                {/* Row 2: Warning */}
                <tr className="hover:bg-slate-50/80 transition">
                  <td className="py-2.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-[9px] border border-amber-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Warning
                    </span>
                  </td>
                  <td className="py-2.5 font-bold text-slate-800">High Temperature Alert</td>
                  <td className="py-2.5 text-slate-500">Zone 3</td>
                  <td className="py-2.5 text-slate-400 font-mono text-[10px]">Today, 09:20 AM</td>
                  <td className="py-2.5 text-right text-slate-400 hover:text-slate-700 cursor-pointer">
                    <MoreHorizontal className="w-4 h-4 ml-auto" />
                  </td>
                </tr>

                {/* Row 3: Info */}
                <tr className="hover:bg-slate-50/80 transition">
                  <td className="py-2.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[9px] border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Info
                    </span>
                  </td>
                  <td className="py-2.5 font-bold text-slate-800">New Farmer Registered</td>
                  <td className="py-2.5 text-slate-500">Web Portal</td>
                  <td className="py-2.5 text-slate-400 font-mono text-[10px]">Today, 08:15 AM</td>
                  <td className="py-2.5 text-right text-slate-400 hover:text-slate-700 cursor-pointer">
                    <MoreHorizontal className="w-4 h-4 ml-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 5. BOTTOM FLOATING AI FARMING ASSISTANT INPUT (matching screenshot) */}
      <div className="rounded-3xl p-3 bg-white border border-[#C5E2D1] shadow-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left Title & Prompt */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-2xl bg-[#EBF7EE] flex items-center justify-center text-[#16a34a] flex-shrink-0 shadow-2xs">
              <Sprout className="w-5 h-5 text-[#16a34a]" />
            </div>
            <div className="min-w-0">
              <span className="font-extrabold text-xs text-slate-900 block truncate">
                AgriNova AI Assistant
              </span>
              <span className="text-[11px] text-slate-500 truncate block">
                Ask anything about crops, farming tips, or analytics...
              </span>
            </div>
          </div>

          {/* Center Input Form */}
          <form onSubmit={handleCopilotSubmit} className="flex-1 max-w-xl w-full">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Type your query..."
                value={copilotQuery}
                onChange={(e) => setCopilotQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#22c55e] focus:bg-white focus:ring-2 focus:ring-[#22c55e]/20 transition shadow-inner"
              />
              <button
                type="submit"
                disabled={copilotLoading}
                className="absolute right-1.5 p-2 rounded-full bg-[#16a34a] hover:bg-[#15803d] text-white transition shadow-sm disabled:opacity-50"
              >
                <Send className={`w-3.5 h-3.5 ${copilotLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </form>

          {/* Right Badge from Screenshot */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF7EE] border border-[#C5E2D1] text-[11px] font-bold text-[#16a34a]">
            <Leaf className="w-3.5 h-3.5" />
            <span>Smart Farming Made Simple</span>
          </div>
        </div>

        {/* Real-time Answer Dropdown if query answered */}
        {copilotAnswer && (
          <div className="mt-3 p-3.5 rounded-2xl bg-[#F0FDF4] border border-[#86efac] text-xs text-slate-800 flex items-start gap-3">
            <Bot className="w-4 h-4 text-[#16a34a] mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-bold text-[#15803d]">AgriNova Agronomic Recommendation:</p>
              <p className="mt-0.5 leading-relaxed">{copilotAnswer}</p>
            </div>
            <button
              onClick={() => setCopilotAnswer(null)}
              className="text-slate-400 hover:text-slate-600 font-bold"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
