import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  TrendingUp,
  Search,
  Filter,
  ArrowUpRight,
  RefreshCw,
  Calendar,
  Building2,
  Info,
  Plus,
  Trash2,
  Edit2,
  X,
  CheckCircle2,
  AlertTriangle,
  DollarSign
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
  const [selectedCrop, setSelectedCrop] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPrice, setEditingPrice] = useState<any | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [newPrice, setNewPrice] = useState({
    crop_name: 'Wheat',
    market_name: 'Guntur APMC',
    price: 2450.0,
    price_date: new Date().toISOString().slice(0, 10),
    min_price: 2300.0,
    max_price: 2600.0
  });

  const loadPrices = async () => {
    setLoading(true);
    try {
      const res = await api.getSqlMarketPrices();
      setPrices(res.data || []);
    } catch (e: any) {
      console.error(e);
      setErrorMsg('Failed to load SQL market prices.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrices();
  }, []);

  const handleCreatePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      await api.createSqlMarketPrice(newPrice);
      setSuccessMsg(`Market quotation for '${newPrice.crop_name}' at '${newPrice.market_name}' recorded!`);
      setShowAddModal(false);
      setNewPrice({
        crop_name: 'Wheat',
        market_name: 'Guntur APMC',
        price: 2450.0,
        price_date: new Date().toISOString().slice(0, 10),
        min_price: 2300.0,
        max_price: 2600.0
      });
      await loadPrices();
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (e: any) {
      setErrorMsg(e.response?.data?.detail || 'Error saving market price');
    }
  };

  const handleUpdatePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPrice) return;
    setErrorMsg(null);
    try {
      await api.updateSqlMarketPrice(editingPrice.price_id, {
        crop_name: editingPrice.crop_name,
        market_name: editingPrice.market_name,
        price: parseFloat(editingPrice.price),
        price_date: editingPrice.price_date,
        min_price: parseFloat(editingPrice.min_price),
        max_price: parseFloat(editingPrice.max_price)
      });
      setSuccessMsg(`Quotation #${editingPrice.price_id} updated successfully!`);
      setEditingPrice(null);
      await loadPrices();
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (e: any) {
      setErrorMsg(e.response?.data?.detail || 'Error updating price record');
    }
  };

  const handleDeletePrice = async (priceId: number, crop: string) => {
    if (!window.confirm(`Delete quotation #${priceId} for '${crop}'?`)) return;
    try {
      await api.deleteSqlMarketPrice(priceId);
      setSuccessMsg(`Quotation #${priceId} removed.`);
      await loadPrices();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (e: any) {
      setErrorMsg(e.response?.data?.detail || 'Error deleting price record');
    }
  };

  const filteredPrices = prices.filter(p => {
    const matchesSearch =
      p.crop_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.market_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCrop = selectedCrop === 'ALL' || p.crop_name?.toLowerCase().includes(selectedCrop.toLowerCase());
    return matchesSearch && matchesCrop;
  });

  // Unique crops for filter
  const uniqueCrops = Array.from(new Set(prices.map(p => p.crop_name).filter(Boolean)));

  // Prepare chart dataset
  const chartData = filteredPrices.slice(0, 7).map(p => ({
    crop: p.crop_name?.split(' ')[0] || p.crop_name,
    Min: p.min_price || Math.round(p.price * 0.92),
    Modal: p.price,
    Max: p.max_price || Math.round(p.price * 1.08)
  }));

  return (
    <div className="space-y-6 max-w-[1500px] mx-auto">
      {/* Top Banner */}
      <div className="bg-[#092218] text-white p-6 md:p-8 rounded-2xl border border-[#143e2e] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]"></span>
            <span className="text-[11px] font-bold text-[#86efac] uppercase tracking-wider">
              Module 7 – Agricultural Market Intelligence
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
            Mandi Market Prices & Price Discovery
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Live commodity clearing rates, price spreads, and APMC market intelligence backed by <code className="bg-[#143e2e] px-1.5 py-0.5 rounded text-[#86efac]">agrinova_db.market_prices</code> table.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded-xl shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Mandi Price</span>
          </button>
          <button
            onClick={loadPrices}
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

      {/* Price Comparison Chart */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#16a34a]" />
              <span>APMC Mandi Price Spreads (₹ / Quintal)</span>
            </h3>
            <p className="text-[11px] text-slate-400">Comparing Minimum, Modal (Clearing), and Maximum arrival quotes</p>
          </div>
          <span className="text-xs font-bold text-[#16a34a] bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
            Live Quotations
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="crop" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#092218', borderRadius: '12px', color: '#fff', fontSize: '11px', border: 'none' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="Min" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Min Price (₹)" />
              <Bar dataKey="Modal" fill="#16a34a" radius={[4, 4, 0, 0]} name="Modal Price (₹)" />
              <Bar dataKey="Max" fill="#092218" radius={[4, 4, 0, 0]} name="Max Price (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search crop or APMC mandi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Commodity:</span>
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
          >
            <option value="ALL">All Commodities</option>
            {uniqueCrops.map((c, idx) => (
              <option key={idx} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Prices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">Mandi Price Records (market_prices table)</h3>
          <span className="text-xs text-slate-400 font-semibold">{filteredPrices.length} records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Quote ID</th>
                <th className="px-5 py-3">Commodity Crop</th>
                <th className="px-5 py-3">APMC Mandi Market</th>
                <th className="px-5 py-3">Modal Price</th>
                <th className="px-5 py-3">Min Price</th>
                <th className="px-5 py-3">Max Price</th>
                <th className="px-5 py-3">Quotation Date</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredPrices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-slate-400">
                    No mandi price records found.
                  </td>
                </tr>
              ) : (
                filteredPrices.map((p) => (
                  <tr key={p.price_id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-3.5 font-bold text-slate-900">#{p.price_id}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-[#16a34a]" />
                        <span>{p.crop_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{p.market_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-black text-[#16a34a]">
                        ₹{parseFloat(p.price).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal ml-1">/ Qtl</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">
                      ₹{parseFloat(p.min_price || p.price * 0.92).toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-slate-900 font-bold">
                      ₹{parseFloat(p.max_price || p.price * 1.08).toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 text-[11px]">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{p.price_date}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingPrice(p)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#16a34a] hover:bg-emerald-50 transition"
                          title="Edit Price"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePrice(p.price_id, p.crop_name)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Delete Price"
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

      {/* ADD PRICE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Add Mandi Price Record</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePrice} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Crop Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wheat, Chilli"
                    value={newPrice.crop_name}
                    onChange={(e) => setNewPrice({ ...newPrice, crop_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mandi Market</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Guntur APMC"
                    value={newPrice.market_name}
                    onChange={(e) => setNewPrice({ ...newPrice, market_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Modal Price (₹)</label>
                  <input
                    type="number"
                    step="10"
                    required
                    value={newPrice.price}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setNewPrice({
                        ...newPrice,
                        price: val,
                        min_price: Math.round(val * 0.92),
                        max_price: Math.round(val * 1.08)
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Min Price (₹)</label>
                  <input
                    type="number"
                    step="10"
                    value={newPrice.min_price}
                    onChange={(e) => setNewPrice({ ...newPrice, min_price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Price (₹)</label>
                  <input
                    type="number"
                    step="10"
                    value={newPrice.max_price}
                    onChange={(e) => setNewPrice({ ...newPrice, max_price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quotation Date</label>
                <input
                  type="date"
                  value={newPrice.price_date}
                  onChange={(e) => setNewPrice({ ...newPrice, price_date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                />
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
                  Save Mandi Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PRICE MODAL */}
      {editingPrice && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Edit Price Record #{editingPrice.price_id}</h3>
              <button onClick={() => setEditingPrice(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdatePrice} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Crop Name</label>
                  <input
                    type="text"
                    required
                    value={editingPrice.crop_name}
                    onChange={(e) => setEditingPrice({ ...editingPrice, crop_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Market</label>
                  <input
                    type="text"
                    required
                    value={editingPrice.market_name}
                    onChange={(e) => setEditingPrice({ ...editingPrice, market_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Modal Price</label>
                  <input
                    type="number"
                    step="10"
                    required
                    value={editingPrice.price}
                    onChange={(e) => setEditingPrice({ ...editingPrice, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Min Price</label>
                  <input
                    type="number"
                    step="10"
                    value={editingPrice.min_price}
                    onChange={(e) => setEditingPrice({ ...editingPrice, min_price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Price</label>
                  <input
                    type="number"
                    step="10"
                    value={editingPrice.max_price}
                    onChange={(e) => setEditingPrice({ ...editingPrice, max_price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  value={editingPrice.price_date}
                  onChange={(e) => setEditingPrice({ ...editingPrice, price_date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPrice(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold"
                >
                  Update Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
