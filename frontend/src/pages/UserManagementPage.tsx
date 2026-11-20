import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Shield,
  MapPin,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  X,
  UserCheck
} from 'lucide-react';
import { api } from '../services/api';

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: 'Andhra Pradesh',
    role: 'farmer'
  });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await api.getSqlUsers();
      setUsers(res.data || []);
    } catch (err: any) {
      console.error(err);
      setActionError('Failed to fetch users from SQL database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    try {
      await api.createSqlUser(newUser);
      setActionSuccess(`User ${newUser.name} created successfully!`);
      setShowAddModal(false);
      setNewUser({
        name: '',
        email: '',
        password: '',
        phone: '',
        location: 'Andhra Pradesh',
        role: 'farmer'
      });
      await loadUsers();
      setTimeout(() => setActionSuccess(null), 3500);
    } catch (err: any) {
      setActionError(err.response?.data?.detail || 'Error creating user');
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setActionError(null);
    try {
      await api.updateSqlUser(editingUser.user_id, {
        name: editingUser.name,
        email: editingUser.email,
        phone: editingUser.phone,
        location: editingUser.location,
        role: editingUser.role
      });
      setActionSuccess(`User #${editingUser.user_id} updated successfully!`);
      setEditingUser(null);
      await loadUsers();
      setTimeout(() => setActionSuccess(null), 3500);
    } catch (err: any) {
      setActionError(err.response?.data?.detail || 'Error updating user');
    }
  };

  const handleDeleteUser = async (userId: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete user "${name}" (ID #${userId})? This will also remove associated crops and soil records.`)) {
      return;
    }
    try {
      await api.deleteSqlUser(userId);
      setActionSuccess(`User ${name} deleted.`);
      await loadUsers();
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setActionError(err.response?.data?.detail || 'Error deleting user');
    }
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'ALL' || u.role?.toLowerCase() === selectedRole.toLowerCase();
    const matchesLoc = selectedLocation === 'ALL' || u.location?.toLowerCase().includes(selectedLocation.toLowerCase());
    return matchesSearch && matchesRole && matchesLoc;
  });

  const totalFarmers = users.filter(u => u.role?.toLowerCase() === 'farmer').length;
  const totalAdmins = users.filter(u => u.role?.toLowerCase() === 'admin').length;
  const locations = Array.from(new Set(users.map(u => u.location).filter(Boolean)));

  return (
    <div className="space-y-6 max-w-[1500px] mx-auto">
      {/* Top Header Banner */}
      <div className="bg-[#092218] text-white p-6 md:p-8 rounded-2xl border border-[#143e2e] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]"></span>
            <span className="text-[11px] font-bold text-[#86efac] uppercase tracking-wider">
              Module 1 – Relational SQL Management
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
            User & Farmer Management
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            CRUD operations, role management, and farmer profiling backed by <code className="bg-[#143e2e] px-1.5 py-0.5 rounded text-[#86efac]">agrinova_db.users</code> table.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold transition shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            Add New User
          </button>
          <button
            onClick={loadUsers}
            disabled={loading}
            className="p-2.5 rounded-xl bg-[#143e2e] hover:bg-[#1b523c] text-slate-200 transition"
            title="Refresh Users"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Notifications */}
      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)}><X className="w-4 h-4" /></button>
        </div>
      )}
      {actionError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Registered Users</span>
            <div className="w-9 h-9 rounded-xl bg-[#E8F1E9] text-[#16a34a] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{users.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">Direct from SQL Database</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Active Farmers</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2">{totalFarmers}</p>
          <p className="text-[11px] text-slate-400 mt-1">Cultivating monitored plots</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Platform Administrators</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2">{totalAdmins}</p>
          <p className="text-[11px] text-slate-400 mt-1">Includes Sana Mohitha (Super Admin)</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Covered Regions</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-blue-600 mt-2">{locations.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">Andhra Pradesh, Punjab, etc.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Role:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
            >
              <option value="ALL">All Roles</option>
              <option value="farmer">Farmers</option>
              <option value="admin">Administrators</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span>Location:</span>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
            >
              <option value="ALL">All States</option>
              {locations.map((loc, idx) => (
                <option key={idx} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">SQL User Records</h3>
            <p className="text-[11px] text-slate-400">Total {filteredUsers.length} records matching current criteria</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">User ID</th>
                <th className="px-5 py-3">Full Name</th>
                <th className="px-5 py-3">Email Address</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Location</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Created Date</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-slate-400">
                    No users match your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isAdmin = u.role?.toLowerCase() === 'admin';
                  return (
                    <tr key={u.user_id} className="hover:bg-slate-50/60 transition">
                      <td className="px-5 py-3.5 font-bold text-slate-900">#{u.user_id}</td>
                      <td className="px-5 py-3.5 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black ${isAdmin ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {u.name?.charAt(0) || 'U'}
                          </div>
                          <span>{u.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{u.email}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{u.phone || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{u.location || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isAdmin ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'}`}>
                          {isAdmin ? <Shield className="w-3 h-3 text-amber-700" /> : <UserCheck className="w-3 h-3 text-emerald-700" />}
                          {u.role || 'farmer'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 text-[11px]">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{u.created_at ? new Date(u.created_at).toLocaleDateString() : 'Active'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingUser(u)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#16a34a] hover:bg-emerald-50 transition"
                            title="Edit User"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.user_id, u.name)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE USER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Add New Agricultural User</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar Patel"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="ramesh@agrinova.ai"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+91-9876543210"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location / State</label>
                  <input
                    type="text"
                    placeholder="Andhra Pradesh"
                    value={newUser.location}
                    onChange={(e) => setNewUser({ ...newUser, location: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">User Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                >
                  <option value="farmer">Farmer</option>
                  <option value="admin">Administrator</option>
                </select>
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
                  Save User to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Edit User #{editingUser.user_id}</h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editingUser.phone || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={editingUser.location || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, location: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#16a34a] outline-none"
                >
                  <option value="farmer">Farmer</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
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
