import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  RefreshCw,
  UserCheck,
  Shield,
  Clock
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
      {/* Header Banner */}
      <div className="bg-[#173F35] text-white p-6 md:p-8 rounded-xl border border-[#103028] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4E8B62]"></span>
            <span className="text-[11px] font-semibold text-[#A3C6AF] uppercase tracking-wider">
              AgriNova Administrative Control Console
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mt-1">
            Welcome, Sana Mohitha
          </h1>
          <p className="text-xs text-[#D0E2D5] mt-1 max-w-xl leading-relaxed">
            Platform Administrator: <strong>Sana Mohitha</strong> • Full control over AgriNova user accounts, cluster security, model versions, and system telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#214D41] text-[#E8F1E9] border border-[#2F6D5D]">
            <Shield className="w-3.5 h-3.5 text-[#4E8B62]" />
            Role: System Administrator (ADMIN)
          </span>
        </div>
      </div>

      {/* User Management Table */}
      <div className="bg-white rounded-xl border border-[#E5EAE5] shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5EAE5] flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-[#173F35] uppercase tracking-wide flex items-center gap-2">
              <Users className="w-4 h-4 text-[#4E8B62]" />
              <span>Registered Farmers & Administrative Users</span>
            </h3>
            <p className="text-[11px] text-[#64748B]">Authenticated system accounts in AgriNova Enterprise Database</p>
          </div>
          <span className="text-xs font-semibold text-[#173F35] bg-[#E8F1E9] px-2.5 py-1 rounded-full">
            {users.length} Registered Accounts
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#173F35] bg-[#E8F1E9] px-2.5 py-1 rounded-full">
              {users.length} Registered Accounts
            </span>
            <Link
              to="/users"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold transition shadow-2xs"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Full User Management (SQL)</span>
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F9F6] text-[#64748B] font-semibold border-b border-[#E5EAE5]">
              <tr>
                <th className="py-3 px-5">Full Name</th>
                <th className="py-3 px-5">Email Address</th>
                <th className="py-3 px-5">Assigned Role</th>
                <th className="py-3 px-5">Account Status</th>
                <th className="py-3 px-5">Registered On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAE5] text-[#1F2937]">
              {users.map((u, i) => (
                <tr key={i} className="hover:bg-[#FDFEFC] transition">
                  <td className="py-3.5 px-5 font-bold text-[#173F35] flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-[#173F35] text-white flex items-center justify-center font-bold text-[10px]">
                      {u.full_name ? u.full_name[0] : 'U'}
                    </div>
                    <span>{u.full_name}</span>
                  </td>
                  <td className="py-3.5 px-5 font-mono text-[#64748B]">{u.email}</td>
                  <td className="py-3.5 px-5">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${u.role?.toLowerCase() === 'admin'
                      ? 'bg-[#173F35] text-white shadow-2xs'
                      : 'bg-[#E8F1E9] text-[#173F35]'
                      }`}>
                      {u.role?.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#4E8B62]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4E8B62]"></span> Active
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-[#64748B] font-mono">{u.created_at?.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Evaluator Feedback Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Submit Feedback Form */}
        <div className="bg-white p-5 rounded-xl border border-[#E5EAE5] shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-[#173F35] uppercase tracking-wide flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#4E8B62]" /> Submit Evaluator Feedback
          </h3>

          {fbSuccess && (
            <div className="p-3 rounded-lg bg-[#E8F1E9] text-[#173F35] text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#4E8B62]" /> Feedback recorded to MongoDB successfully!
            </div>
          )}

          <form onSubmit={handleFeedbackSubmit} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-[#64748B] block mb-1">Evaluator Name</label>
              <input
                type="text"
                required
                value={newFeedback.name}
                onChange={(e) => setNewFeedback({ ...newFeedback, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E5EAE5] text-[#1F2937] focus:outline-none focus:border-[#4E8B62]"
              />
            </div>
            <div>
              <label className="font-semibold text-[#64748B] block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={newFeedback.email}
                onChange={(e) => setNewFeedback({ ...newFeedback, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E5EAE5] text-[#1F2937] focus:outline-none focus:border-[#4E8B62]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-[#64748B] block mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={newFeedback.category}
                  onChange={(e) => setNewFeedback({ ...newFeedback, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#E5EAE5] text-[#1F2937] focus:outline-none focus:border-[#4E8B62]"
                />
              </div>
              <div>
                <label className="font-semibold text-[#64748B] block mb-1">Rating (1-5)</label>
                <select
                  value={newFeedback.rating}
                  onChange={(e) => setNewFeedback({ ...newFeedback, rating: parseInt(e.target.value) || 5 })}
                  className="w-full px-3 py-2 rounded-lg border border-[#E5EAE5] text-[#1F2937] font-semibold focus:outline-none focus:border-[#4E8B62]"
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
              <label className="font-semibold text-[#64748B] block mb-1">Comments & Observations</label>
              <textarea
                rows={3}
                required
                value={newFeedback.comments}
                onChange={(e) => setNewFeedback({ ...newFeedback, comments: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E5EAE5] text-[#1F2937] focus:outline-none focus:border-[#4E8B62]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-[#173F35] hover:bg-[#234430] text-white font-semibold text-xs transition shadow-xs"
            >
              Submit Platform Review
            </button>
          </form>
        </div>

        {/* Feedback List */}
        <div className="bg-white p-5 rounded-xl border border-[#E5EAE5] shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-[#173F35] uppercase tracking-wide flex items-center justify-between">
            <span>Evaluator Reviews</span>
            <span className="text-[11px] text-[#64748B] font-semibold">{feedbackList.length} Total</span>
          </h3>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {feedbackList.length === 0 ? (
              <p className="text-xs text-[#64748B] text-center py-8">No feedback recorded yet.</p>
            ) : (
              feedbackList.map((f, i) => (
                <div key={i} className="p-3.5 rounded-lg bg-[#F7F9F6] border border-[#E5EAE5] text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#173F35]">{f.name}</span>
                    <span className="flex items-center text-amber-500 font-bold">
                      {'★'.repeat(f.rating || 5)}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#4E8B62] font-semibold uppercase">{f.category}</span>
                  <p className="text-[#64748B] mt-1">{f.comments}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
