import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Sprout,
  Droplets,
  CloudSun,
  FlaskConical,
  Activity,
  Layers,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Maximize2,
  Calendar,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { api } from '../services/api';

interface FarmParcel {
  id: string;
  name: string;
  district: string;
  state: string;
  area_acres: number;
  crop: string;
  variety: string;
  sowing_date: string;
  growth_stage: string;
  health_status: 'Optimal' | 'Attention' | 'Hydration Needed';
  health_score: number;
  soil: {
    nitrogen_kg_ha: number;
    phosphorus_kg_ha: number;
    potassium_kg_ha: number;
    ph: number;
    moisture_pct: number;
  };
  weather: {
    temperature_c: number;
    humidity_pct: number;
    rainfall_mm: number;
    wind_kmh: number;
  };
  irrigation: {
    system: string;
    last_cycle: string;
    next_cycle: string;
  };
  ndvi_index: number;
}

export const FarmMonitoringPage: React.FC = () => {
  const [farms, setFarms] = useState<FarmParcel[]>([
    {
      id: 'FARM-01',
      name: 'Indus Valley Agro Plot A-1',
      district: 'Ludhiana',
      state: 'Punjab',
      area_acres: 24.5,
      crop: 'Wheat',
      variety: 'PBW-550 High-Yield',
      sowing_date: '15 Nov 2025',
      growth_stage: 'Tillering Phase',
      health_status: 'Optimal',
      health_score: 94,
      soil: { nitrogen_kg_ha: 88, phosphorus_kg_ha: 42, potassium_kg_ha: 40, ph: 6.8, moisture_pct: 38 },
      weather: { temperature_c: 21.4, humidity_pct: 72, rainfall_mm: 4.2, wind_kmh: 12 },
      irrigation: { system: 'Drip Automation (Smart VFD)', last_cycle: 'Yesterday, 18:00', next_cycle: 'Tomorrow, 06:00' },
      ndvi_index: 0.82
    },
    {
      id: 'FARM-02',
      name: 'Narmada Delta Cotton Estate',
      district: 'Bharuch',
      state: 'Gujarat',
      area_acres: 42.0,
      crop: 'Cotton',
      variety: 'Bt-Cotton Hybrid',
      sowing_date: '02 Jul 2025',
      growth_stage: 'Boll Formation',
      health_status: 'Attention',
      health_score: 78,
      soil: { nitrogen_kg_ha: 65, phosphorus_kg_ha: 31, potassium_kg_ha: 52, ph: 7.4, moisture_pct: 29 },
      weather: { temperature_c: 29.8, humidity_pct: 64, rainfall_mm: 0.0, wind_kmh: 18 },
      irrigation: { system: 'Furrow Controlled Surge', last_cycle: '3 Days Ago', next_cycle: 'Today, 20:00' },
      ndvi_index: 0.68
    },
    {
      id: 'FARM-03',
      name: 'Deccan Sugarcane Plantation',
      district: 'Kolhapur',
      state: 'Maharashtra',
      area_acres: 36.8,
      crop: 'Sugarcane',
      variety: 'Co-86032 Premium',
      sowing_date: '10 Jan 2025',
      growth_stage: 'Elongation Stage',
      health_status: 'Optimal',
      health_score: 91,
      soil: { nitrogen_kg_ha: 110, phosphorus_kg_ha: 48, potassium_kg_ha: 45, ph: 6.6, moisture_pct: 44 },
      weather: { temperature_c: 26.2, humidity_pct: 78, rainfall_mm: 12.5, wind_kmh: 9 },
      irrigation: { system: 'Sub-surface Micro-Drip', last_cycle: 'Today, 04:30', next_cycle: 'In 2 Days' },
      ndvi_index: 0.79
    },
    {
      id: 'FARM-04',
      name: 'Cauvery Basin Paddy Fields',
      district: 'Thanjavur',
      state: 'Tamil Nadu',
      area_acres: 18.2,
      crop: 'Rice',
      variety: 'Ponni Traditional Strain',
      sowing_date: '20 Aug 2025',
      growth_stage: 'Panicle Initiation',
      health_status: 'Hydration Needed',
      health_score: 72,
      soil: { nitrogen_kg_ha: 74, phosphorus_kg_ha: 38, potassium_kg_ha: 39, ph: 6.3, moisture_pct: 22 },
      weather: { temperature_c: 31.0, humidity_pct: 82, rainfall_mm: 2.0, wind_kmh: 14 },
      irrigation: { system: 'Canal Controlled Inundation', last_cycle: '4 Days Ago', next_cycle: 'Urgent Action' },
      ndvi_index: 0.64
    }
  ]);

  const [selectedFarm, setSelectedFarm] = useState<FarmParcel>(farms[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('ALL');

  const filteredFarms = farms.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.crop.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = stateFilter === 'ALL' || f.state === stateFilter;
    return matchesSearch && matchesState;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4E8B62]"></span>
            <span className="text-xs font-semibold text-[#4E8B62] uppercase tracking-wider">Spatial Telemetry</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#173F35] mt-1">Farm Monitoring & Field Parcels</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Real-time geospatial parcel telemetry, soil chemistry balance, micro-meteorology, and irrigation scheduling.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search farms or crops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-white border border-[#E5EAE5] rounded-lg text-xs text-[#1F2937] placeholder-[#94A3B8] focus:outline-none focus:border-[#4E8B62]"
            />
          </div>

          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="px-3 py-1.5 bg-white border border-[#E5EAE5] rounded-lg text-xs font-medium text-[#1F2937] focus:outline-none focus:border-[#4E8B62]"
          >
            <option value="ALL">All States</option>
            <option value="Punjab">Punjab</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Left Farm List & Details, Right Interactive Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Farm Selector List (4 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-[#64748B] px-1">
            <span className="font-semibold text-[#173F35]">Registered Farm Parcels ({filteredFarms.length})</span>
            <span>Click parcel to inspect</span>
          </div>

          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredFarms.map((farm) => {
              const isSelected = selectedFarm.id === farm.id;
              return (
                <div
                  key={farm.id}
                  onClick={() => setSelectedFarm(farm)}
                  className={`p-4 rounded-xl border transition cursor-pointer text-left ${
                    isSelected
                      ? 'bg-white border-[#4E8B62] shadow-sm ring-1 ring-[#4E8B62]/20'
                      : 'bg-white border-[#E5EAE5] hover:border-[#C9DEC9] hover:bg-[#FDFEFC]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-[#173F35]">{farm.name}</span>
                        <span className="text-[10px] font-mono text-[#64748B] bg-[#F7F9F6] border border-[#E5EAE5] px-1.5 py-0.2 rounded">
                          {farm.id}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#64748B] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#4E8B62]" />
                        {farm.district}, {farm.state} • <span className="font-medium text-[#1F2937]">{farm.area_acres} Acres</span>
                      </p>
                    </div>

                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      farm.health_status === 'Optimal'
                        ? 'bg-[#E8F1E9] text-[#173F35]'
                        : farm.health_status === 'Attention'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {farm.health_status} ({farm.health_score}%)
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#E5EAE5] text-center">
                    <div className="bg-[#F7F9F6] p-1.5 rounded-lg border border-[#E5EAE5]">
                      <span className="block text-[9px] text-[#64748B]">Crop / Variety</span>
                      <span className="block text-xs font-semibold text-[#173F35] truncate">{farm.crop}</span>
                    </div>
                    <div className="bg-[#F7F9F6] p-1.5 rounded-lg border border-[#E5EAE5]">
                      <span className="block text-[9px] text-[#64748B]">Soil pH / Moisture</span>
                      <span className="block text-xs font-semibold text-[#1F2937]">{farm.soil.ph} / {farm.soil.moisture_pct}%</span>
                    </div>
                    <div className="bg-[#F7F9F6] p-1.5 rounded-lg border border-[#E5EAE5]">
                      <span className="block text-[9px] text-[#64748B]">NDVI Index</span>
                      <span className="block text-xs font-semibold text-[#4E8B62]">{farm.ndvi_index}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Map & Detailed Telemetry Dossier (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Visual Farm Map Representation */}
          <div className="bg-white border border-[#E5EAE5] rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EAE5]">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#4E8B62]" />
                <span className="text-xs font-bold text-[#173F35] uppercase tracking-wide">
                  Geospatial Field Parcel Matrix
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-[#64748B]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-[#4E8B62]"></span> Healthy NDVI (&gt;0.75)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-[#9BC39E]"></span> Moderate (0.60–0.75)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-amber-400"></span> Stress (&lt;0.60)
                </span>
              </div>
            </div>

            {/* SVG Visual Parcel Map */}
            <div className="relative mt-4 h-64 bg-[#F2F7F4] rounded-lg border border-[#C9DEC9] overflow-hidden flex items-center justify-center">
              {/* Grid Lines Pattern */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#173F35_1px,transparent_1px)] [background-size:16px_16px]"></div>

              {/* Graphical Farm Plots with interactive selection */}
              <div className="relative z-10 w-full h-full p-4 grid grid-cols-2 gap-4">
                {farms.map((farm) => {
                  const isSelected = selectedFarm.id === farm.id;
                  return (
                    <div
                      key={farm.id}
                      onClick={() => setSelectedFarm(farm)}
                      className={`relative rounded-lg p-3 transition flex flex-col justify-between cursor-pointer border ${
                        isSelected
                          ? 'border-[#173F35] bg-[#E8F1E9] ring-2 ring-[#4E8B62]/30 shadow-md'
                          : 'border-[#C9DEC9] bg-white/80 hover:bg-white hover:border-[#4E8B62]'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-[#4E8B62] font-semibold">{farm.id}</span>
                          <p className="text-xs font-bold text-[#173F35] truncate">{farm.crop} Parcel</p>
                        </div>
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          farm.health_status === 'Optimal' ? 'bg-[#4E8B62]' : 'bg-amber-500 animate-ping'
                        }`}></span>
                      </div>

                      <div className="flex items-end justify-between mt-2 pt-2 border-t border-[#C9DEC9]/60">
                        <span className="text-[10px] text-[#64748B]">{farm.district}</span>
                        <span className="text-xs font-bold text-[#173F35]">NDVI {farm.ndvi_index}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Farm Detail Dossier */}
          <div className="bg-white border border-[#E5EAE5] rounded-xl p-6 shadow-xs space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-semibold text-[#4E8B62] uppercase tracking-wider">Active Parcel Dossier</span>
                <h2 className="text-lg font-bold text-[#173F35] mt-0.5">{selectedFarm.name}</h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  {selectedFarm.variety} • Sown on {selectedFarm.sowing_date} ({selectedFarm.growth_stage})
                </p>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-[#64748B]">Health Index</span>
                <p className="text-2xl font-black text-[#173F35]">{selectedFarm.health_score} <span className="text-xs font-medium text-[#64748B]">/ 100</span></p>
              </div>
            </div>

            {/* Metrics Triple Block: Soil, Weather, Irrigation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Soil Telemetry */}
              <div className="bg-[#F7F9F6] border border-[#E5EAE5] rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#173F35]">
                  <FlaskConical className="w-3.5 h-3.5 text-[#4E8B62]" />
                  <span>Soil Chemistry</span>
                </div>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between text-[#64748B]">
                    <span>NPK Balance:</span>
                    <span className="font-semibold text-[#1F2937]">
                      {selectedFarm.soil.nitrogen_kg_ha}-{selectedFarm.soil.phosphorus_kg_ha}-{selectedFarm.soil.potassium_kg_ha}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#64748B]">
                    <span>Soil Reaction:</span>
                    <span className="font-semibold text-[#1F2937]">pH {selectedFarm.soil.ph} (Optimal)</span>
                  </div>
                  <div className="flex justify-between text-[#64748B]">
                    <span>Moisture Content:</span>
                    <span className="font-semibold text-[#4E8B62]">{selectedFarm.soil.moisture_pct}% Volumetric</span>
                  </div>
                </div>
              </div>

              {/* Weather Telemetry */}
              <div className="bg-[#F7F9F6] border border-[#E5EAE5] rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#173F35]">
                  <CloudSun className="w-3.5 h-3.5 text-[#4E8B62]" />
                  <span>Micro-Climate</span>
                </div>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between text-[#64748B]">
                    <span>Temperature:</span>
                    <span className="font-semibold text-[#1F2937]">{selectedFarm.weather.temperature_c}°C</span>
                  </div>
                  <div className="flex justify-between text-[#64748B]">
                    <span>Relative Humidity:</span>
                    <span className="font-semibold text-[#1F2937]">{selectedFarm.weather.humidity_pct}%</span>
                  </div>
                  <div className="flex justify-between text-[#64748B]">
                    <span>24h Rainfall:</span>
                    <span className="font-semibold text-[#1F2937]">{selectedFarm.weather.rainfall_mm} mm</span>
                  </div>
                </div>
              </div>

              {/* Irrigation Schedule */}
              <div className="bg-[#F7F9F6] border border-[#E5EAE5] rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#173F35]">
                  <Droplets className="w-3.5 h-3.5 text-[#4E8B62]" />
                  <span>Smart Irrigation</span>
                </div>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between text-[#64748B]">
                    <span>System:</span>
                    <span className="font-semibold text-[#1F2937] truncate">{selectedFarm.irrigation.system}</span>
                  </div>
                  <div className="flex justify-between text-[#64748B]">
                    <span>Last Cycle:</span>
                    <span className="font-semibold text-[#1F2937]">{selectedFarm.irrigation.last_cycle}</span>
                  </div>
                  <div className="flex justify-between text-[#64748B]">
                    <span>Next Cycle:</span>
                    <span className="font-semibold text-[#4E8B62]">{selectedFarm.irrigation.next_cycle}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actionable Agronomic Recommendation */}
            <div className="p-3 bg-[#E8F1E9] border border-[#C9DEC9] rounded-lg flex items-center justify-between text-xs text-[#173F35]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#4E8B62] flex-shrink-0" />
                <span>
                  <strong>Prescriptive Recommendation:</strong> Soil Nitrogen ({selectedFarm.soil.nitrogen_kg_ha} kg/ha) is aligned with {selectedFarm.crop} flowering stage. Maintain scheduled micro-irrigation.
                </span>
              </div>
              <button
                onClick={() => alert(`Generating detailed agronomic report for ${selectedFarm.name}...`)}
                className="ml-3 px-3 py-1.5 bg-[#173F35] text-white rounded-md text-[11px] font-semibold hover:bg-[#234430] transition flex-shrink-0"
              >
                Full Diagnostic
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
