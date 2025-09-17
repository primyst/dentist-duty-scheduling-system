"use client";

import React from "react";
import { Users, Calendar, BarChart3 } from "lucide-react";

const StatsPanel = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white shadow rounded-lg p-4 flex items-center gap-4">
        <Users className="text-blue-600" size={28} />
        <div>
          <p className="text-sm text-slate-500">Total Dentists</p>
          <h3 className="text-xl font-bold">6</h3>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg p-4 flex items-center gap-4">
        <Calendar className="text-green-600" size={28} />
        <div>
          <p className="text-sm text-slate-500">Shifts This Week</p>
          <h3 className="text-xl font-bold">42</h3>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg p-4 flex items-center gap-4">
        <BarChart3 className="text-purple-600" size={28} />
        <div>
          <p className="text-sm text-slate-500">Coverage</p>
          <h3 className="text-xl font-bold">98%</h3>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;