import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@agrinova.ai');
  const [password, setPassword] = useState('Admin@12345');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      localStorage.setItem('mythora_token', res.data.access_token);
      localStorage.setItem('mythora_user', JSON.stringify(res.data.user));
      localStorage.setItem('agrinova_token', res.data.access_token);
      localStorage.setItem('agrinova_user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (role: 'admin' | 'farmer') => {
    if (role === 'admin') {
      setEmail('admin@agrinova.ai');
      setPassword('Admin@12345');
    } else {
      setEmail('farmer@agrinova.ai');
      setPassword('Farmer@12345');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/30">
            <Sprout className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800">Welcome to AgriNova</h1>
          <p className="text-xs text-slate-500 mt-1">Smart Farming, Better Tomorrow. • Smart Agriculture Console</p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@mythora.ai"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Fill Buttons */}
        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400 font-semibold mb-2">Quick Demo Credentials</p>
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={() => setDemoCredentials('admin')}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              Fill Admin
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('farmer')}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition"
            >
              Fill Farmer
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          New to MYTHORA?{' '}
          <Link to="/register" className="text-emerald-600 font-bold hover:underline">
            Register Farmer Account
          </Link>
        </p>
      </div>
    </div>
  );
};
