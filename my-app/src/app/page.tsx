"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import StatsPanel from "@/components/StatsPanel";
import StatusBar from "@/components/StatusBar";
import ScheduleTable from "@/components/ScheduleTable";
import AdminPanel from "@/components/AdminPanel";
import SwapModal from "@/components/SwapModal";

const HomePage = () => {
  const [showSwapModal, setShowSwapModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Statistics Panel (Dynamic charts) */}
        <StatsPanel />

        {/* Status bar with shift legends */}
        <StatusBar />

        {/* Weekly Schedule Table */}
        <ScheduleTable />

        {/* Admin Panel for pending swap requests */}
        <AdminPanel />

        {/* Button to trigger swap modal */}
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={() => setShowSwapModal(true)}
        >
          Request Shift Swap
        </button>

        {/* Swap Modal */}
        <SwapModal show={showSwapModal} onClose={() => setShowSwapModal(false)} />
      </div>
    </div>
  );
};

export default HomePage;