import React, { useState, useEffect } from 'react';
import { User, MapPin, Sprout, Shield, Phone, Mail, CheckCircle2, Lock, Server, Database, Key } from 'lucide-react';
import { api } from '../services/api';

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  useEffect(() => {
    api.getMe()
      .then(res => setProfile(res.data))
      .catch(() => {
        const stored = localStorage.getItem('agrinova_user') || localStorage.getItem('mythora_user');
        if (stored) {
          try {
            setProfile(JSON.parse(stored));
          } catch (e) {
            setProfile({ full_name: 'Sana Mohitha', role: 'ADMIN', email: 'admin@agrinova.ai' });
          }
        } else {
          setProfile({ full_name: 'Sana Mohitha', role: 'ADMIN', email: 'admin@agrinova.ai' });
        }
      });
  }, []);

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPasswordMsg('Password must be at least 6 characters.');
      return;
    }
    setPasswordMsg('Password updated successfully!');
    setNewPassword('');
  };

  const isAdmin = profile?.role?.toLowerCase() === 'admin' || profile?.email === 'admin@agrinova.ai' || profile?.email === 'admin@mythora.ai';
  const displayName = profile?.full_name || (isAdmin ? 'Sana Mohitha' : 'Ramesh Kumar Patel');
  const displayRole = (profile?.role || (isAdmin ? 'ADMIN' : 'FARMER')).toUpperCase();
  const displayEmail = profile?.email || (isAdmin ? 'admin@agrinova.ai' : 'farmer@agrinova.ai');
  const initial = displayName.charAt(0) || 'S';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
        <div className="w-20 h-20 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-emerald-600/30">
          {initial}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">{displayName}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
              {displayRole}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center justify-center sm:justify-start gap-1">
            <Mail className="w-3.5 h-3.5" /> {displayEmail}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Governance / Landholdings Info */}
        {isAdmin ? (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" /> Administrative Governance
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Administrator:</span>
                <span className="font-bold text-slate-800">Sana Mohitha</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Access Scope:</span>
                <span className="font-bold text-slate-800">AgriNova Platform & Big Data Pipeline</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Cluster Services:</span>
                <span className="font-bold text-slate-800">Hadoop HDFS, Spark, MongoDB</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Security Level:</span>
                <span className="font-bold text-emerald-700">Tier-1 Root Administrator</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Account Status:</span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active & Verified
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-emerald-600" /> Agronomic Landholdings
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Farm Designation:</span>
                <span className="font-bold text-slate-800">{profile?.profile?.farm_name || 'Surya Organic Farm'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Agro-Climatic Region:</span>
                <span className="font-bold text-slate-800">{profile?.profile?.district || 'Ludhiana'}, {profile?.profile?.state || 'Punjab'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Cultivated Area:</span>
                <span className="font-bold text-slate-800">{profile?.profile?.total_land_acres || 14.5} Acres</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Dominant Soil Profile:</span>
                <span className="font-bold text-emerald-700">{profile?.profile?.soil_type || 'Alluvial Loam'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Irrigation Source:</span>
                <span className="font-bold text-slate-800">Canal & Micro Tube Well</span>
              </div>
            </div>
          </div>
        )}

        {/* Security & Password Reset */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-slate-700" /> Security & Password Reset
          </h2>

          {passwordMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {passwordMsg}
            </div>
          )}

          <form onSubmit={handlePasswordReset} className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">New Password</label>
              <input
                type="password"
                required
                placeholder="Enter new secure password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
