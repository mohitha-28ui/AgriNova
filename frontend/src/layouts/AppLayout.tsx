import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Database,
  Cpu,
  Server,
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
  ChevronRight,
  Search,
  Calendar,
  Layers,
  ChevronDown,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Settings,
  Leaf,
  Sun
} from 'lucide-react';
import { api } from '../services/api';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('Andhra Pradesh');
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Load authenticated user
    const storedUser = localStorage.getItem('mythora_user') || localStorage.getItem('agrinova_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error(e);
      }
    } else {
      setUser({ full_name: 'Sana Mohitha', role: 'Farmer', email: 'sanamohitha@agrinova.ai' });
    }

    // Load live notifications
    api.getNotifications()
      .then(res => setNotifications(res.data || []))
      .catch(() => {
        setNotifications([
          { title: 'Database Latency Spike', event_name: 'Database Latency Spike', status: 'Critical', source: 'US-East-1', timestamp: 'Today, 10:42 AM' },
          { title: 'High Temperature Alert', event_name: 'High Temperature Alert', status: 'Warning', source: 'Zone 3', timestamp: 'Today, 09:20 AM' },
          { title: 'New Farmer Registered', event_name: 'New Farmer Registered', status: 'Info', source: 'Web Portal', timestamp: 'Today, 08:15 AM' }
        ]);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('mythora_token');
    localStorage.removeItem('mythora_user');
    localStorage.removeItem('agrinova_token');
    localStorage.removeItem('agrinova_user');
    navigate('/login');
  };

  const statesList = [
    'Andhra Pradesh',
    'Punjab',
    'Haryana',
    'Madhya Pradesh',
    'Maharashtra',
    'Uttar Pradesh',
    'Gujarat',
    'Karnataka'
  ];

  // 12 Exact Navigation Items from Reference Screenshot
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Crop Recommendation', path: '/crop-recommendation', icon: Sprout },
    { name: 'Yield Prediction', path: '/yield-prediction', icon: TrendingUp },
    { name: 'Soil Health', path: '/soil-analytics', icon: FlaskConical },
    { name: 'Weather Analytics', path: '/weather-analytics', icon: CloudSun },
    { name: 'Market Analytics', path: '/market-intelligence', icon: ShoppingBag },
    { name: 'Disease Detection', path: '/disease-detection', icon: ShieldAlert },
    { name: 'Fertilizer Suggestion', path: '/fertilizer-recommendation', icon: Sparkles },
    { name: 'Big Data Analytics', path: '/bigdata-analytics', icon: Database },
    { name: 'Reports', path: '/reports', icon: FileBarChart },
    { name: 'Notifications', path: '/admin-dashboard', icon: Bell, badge: 3 },
    { name: 'Settings', path: '/profile', icon: Settings },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes('crop') || q.includes('wheat') || q.includes('rice')) navigate('/crop-recommendation');
    else if (q.includes('yield') || q.includes('predict')) navigate('/yield-prediction');
    else if (q.includes('soil') || q.includes('ph') || q.includes('npk')) navigate('/soil-analytics');
    else if (q.includes('weather') || q.includes('rain') || q.includes('temp')) navigate('/weather-analytics');
    else if (q.includes('price') || q.includes('mandi') || q.includes('market')) navigate('/market-intelligence');
    else if (q.includes('disease') || q.includes('blight') || q.includes('pest')) navigate('/disease-detection');
    else if (q.includes('data') || q.includes('spark') || q.includes('hdfs')) navigate('/bigdata-analytics');
    else navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex bg-[#F0F4F1] text-[#1F2937] font-sans antialiased">
      {/* LEFT SIDEBAR - Forest Green Enterprise Identity matching Screenshot */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#092218] text-white flex flex-col transition-transform duration-300 ease-in-out border-r border-[#0d2f21] ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static`}>
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-[#123829] bg-[#071c14]">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#22c55e] to-[#15803d] flex items-center justify-center text-white shadow-md shadow-emerald-950/50 group-hover:scale-105 transition">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white block">AgriNova</span>
              <span className="block text-[10px] text-[#86efac] font-medium tracking-wide">Smart Farming. Better Tomorrow.</span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-[#A3C6AF] hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 12 Functional Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3.5 px-4 py-2.5 text-xs font-medium rounded-xl transition-all ${active
                  ? 'bg-[#22c55e] text-white shadow-md shadow-emerald-600/30 font-bold'
                  : 'text-[#94a3b8] hover:bg-[#123829] hover:text-white'
                  }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-[#86efac]'}`} />
                <span className="truncate">{item.name}</span>
                {item.badge && (
                  <span className="ml-auto w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer User Card with Sana Mohitha */}
        <div className="p-4 border-t border-[#123829] bg-[#071c14] space-y-2">
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#0d2f21] border border-[#164332]">
            <Link to="/profile" className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full ring-2 ring-[#22c55e] bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-bold text-sm text-white flex-shrink-0 shadow-md">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate leading-tight">Sana Mohitha</p>
                <p className="text-[10px] text-[#86efac] truncate font-medium">Farmer</p>
              </div>
            </Link>
            <ChevronDown className="w-4 h-4 text-[#86efac]" />
          </div>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#94a3b8] hover:text-rose-300 hover:bg-[#123829] rounded-lg transition"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN VIEWPORT CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOP NAVIGATION BAR matching the reference screenshot */}
        <header className="bg-white border-b border-[#E2E8F0] px-6 py-3.5 sticky top-0 z-40 shadow-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Left: Mobile Toggle & Location Dropdown */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-[#64748B] hover:text-[#1F2937] hover:bg-[#F7F9F6] rounded-lg transition"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Location Selector Pill */}
              <div className="relative">
                <button
                  onClick={() => setShowLocationMenu(!showLocationMenu)}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF7EE] border border-[#C5E8CE] text-xs font-bold text-[#15803d] hover:bg-[#dcfce7] transition shadow-xs"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#22c55e]" />
                  <span>{selectedState}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#15803d]" />
                </button>

                {showLocationMenu && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-[#E2E8F0] py-1.5 z-50 text-xs">
                    <p className="px-3 py-1 font-bold text-[10px] text-slate-400 uppercase tracking-wider">Select Region</p>
                    {statesList.map(st => (
                      <button
                        key={st}
                        onClick={() => { setSelectedState(st); setShowLocationMenu(false); }}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-[#F0FDF4] transition flex items-center justify-between ${selectedState === st ? 'font-bold text-[#15803d] bg-[#DCFCE7]' : 'text-slate-700'
                          }`}
                      >
                        <span>{st}</span>
                        {selectedState === st && <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Center: Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-2 hidden sm:block">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search for insights, crops, or features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full text-xs text-[#1F2937] placeholder-slate-400 focus:outline-none focus:border-[#22c55e] focus:bg-white focus:ring-2 focus:ring-[#22c55e]/20 transition shadow-2xs"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-[#15803d]"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* Right: Weather Pill, Notification Bell, Leaf Action */}
            <div className="flex items-center gap-2.5">
              {/* Weather Pill */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-xs font-bold text-amber-800 shadow-2xs">
                <Sun className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>28°C</span>
              </div>

              {/* Notification Icon */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                    3
                  </span>
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Recent Alerts</span>
                      <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                        3 New
                      </span>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                      {notifications.map((n, i) => (
                        <div key={i} className="p-3 text-xs hover:bg-slate-50 transition">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${n.status === 'Critical' ? 'bg-rose-500' : n.status === 'Warning' ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}></span>
                            <p className="font-bold text-slate-800">{n.event_name || n.title}</p>
                            <span className="ml-auto text-[10px] text-slate-400">{n.timestamp}</span>
                          </div>
                          <p className="text-slate-500 text-[11px] mt-1 pl-4">{n.message || n.source}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Leaf Action Button */}
              <Link
                to="/crop-recommendation"
                title="Crop Intelligence"
                className="p-2 rounded-full bg-[#EBF7EE] text-[#15803d] hover:bg-[#dcfce7] transition shadow-2xs"
              >
                <Leaf className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-[#F0F4F1]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
