import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Database,
  Server,
  Cpu,
  Radio,
  Sprout,
  TrendingUp,
  FlaskConical,
  CloudSun,
  ShieldAlert,
  ShoppingBag,
  Droplets,
  Bot,
  FileBarChart,
  User,
  ShieldCheck,
  Activity,
  LogOut,
  Menu,
  X,
  Bell,
  Sparkles,
  Info,
  ChevronRight,
  SunMedium
} from 'lucide-react';
import { api } from '../services/api';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('agrinova_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Default guest farmer
      setUser({ full_name: 'Ramesh Patel', role: 'farmer', email: 'farmer@agrinova.ai' });
    }

    api.getNotifications()
      .then(res => setNotifications(res.data || []))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('agrinova_token');
    localStorage.removeItem('agrinova_user');
    navigate('/login');
  };

  const navGroups = [
    {
      group: 'Overview',
      items: [
        { name: 'Farmer Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'About Platform', path: '/about', icon: Info },
      ]
    },
    {
      group: 'Big Data Infrastructure',
      items: [
        { name: 'Big Data Center', path: '/bigdata-analytics', icon: Database },
        { name: 'Hadoop HDFS', path: '/hadoop-monitor', icon: Server },
        { name: 'Spark Processing', path: '/spark-monitor', icon: Cpu },
        { name: 'Kafka Streaming', path: '/kafka-monitor', icon: Radio },
      ]
    },
    {
      group: 'Smart Agronomy & ML',
      items: [
        { name: 'Crop Recommender', path: '/crop-recommendation', icon: Sprout },
        { name: 'Yield Predictor', path: '/yield-prediction', icon: TrendingUp },
        { name: 'Soil Chemistry', path: '/soil-analytics', icon: FlaskConical },
        { name: 'Weather & Rain', path: '/weather-analytics', icon: CloudSun },
        { name: 'Fertilizer Advisor', path: '/fertilizer-recommendation', icon: Sparkles },
        { name: 'Disease Detection', path: '/disease-detection', icon: ShieldAlert },
        { name: 'Mandi Intelligence', path: '/market-intelligence', icon: ShoppingBag },
        { name: 'Smart Irrigation', path: '/irrigation-analytics', icon: Droplets },
      ]
    },
    {
      group: 'Intelligence & Admin',
      items: [
        { name: 'AI Farming Copilot', path: '/copilot', icon: Bot },
        { name: 'Analytics Reports', path: '/reports', icon: FileBarChart },
        { name: 'Farmer Profile', path: '/profile', icon: User },
        { name: 'Admin Dashboard', path: '/admin-dashboard', icon: ShieldCheck },
        { name: 'System Diagnostics', path: '/system-health', icon: Activity },
      ]
    }
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static`}>
        {/* Brand */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-950">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">AgriNova</span>
              <span className="block text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">Big Data AI</span>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {navGroups.map((grp) => (
            <div key={grp.group} className="space-y-1">
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">{grp.group}</p>
              {grp.items.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                      active
                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-emerald-400'}`} />
                    <span className="truncate">{item.name}</span>
                    {active && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-70" />}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer User Info */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-xs text-white">
              {user?.full_name ? user.full_name[0] : 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-200 truncate">{user?.full_name || 'Farmer'}</p>
              <p className="text-[10px] text-emerald-400 capitalize">{user?.role || 'User'}</p>
            </div>
          </div>
          <button onClick={handleLogout} title="Logout" className="text-slate-400 hover:text-rose-400 p-1.5 rounded transition">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Hadoop & Spark Active
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Kafka Ingestion Live
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications Trigger */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Notifications</span>
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">{notifications.length} New</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-500 p-4 text-center">No alerts at this time.</p>
                    ) : (
                      notifications.map((n, i) => (
                        <div key={i} className="p-3 text-xs hover:bg-slate-50 transition">
                          <p className="font-semibold text-slate-800">{n.title}</p>
                          <p className="text-slate-500 mt-0.5">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/profile"
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                {user?.full_name ? user.full_name[0] : 'U'}
              </div>
              <span className="text-xs font-semibold text-slate-700 hidden sm:inline">{user?.full_name || 'Ramesh Patel'}</span>
            </Link>
          </div>
        </header>

        {/* Page View Body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
