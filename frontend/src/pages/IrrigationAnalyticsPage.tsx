import React, { useState, useEffect } from 'react';
import {
  Droplets,
  Layers,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Zap
} from 'lucide-react';
import { api } from '../services/api';

export const IrrigationAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getIrrigationStatus()
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleValve = (zoneId: string) => {
    if (!data?.irrigation_zones) return;
    const updated = data.irrigation_zones.map((z: any) => {
      if (z.zone_id === zoneId) {
        const newStatus = z.valve_status.includes('OPEN') ? 'CLOSED' : 'OPEN (IRRIGATING)';
        return { ...z, valve_status: newStatus };
      }
      return z;
    });
    setData({ ...data, irrigation_zones: updated });
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-cyan-900 to-slate-950 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/30 uppercase tracking-wider">
            Precision Water Management
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-2">Smart Irrigation Analytics</h1>
          <p className="text-cyan-100 text-sm mt-1 max-w-xl">
            Automates valve actuation based on IoT soil moisture tension, FAO Penman-Monteith reference evapotranspiration, and precipitation forecasts.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-xs font-semibold">
          <Zap className="w-4 h-4 text-cyan-400" /> Mode: {data?.smart_valve_automation_mode || 'WEATHER_LINKED'}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Evapotranspiration (ET0)</span>
          <p className="text-2xl font-black text-slate-900 mt-2">{data?.evapotranspiration_rate_mm_day || 4.2} mm/day</p>
          <p className="text-xs text-slate-500 mt-1">Solar & Vapor Loss Index</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Water Conservation</span>
          <p className="text-2xl font-black text-emerald-600 mt-2">+{data?.water_saving_percentage || 32.4}%</p>
          <p className="text-xs text-slate-500 mt-1">Compared to Traditional Flood</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm col-span-2 md:col-span-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Irrigation Zones</span>
          <p className="text-2xl font-black text-cyan-600 mt-2">{data?.irrigation_zones?.length || 3} Zones</p>
          <p className="text-xs text-slate-500 mt-1">Canal & Micro-Sprinkler</p>
        </div>
      </div>

      {/* Zones Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {data?.irrigation_zones?.map((zone: any) => (
          <div key={zone.zone_id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {zone.zone_id}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  zone.valve_status.includes('OPEN') ? 'bg-cyan-100 text-cyan-800 animate-pulse' :
                  zone.valve_status === 'OPTIMAL' ? 'bg-emerald-100 text-emerald-800' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {zone.valve_status}
                </span>
              </div>

              <h3 className="font-extrabold text-base text-slate-900">{zone.field_name}</h3>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Crop: {zone.crop}</p>

              <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Soil Moisture:</span>
                  <span className="font-bold text-slate-800">{zone.soil_moisture_pct}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Water Dose:</span>
                  <span className="font-mono font-bold text-slate-800">{zone.water_required_liters?.toLocaleString()} L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Schedule:</span>
                  <span className="font-semibold text-emerald-600">{zone.next_schedule}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => toggleValve(zone.zone_id)}
              className={`mt-4 w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
                zone.valve_status.includes('OPEN')
                  ? 'bg-rose-100 hover:bg-rose-200 text-rose-800'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/30'
              }`}
            >
              <Droplets className="w-4 h-4" />
              {zone.valve_status.includes('OPEN') ? 'Shut Off Valve' : 'Actuate Smart Irrigation'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
