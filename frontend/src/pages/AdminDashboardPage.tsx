import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Database,
  Cpu,
  Radio,
  MessageSquare,
  Star,
  CheckCircle2,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';

export const AdminDashboardPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [newFeedback, setNewFeedback] = useState({
    name: 'Dr. Gurpreet Singh',
    email: 'gurpreet@pau.edu',
    rating: 5,
    category: 'Agronomy Models',
    comments: 'The PySpark crop production pipeline and fertilizer calculator align accurately with PAU recommendations.'
  });
  const [fbSuccess, setFbSuccess] = useState(false);

  const loadAdminData = async () => {
    try {
      const [uRes, fRes] = await Promise.all([
        api.getUsers(),
        api.getFeedback()
      ]);
      setUsers(uRes.data || []);
      setFeedbackList(fRes.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.submitFeedback(newFeedback);
      setFbSuccess(true);
      await loadAdminData();
      setTimeout(() => setFbSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
            Administrative Control Console
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-2">AgriNova System Administration</h1>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            User access control, registered farmer accounts, system audit telemetry, and user feedback evaluations.
          </p>
        </div>
      </div>

      {/* User Management Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" /> Registered Farmers & Administrative Users
          </h3>
          <span className="text-xs text-slate-500 font-semibold">{users.length} Registered Accounts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-6">Full Name</th>
                <th className="py-3 px-6">Email</th>
                <th className="py-3 px-6">Assigned Role</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Registered On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {users.map((u, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-6 font-bold text-slate-900">{u.full_name}</td>
                  <td className="py-3 px-6 font-mono text-slate-600">{u.email}</td>
                  <td className="py-3 px-6">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {u.role?.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-6">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                    </span>
                  </td>
                  <td className="py-3 px-6 text-slate-400 font-mono">{u.created_at?.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Submit Feedback Form */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" /> Submit Evaluator Feedback
          </h3>

          {fbSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Feedback recorded to MongoDB successfully!
            </div>
          )}

          <form onSubmit={handleFeedbackSubmit} className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Evaluator Name</label>
              <input
                type="text"
                required
                value={newFeedback.name}
                onChange={(e) => setNewFeedback({ ...newFeedback, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={newFeedback.email}
                onChange={(e) => setNewFeedback({ ...newFeedback, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={newFeedback.category}
                  onChange={(e) => setNewFeedback({ ...newFeedback, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Rating (1-5)</label>
                <select
                  value={newFeedback.rating}
                  onChange={(e) => setNewFeedback({ ...newFeedback, rating: parseInt(e.target.value) || 5 })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Very Good</option>
                  <option value={3}>3 - Good</option>
                  <option value={2}>2 - Fair</option>
                  <option value={1}>1 - Needs Work</option>
                </select>
              </div>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Comments & Observations</label>
              <textarea
                rows={3}
                required
                value={newFeedback.comments}
                onChange={(e) => setNewFeedback({ ...newFeedback, comments: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md shadow-emerald-600/30"
            >
              Submit Platform Review
            </button>
          </form>
        </div>

        {/* Feedback List */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center justify-between">
            <span>Evaluator Reviews</span>
            <span className="text-xs text-slate-400 font-semibold">{feedbackList.length} Total</span>
          </h3>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {feedbackList.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">No feedback recorded yet.</p>
            ) : (
              feedbackList.map((f, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{f.name}</span>
                    <span className="flex items-center text-amber-500 font-bold">
                      {'★'.repeat(f.rating || 5)}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold uppercase">{f.category}</span>
                  <p className="text-slate-600 mt-1">{f.comments}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
