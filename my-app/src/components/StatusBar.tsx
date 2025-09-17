"use client";

import React from "react";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

const StatusBar = () => {
  return (
    <div className="flex items-center justify-between bg-white shadow rounded-lg p-4">
      <div className="flex items-center gap-6">
        <span className="flex items-center gap-2 text-sm">
          <CheckCircle className="text-green-600" size={18} /> Morning
        </span>
        <span className="flex items-center gap-2 text-sm">
          <Clock className="text-blue-600" size={18} /> Afternoon
        </span>
        <span className="flex items-center gap-2 text-sm">
          <AlertTriangle className="text-red-600" size={18} /> Conflict
        </span>
      </div>
      <div className="text-sm font-medium text-red-600">
        Active Conflicts: 0
      </div>
    </div>
  );
};

export default StatusBar;