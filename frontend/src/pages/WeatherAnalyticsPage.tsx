import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  CloudRain,
  Wind,
  Sun,
  Droplets,
  Thermometer,
  ShieldAlert,
  ArrowUpRight,
  RefreshCw,
  Plus,
  Trash2,
  Edit2,
  X,
  CheckCircle2,
  AlertTriangle,
  Search,
  MapPin,
  Calendar
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { api } from '../services/api';

export const WeatherAnalyticsPage: React.FC = () => {
  const [weatherRecords, setWeatherRecords] = useState<any[]>([]);
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingWeather, setEditingWeather] = useState<any | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [newWeather, setNewWeather] = useState({
    location: 'Andhra Pradesh',
    temperature: 28.5,
    rainfall: 2.1,
    weather_condition: 'Partly Cloudy',
    humidity: 72.0
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [wListRes, currentRes] = await Promise.all([
        api.getSqlWeather(),
        api.getSqlCurrentWeather('Andhra Pradesh')
      ]);
      setWeatherRecords(wListRes.data || []);
      setCurrentWeather(currentRes.data || (wListRes.data && wListRes.data[0]));
    } catch (e: any) {
      console.error(e);
      setErrorMsg('Failed to load SQL weather records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateWeather = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      await api.createSqlWeather(newWeather);
      setSuccessMsg(`Weather observation for '${newWeather.location}' recorded!`);
      setShowAddModal(false);
      setNewWeather({
        location: 'Andhra Pradesh',
        temperature: 28.5,
        rainfall: 2.1,
        weather_condition: 'Partly Cloudy',
        humidity: 72.0
      });
      await loadData();
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (e: any) {
      setErrorMsg(e.response?.data?.detail || 'Error saving weather observation');
    }
  };

  const handleUpdateWeather = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWeather) return;
    setErrorMsg(null);
    try {
      await api.updateSqlWeather(editingWeather.weather_id, {
        location: editingWeather.location,
        temperature: parseFloat(editingWeather.temperature),
        rainfall: parseFloat(editingWeather.rainfall),
        weather_condition: editingWeather.weather_condition,
        humidity: parseFloat(editingWeather.humidity)
      });
      setSuccessMsg(`Weather record #${editingWeather.weather_id} updated successfully!`);
      setEditingWeather(null);
      await loadData();
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (e: any) {
      setErrorMsg(e.response?.data?.detail || 'Error updating weather record');
    }
  };

  const handleDeleteWeather = async (weatherId: number, loc: string) => {
    if (!window.confirm(`Delete weather record for '${loc}' (#${weatherId})?`)) return;
    try {
      await api.deleteSqlWeather(weatherId);
      setSuccessMsg(`Weather record #${weatherId} deleted.`);
      await loadData();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (e: any) {
      setErrorMsg(e.response?.data?.detail || 'Error deleting weather record');
    }
  };

  const filteredRecords = weatherRecords.filter(w =>
    w.location?.toLowerCase().includes(searchLocation.toLowerCase()) ||
    w.weather_condition?.toLowerCase().includes(searchLocation.toLowerCase())
  );

  // Rainfall history for chart
  const rainfallChartData = [
    { day: 'Mon', rain: 2.1, temp: 27 },
    { day: 'Tue', rain: 0.0, temp: 29 },
    { day: 'Wed', rain: 0.0, temp: 30 },
    { day: 'Thu', rain: 1.5, temp: 31 },
    { day: 'Fri', rain: 4.2, temp: 28 },
    { day: 'Sat', rain: 0.8, temp: 29 },
    { day: 'Sun', rain: 1.2, temp: 28 }
  ];

  const activeWeather = currentWeather || {
    location: 'Andhra Pradesh',
    temperature: 28.0,
    rainfall: 2.1,
    weather_condition: 'Partly Cloudy',
    humidity: 72.0
  };

  return (
    <div className="space-y-6 max-w-[1500px] mx-auto">
      {/* Top Banner */}
      <div className="bg-[#092218] text-white p-6 md:p-8 rounded-2xl border border-[#143e2e] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]"></span>
            <span className="text-[11px] font-bold text-[#86efac] uppercase tracking-wider">
              Module 4 – Micro-Meteorological Information
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
            Weather Information & Agro-Climatic Registry
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Live atmospheric telemetry, precipitation tracking, and agro-climatic advisories backed by <code className="bg-[#143e2e] px-1.5 py-0.5 rounded text-[#86efac]">agrinova_db.weather</code> table.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded-xl shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Log Weather Update</span>
          </button>
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2.5 rounded-xl bg-[#143e2e] hover:bg-[#1b523c] text-slate-200 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
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

      {/* Hero Weather Card & Rainfall Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Current Active Station Weather */}
        <div className="lg:col-span-5 bg-[#0a261c] text-white p-6 rounded-3xl border border-[#143e2e] shadow-md flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#86efac]" />
              <h3 className="text-sm font-bold text-white">{activeWeather.location}</h3>
            </div>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#16a34a]/30 text-[#86efac] border border-[#16a34a]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse"></span>
              Live Telemetry
            </span>
          </div>

          <div className="my-6 flex items-center justify-between">
            <div>
              <div className="text-5xl font-black tracking-tight text-white flex items-start">
                <span>{Math.round(activeWeather.temperature || 28)}</span>
                <span className="text-2xl font-light text-[#86efac]">°C</span>
              </div>
              <p className="text-sm font-bold text-[#86efac] mt-1">{activeWeather.weather_condition}</p>
              <p className="text-[11px] text-slate-300">Feels like {Math.round((activeWeather.temperature || 28) + 2)}°C</p>
            </div>
            <div className="w-20 h-20 rounded-2xl bg-[#143e2e] flex items-center justify-center text-amber-300 shadow-inner">
              <CloudSun className="w-12 h-12" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#143e2e]/80 text-xs">
            <div className="bg-[#143e2e]/50 p-2.5 rounded-xl border border-[#1b523c]">
              <span className="text-[10px] text-slate-400 font-bold block">Humidity</span>
              <span className="text-sm font-black text-white">{activeWeather.humidity || 72}%</span>
            </div>
            <div className="bg-[#143e2e]/50 p-2.5 rounded-xl border border-[#1b523c]">
              <span className="text-[10px] text-slate-400 font-bold block">Precipitation</span>
              <span className="text-sm font-black text-white">{activeWeather.rainfall || 2.1} mm</span>
            </div>
            <div className="bg-[#143e2e]/50 p-2.5 rounded-xl border border-[#1b523c]">
              <span className="text-[10px] text-slate-400 font-bold block">Wind Speed</span>
              <span className="text-sm font-black text-white">14 km/h</span>
            </div>
          </div>
        </div>

        {/* 7-Day Rainfall & Temperature Trend Chart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-blue-500" />
                <span>Precipitation & Temperature Trend</span>
              </h3>
              <p className="text-[11px] text-slate-400">Weekly agro-meteorological trajectory</p>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">Last 7 Days</span>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rainfallChartData}>
                <defs>
                  <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#092218', borderRadius: '12px', color: '#fff', fontSize: '11px', border: 'none' }}
                />
                <Area type="monotone" dataKey="rain" stroke="#3b82f6" strokeWidth={2.5} fill="url(#rainGrad)" name="Rainfall (mm)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              Cumulative Rainfall: <strong>9.8 mm</strong>
            </span>
            <span className="text-emerald-600 font-bold">Optimal for Kharif crop vegetative phase</span>
          </div>
        </div>
      </div>

      {/* Search and Table */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search weather station location or condition..."
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
          />
        </div>
        <span className="text-xs font-bold text-slate-500">{filteredRecords.length} Active Stations</span>
      </div>

      {/* Weather Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">Weather Database (weather table)</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Station ID</th>
                <th className="px-5 py-3">Location / District</th>
                <th className="px-5 py-3">Temperature</th>
                <th className="px-5 py-3">Rainfall</th>
                <th className="px-5 py-3">Atmospheric Condition</th>
                <th className="px-5 py-3">Relative Humidity</th>
                <th className="px-5 py-3">Recorded Timestamp</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-slate-400">
                    No weather records match your search.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((w) => (
                  <tr key={w.weather_id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-3.5 font-bold text-slate-900">#{w.weather_id}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#16a34a]" />
                        <span>{w.location}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-black text-slate-900">
                      {w.temperature}°C
                    </td>
                    <td className="px-5 py-3.5 text-blue-600 font-bold">
                      {w.rainfall} mm
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] border border-slate-200">
                        {w.weather_condition}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {w.humidity || 72}%
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 text-[11px]">
                      {w.recorded_at ? new Date(w.recorded_at).toLocaleDateString() : 'Today'}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingWeather(w)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#16a34a] hover:bg-emerald-50 transition"
                          title="Edit Weather"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteWeather(w.weather_id, w.location)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Delete Weather"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD WEATHER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Log Weather Observation</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWeather} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Station Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amaravati, Guntur, Kurnool"
                  value={newWeather.location}
                  onChange={(e) => setNewWeather({ ...newWeather, location: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Temperature (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newWeather.temperature}
                    onChange={(e) => setNewWeather({ ...newWeather, temperature: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rainfall (mm)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newWeather.rainfall}
                    onChange={(e) => setNewWeather({ ...newWeather, rainfall: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Condition</label>
                  <select
                    value={newWeather.weather_condition}
                    onChange={(e) => setNewWeather({ ...newWeather, weather_condition: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  >
                    <option value="Sunny">Sunny</option>
                    <option value="Partly Cloudy">Partly Cloudy</option>
                    <option value="Breezy & Humid">Breezy & Humid</option>
                    <option value="Rain">Rain</option>
                    <option value="Thunderstorm">Thunderstorm</option>
                    <option value="Clear Sky">Clear Sky</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Humidity (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newWeather.humidity}
                    onChange={(e) => setNewWeather({ ...newWeather, humidity: parseFloat(e.target.value) || 72 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  />
                </div>
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
                  Save Weather Observation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT WEATHER MODAL */}
      {editingWeather && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Edit Weather Record #{editingWeather.weather_id}</h3>
              <button onClick={() => setEditingWeather(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateWeather} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={editingWeather.location}
                  onChange={(e) => setEditingWeather({ ...editingWeather, location: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Temperature (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={editingWeather.temperature}
                    onChange={(e) => setEditingWeather({ ...editingWeather, temperature: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rainfall (mm)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={editingWeather.rainfall}
                    onChange={(e) => setEditingWeather({ ...editingWeather, rainfall: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Condition</label>
                  <input
                    type="text"
                    required
                    value={editingWeather.weather_condition}
                    onChange={(e) => setEditingWeather({ ...editingWeather, weather_condition: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Humidity (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={editingWeather.humidity}
                    onChange={(e) => setEditingWeather({ ...editingWeather, humidity: parseFloat(e.target.value) || 72 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingWeather(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold"
                >
                  Update Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
