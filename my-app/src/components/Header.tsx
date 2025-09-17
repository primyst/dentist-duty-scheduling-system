"use client";

import React from "react";
import { Bell, RefreshCw, Download } from "lucide-react";

const Header = () => {
  return (
    <header className="flex items-center justify-between bg-white shadow-md px-6 py-4">
      <h1 className="text-2xl font-bold text-blue-600">
        Dentist Duties Scheduler
      </h1>
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <RefreshCw size={18} />
          Auto Assign
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <Download size={18} />
          Export CSV
        </button>
        <button className="p-2 rounded-full hover:bg-slate-100">
          <Bell size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;