import React, { useState, useEffect } from 'react';
import {
  Radio,
  Send,
  RefreshCw,
  Cpu,
  Layers,
  Database,
  CheckCircle2,
  Activity,
  Zap
} from 'lucide-react';
import { api } from '../services/api';

export const KafkaStreamingPage: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [generating, setGenerating] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('ALL');

  const loadData = async () => {
    try {
      const [mRes, eRes] = await Promise.all([
        api.getKafkaMetrics(),
        api.getKafkaEvents(30)
      ]);
      setMetrics(mRes.data);
      setEvents(eRes.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // 5s polling for live stream
    return () => clearInterval(interval);
  }, []);

  const generateBatch = async () => {
    setGenerating(true);
    try {
      await api.generateKafkaEvents(8);
      await loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const filteredEvents = selectedTopic === 'ALL'
    ? events
    : events.filter(e => e.topic === selectedTopic || e.topic?.includes(selectedTopic.replace('mythora-', '')));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30 uppercase tracking-wider">
            AgriNova Event Streaming • Smart Farming, Better Tomorrow.
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-2">AgriNova Apache Kafka Event Streaming</h1>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            High-velocity Pub/Sub telemetry ingestion across dedicated agricultural topics feeding Spark Structured Streaming.
          </p>
        </div>

        <button
          onClick={generateBatch}
          disabled={generating}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition shadow-lg shadow-purple-600/30"
        >
          <Zap className={`w-4 h-4 ${generating ? 'animate-bounce' : ''}`} />
          {generating ? 'Broadcasting...' : 'Publish Synthetic Telemetry Batch'}
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Broker Status</span>
          <p className="text-2xl font-black text-emerald-600 mt-2 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            {metrics?.broker_status || 'ONLINE'}
          </p>
          <p className="text-xs text-slate-500 mt-1">Port 9092</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Topics</span>
          <p className="text-2xl font-black text-slate-900 mt-2">4 Topics</p>
          <p className="text-xs text-slate-500 mt-1">3 Partitions / Topic</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Consumer Groups</span>
          <p className="text-2xl font-black text-blue-600 mt-2">2 Active</p>
          <p className="text-xs text-slate-500 mt-1">Spark Structured Stream</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Events in Buffer</span>
          <p className="text-2xl font-black text-purple-600 mt-2">{events.length} Events</p>
          <p className="text-xs text-slate-500 mt-1">Live Ingestion Buffer</p>
        </div>
      </div>

      {/* Topics Overview */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: 'mythora-weather', desc: 'Station temp, humidity, wind & rain rate' },
          { name: 'mythora-soil', desc: 'IoT field probe moisture, EC & pH' },
          { name: 'mythora-market', desc: 'Mandi spot trade arrival updates' },
          { name: 'mythora-irrigation', desc: 'Smart irrigation automated valve events' },
        ].map((t) => (
          <div key={t.name} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="font-mono text-xs font-bold text-slate-900">{t.name}</p>
            <p className="text-[11px] text-slate-500 mt-1">{t.desc}</p>
          </div>
        ))}
      </div>

      {/* Live Events Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <h3 className="text-base font-bold text-slate-900">Live Streaming Telemetry Events</h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Filter Topic:</span>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500 font-semibold text-slate-700"
            >
              <option value="ALL">All Topics</option>
              <option value="mythora-weather">mythora-weather</option>
              <option value="mythora-soil">mythora-soil</option>
              <option value="mythora-market">mythora-market</option>
              <option value="mythora-irrigation">mythora-irrigation</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-6">Timestamp</th>
                <th className="py-3 px-6">Topic</th>
                <th className="py-3 px-6">Partition / Offset</th>
                <th className="py-3 px-6">Key</th>
                <th className="py-3 px-6">Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredEvents.map((evt, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-6 text-slate-400 font-mono">{evt.timestamp?.slice(11, 19)}</td>
                  <td className="py-3 px-6">
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-purple-50 text-purple-700">
                      {evt.topic}
                    </span>
                  </td>
                  <td className="py-3 px-6 font-mono text-slate-500">P-{evt.partition} / #{evt.offset}</td>
                  <td className="py-3 px-6 font-bold text-slate-900">{evt.key}</td>
                  <td className="py-3 px-6 font-mono text-slate-600 truncate max-w-md">
                    {JSON.stringify(evt.payload)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
