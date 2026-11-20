import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Lock, Mail, User, MapPin, ArrowRight, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    state: 'Punjab',
    district: 'Ludhiana',
    role: 'farmer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.register(formData);
      localStorage.setItem('mythora_token', res.data.access_token);
      localStorage.setItem('mythora_user', JSON.stringify(res.data.user));
      localStorage.setItem('agrinova_token', res.data.access_token);
      localStorage.setItem('agrinova_user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto mb-2 shadow-lg shadow-emerald-500/30">
            <Sprout className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800">Create Farmer Account</h1>
          <p className="text-xs text-slate-500 mt-1">Join the AgriNova smart agriculture intelligence network • Smart Farming, Better Tomorrow.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-3.5">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="Kisan Singh"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="+91-9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                placeholder="kisan@mythora.ai"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">District</label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="text-emerald-600 font-bold hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
};
