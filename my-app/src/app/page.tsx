"use client"

import React, {useState} from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { AlertCircle, Clock, Users, CheckCircle, Zap, X, Trash2, Edit2, TrendingUp } from "lucide-react";

const dentists = ["Dr Abdulqudus", "Dr Usman", "Dr Kamal", "Dr Seun", "Dr Samuel"];
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const shifts = ["Morning", "Afternoon"];
const requestsMap: Record<string, string[]> = { "Dr Abdulqudus": ["Friday"], "Dr Kamal": ["Monday"] };

interface Schedule {
  [dentist: string]: {
    [day: string]: string | null;
  };
}

interface Conflicts {
  [dentist: string]: {
    [day: string]: boolean;
  };
}

export default function AdminPanel() {
  const [maxShifts, setMaxShifts] = useState(3);
  const [schedule, setSchedule] = useState<Schedule>(() =>
    dentists.reduce((acc, d) => ({
      ...acc,
      [d]: days.reduce((a, day) => ({ ...a, [day]: null }), {})
    }), {})
  );

  const [conflicts, setConflicts] = useState<Conflicts>({});
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [autoAssignLogs, setAutoAssignLogs] = useState<string[]>([]);

  const totalShifts = Object.values(schedule)
    .flatMap((d: Record<string, string | null>) => Object.values(d))
    .filter(Boolean).length;

  const autoAssign = () => {
    const newSchedule = JSON.parse(JSON.stringify(schedule)) as Schedule;
    const shiftCounts: Record<string, number> = {};
    dentists.forEach(d => (shiftCounts[d] = 0));
    const newConflicts: Conflicts = {};
    const logs: string[] = [];

    days.forEach(day => {
      shifts.forEach(shift => {
        const available = dentists.filter(
          d => shiftCounts[d] < maxShifts && !requestsMap[d]?.includes(day)
        );

        if (!available.length) {
          logs.push(`❌ ${shift} on ${day}: No available dentist`);
          return;
        }

        const minShifts = Math.min(...available.map(d => shiftCounts[d]));
        const candidates = available.filter(d => shiftCounts[d] === minShifts);
        const chosen = candidates[Math.floor(Math.random() * candidates.length)];

        if (Object.values(newSchedule[chosen]).includes(shift)) {
          if (!newConflicts[chosen]) newConflicts[chosen] = {};
          newConflicts[chosen][day] = true;
          logs.push(`⚠️ ${chosen} assigned to ${shift} on ${day} (conflict)`);
        } else {
          logs.push(`✅ ${chosen} assigned to ${shift} on ${day}`);
        }

        newSchedule[chosen][day] = shift;
        shiftCounts[chosen]++;
      });
    });

    setSchedule(newSchedule);
    setConflicts(newConflicts);
    setAutoAssignLogs(logs);

    const notifs: string[] = [];
    Object.entries(requestsMap).forEach(([dentist, days_off]) => {
      notifs.push(`🙏 ${dentist} excluded from: ${days_off.join(", ")}`);
    });
    if (Object.keys(newConflicts).length > 0) {
      notifs.push(`⚠️ ${Object.keys(newConflicts).length} dentist(s) have conflicts`);
    }
    notifs.push(`📊 Total shifts assigned: ${totalShifts + shifts.length * days.length}`);
    setNotifications(notifs);
  };

  const resetSchedule = () => {
    setSchedule(
      dentists.reduce((acc, d) => ({
        ...acc,
        [d]: days.reduce((a, day) => ({ ...a, [day]: null }), {})
      }), {})
    );
    setConflicts({});
    setNotifications([]);
    setAutoAssignLogs([]);
  };

  const handleSwap = (from: string, to: string, day: string) => {
    const s = JSON.parse(JSON.stringify(schedule)) as Schedule;
    [s[from][day], s[to][day]] = [s[to][day], s[from][day]];
    setSchedule(s);
    setNotifications([`🔄 Shift swapped: ${from} ↔ ${to} on ${day}`]);
  };

  const getShiftStats = () => {
    return dentists.map(d => ({
      name: d.split(" ")[1],
      shifts: Object.values(schedule[d]).filter(Boolean).length,
      requests: requestsMap[d]?.length || 0
    }));
  };

  const getShiftTypeStats = () => {
    const morning = Object.values(schedule).flatMap((d: Record<string, string | null>) => Object.values(d)).filter(v => v === "Morning").length;
    const afternoon = Object.values(schedule).flatMap((d: Record<string, string | null>) => Object.values(d)).filter(v => v === "Afternoon").length;
    return [
      { name: "Morning", value: morning },
      { name: "Afternoon", value: afternoon }
    ];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-2xl border-b border-blue-500/30">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                🦷 AI Dental Scheduler
              </h1>
              <p className="text-blue-100 mt-2 text-sm">Intelligent shift distribution with real-time conflict detection</p>
            </div>
            <div className="flex gap-4 flex-wrap">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
                <p className="text-2xl font-bold text-blue-200">{dentists.length}</p>
                <p className="text-xs text-blue-300 uppercase tracking-wide">Staff</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
                <p className="text-2xl font-bold text-green-300">{totalShifts}</p>
                <p className="text-xs text-blue-300 uppercase tracking-wide">Shifts</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
                <p className="text-2xl font-bold text-amber-300">{Object.keys(requestsMap).length}</p>
                <p className="text-xs text-blue-300 uppercase tracking-wide">Requests</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
                <p className="text-2xl font-bold text-purple-300">{maxShifts}</p>
                <p className="text-xs text-blue-300 uppercase tracking-wide">Max/Week</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* MAX_SHIFTS Control */}
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-6 mb-8 backdrop-blur shadow-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-purple-300 mb-2 flex items-center gap-2">
                <TrendingUp size={18} /> Maximum Shifts Per Dentist
              </h3>
              <p className="text-sm text-slate-300">
                Increasing MAX_SHIFTS allows more duties per dentist but also leads to higher conflict rates when multiple dentists approach their weekly limit. This parameter directly affects workload distribution and optimization performance in the Art Lottery Optimization-based scheduling system.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMaxShifts(Math.max(1, maxShifts - 1))}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                −
              </button>
              <div className="bg-slate-700/50 border border-slate-600 rounded-lg px-6 py-2 min-w-[4rem] text-center">
                <p className="text-3xl font-bold text-purple-300">{maxShifts}</p>
              </div>
              <button
                onClick={() => setMaxShifts(maxShifts + 1)}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <button
            onClick={autoAssign}
            className="group relative bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2"
          >
            <Zap size={18} />
            <span className="hidden sm:inline">Auto Assign</span>
          </button>
          <button
            onClick={() => setShowStatsModal(true)}
            className="group relative bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2"
          >
            <TrendingUp size={18} />
            <span className="hidden sm:inline">Analytics</span>
          </button>
          <button
            onClick={() => setShowSwapModal(true)}
            className="group relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2"
          >
            <Edit2 size={18} />
            <span className="hidden sm:inline">Swap</span>
          </button>
          <button
            onClick={resetSchedule}
            className="group relative bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2"
          >
            <Trash2 size={18} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="grid gap-2 mb-8">
            {notifications.map((notif, i) => (
              <div
                key={i}
                className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3 backdrop-blur animate-in fade-in slide-in-from-top"
              >
                <AlertCircle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-100">{notif}</p>
              </div>
            ))}
          </div>
        )}

        {/* Schedule Table */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-700 to-slate-600 border-b border-slate-600">
                  <th className="px-4 py-4 text-left font-semibold text-sm">Dentist</th>
                  {days.map(day => (
                    <th key={day} className="px-4 py-4 text-center font-semibold text-sm text-blue-300">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {dentists.map((dentist, idx) => (
                  <tr key={dentist} className={idx % 2 === 0 ? "bg-slate-800/30" : "bg-slate-700/20"}>
                    <td className="px-4 py-4 font-semibold text-sm">{dentist}</td>
                    {days.map(day => {
                      const shift = schedule[dentist][day];
                      const hasConflict = conflicts[dentist]?.[day];
                      const isRequest = requestsMap[dentist]?.includes(day);

                      return (
                        <td key={day} className="px-4 py-4 text-center">
                          <div
                            className={`h-12 rounded-lg flex items-center justify-center font-semibold text-sm cursor-pointer transition-all transform hover:scale-105 ${
                              hasConflict ? "bg-red-500/40 border border-red-400 text-red-200" :
                              shift === "Morning" ? "bg-blue-500/40 border border-blue-400 text-blue-100" :
                              shift === "Afternoon" ? "bg-green-500/40 border border-green-400 text-green-100" :
                              isRequest ? "bg-amber-500/30 border border-amber-400 text-amber-100" :
                              "bg-slate-700/50 border border-slate-600 text-slate-400"
                            }`}
                          >
                            {shift || (isRequest ? "🚫" : "—")}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 mb-8 shadow-lg">
          <h3 className="font-semibold text-sm text-blue-300 mb-4 uppercase tracking-wide">Shift Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-blue-500/60 border border-blue-400"></div>
              <span className="text-sm text-slate-300">Morning</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-green-500/60 border border-green-400"></div>
              <span className="text-sm text-slate-300">Afternoon</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-red-500/60 border border-red-400"></div>
              <span className="text-sm text-slate-300">Conflict</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-amber-500/30 border border-amber-400"></div>
              <span className="text-sm text-slate-300">Time Off</span>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 shadow-lg">
            <h3 className="font-semibold text-blue-300 mb-4 flex items-center gap-2"><Users size={18} /> Shift Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getShiftStats()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }} />
                <Bar dataKey="shifts" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 shadow-lg">
            <h3 className="font-semibold text-blue-300 mb-4 flex items-center gap-2"><Clock size={18} /> Shift Types</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={getShiftTypeStats()} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  <Cell fill="#3b82f6" />
                  <Cell fill="#10b981" />
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Auto Assign Logs */}
        {autoAssignLogs.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 shadow-lg mb-8">
            <h3 className="font-semibold text-blue-300 mb-4 flex items-center gap-2"><CheckCircle size={18} /> Assignment Log</h3>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {autoAssignLogs.map((log, i) => (
                <div key={i} className="text-sm text-slate-300 font-mono bg-slate-900/40 p-2 rounded border border-slate-700/30">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Swap Modal */}
      {showSwapModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in scale-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Swap Shift</h2>
              <button onClick={() => setShowSwapModal(false)} className="hover:bg-slate-700 p-2 rounded-lg transition"><X size={20} /></button>
            </div>
            <SwapForm dentists={dentists} days={days} onSwap={(f, t, d) => { handleSwap(f, t, d); setShowSwapModal(false); }} />
          </div>
        </div>
      )}

      {/* Stats Modal */}
      {showStatsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-in scale-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Advanced Analytics</h2>
              <button onClick={() => setShowStatsModal(false)} className="hover:bg-slate-700 p-2 rounded-lg transition"><X size={20} /></button>
            </div>
            <div className="space-y-6">
              <div className="bg-slate-700/30 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-300 mb-4">Dentist Performance</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getShiftStats()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }} />
                    <Legend />
                    <Bar dataKey="shifts" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="requests" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface SwapFormProps {
  dentists: string[];
  days: string[];
  onSwap: (from: string, to: string, day: string) => void;
}

function SwapForm({ dentists, days, onSwap }: SwapFormProps) {
  const [from, setFrom] = useState(dentists[0]);
  const [to, setTo] = useState(dentists[1]);
  const [day, setDay] = useState(days[0]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">From Dentist</label>
        <select value={from} onChange={e => setFrom(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white">
          {dentists.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">To Dentist</label>
        <select value={to} onChange={e => setTo(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white">
          {dentists.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">Day</label>
        <select value={day} onChange={e => setDay(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white">
          {days.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div className="flex gap-3 pt-4">
        <button onClick={() => onSwap(from, to, day)} className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg font-semibold transition transform hover:scale-105">
          Confirm Swap
        </button>
      </div>
    </div>
  );
}