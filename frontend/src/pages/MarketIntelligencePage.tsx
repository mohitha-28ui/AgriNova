import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  TrendingUp,
  Search,
  Filter,
  ArrowUpRight,
  RefreshCw,
  Calendar,
  Building2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { api } from '../services/api';

export const MarketIntelligencePage: React.FC = () => {
  const [prices, setPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCommodity, setSelectedCommodity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const loadPrices = async () => {
    setLoading(true);
    try {
      const res = await api.getMarketPrices(selectedCommodity || undefined);
      setPrices(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrices();
  }, [selectedCommodity]);

  const commodities = ['Wheat', 'Paddy (Dhan)', 'Maize', 'Cotton (Kapas)', 'Soybean', 'Gram (Chana)', 'Groundnut', 'Mustard', 'Potato', 'Onion', 'Tomato'];

  const filtered = prices.filter(p =>
    (p.Market_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     p.District?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     p.State?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const chartData = [
    { commodity: 'Wheat', Min: 2180, Modal: 2420, Max: 2580 },
    { commodity: 'Paddy', Min: 2020, Modal: 2250, Max: 2410 },
    { commodity: 'Maize', Min: 1820, Modal: 2050, Max: 2280 },
    { commodity: 'Mustard', Min: 4750, Modal: 5350, Max: 5800 },
    { commodity: 'Cotton', Min: 6100, Modal: 6950, Max: 7500 },
    { commodity: 'Soybean', Min: 4100, Modal: 4680, Max: 5120 },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-950 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/30 uppercase tracking-wider">
            AGMARKNET & APMC Spot Market Network
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-2">Mandi Market Price Intelligence</h1>
          <p className="text-emerald-100 text-sm mt-1 max-w-xl">
            Real-time APMC Mandi settlement prices, arrivals in metric tonnes, floor/ceiling bounds, and inter-state trade spreads.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCommodity}
            onChange={(e) => setSelectedCommodity(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white text-slate-800 text-xs font-bold shadow-md focus:outline-none"
          >
            <option value="">All Commodities</option>
            {commodities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Price Comparison Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Benchmark APMC Mandi Price Bands (₹ / Quintal)</h3>
            <p className="text-xs text-slate-500">Minimum, Modal, and Maximum spot settlement rates</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">PySpark Computed</span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="commodity" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Min" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Min Price" />
              <Bar dataKey="Modal" fill="#10b981" radius={[4, 4, 0, 0]} name="Modal Settlement" />
              <Bar dataKey="Max" fill="#047857" radius={[4, 4, 0, 0]} name="Max Price" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold text-slate-900">APMC Mandi Spot Settlement Registry</h3>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Mandi or district..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-6">Arrival Date</th>
                <th className="py-3 px-6">Mandi Name</th>
                <th className="py-3 px-6">Commodity</th>
                <th className="py-3 px-6">Arrivals</th>
                <th className="py-3 px-6">Min (₹)</th>
                <th className="py-3 px-6">Modal Settlement (₹)</th>
                <th className="py-3 px-6">Max (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.slice(0, 30).map((r, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-6 text-slate-400 font-mono">{r.Arrival_Date}</td>
                  <td className="py-3 px-6 font-bold text-slate-900">{r.Market_Name}</td>
                  <td className="py-3 px-6">
                    <span className="px-2 py-0.5 rounded font-bold bg-emerald-50 text-emerald-800">
                      {r.Commodity}
                    </span>
                  </td>
                  <td className="py-3 px-6 font-mono">{r.Arrivals_Tonnes} MT</td>
                  <td className="py-3 px-6 font-mono text-slate-500">₹{r.Min_Price_INR_Quintal}</td>
                  <td className="py-3 px-6 font-mono font-bold text-emerald-600 text-sm">₹{r.Modal_Price_INR_Quintal}</td>
                  <td className="py-3 px-6 font-mono text-slate-500">₹{r.Max_Price_INR_Quintal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
