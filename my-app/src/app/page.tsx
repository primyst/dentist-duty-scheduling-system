"use client";

import React from "react";
import Header from "@/components/Header";
import StatusBar from "@/components/StatusBar";
import ScheduleTable from "@/components/ScheduleTable";
import AdminPanel from "@/components/AdminPanel";
import StatsPanel from "@/components/StatsPanel"; // new dummy stats
import SwapModal from "@/components/SwapModal";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <div className="p-6 space-y-6">
        <StatsPanel />
        <StatusBar />
        <ScheduleTable />
        <AdminPanel />
        <SwapModal />
      </div>
    </div>
  );
};

export default HomePage;