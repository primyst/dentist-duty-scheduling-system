"use client";
import React from "react";

interface HeaderProps {
  totalStaff: number;
  totalShifts: number;
  requests: number;
}

const Header: React.FC<HeaderProps> = ({ totalStaff, totalShifts, requests }) => (
  <header className="flex flex-col md:flex-row justify-between items-center bg-blue-600 text-white p-4 rounded-md shadow">
    <div>
      <h1 className="text-2xl font-bold">AI Dentist Scheduler</h1>
      <p className="text-sm text-blue-100">Optimized fair shift distribution for dental staff</p>
    </div>

    <div className="flex flex-wrap gap-4 mt-3 md:mt-0">
      <div className="text-center">
        <p className="font-semibold text-lg">{totalStaff}</p>
        <p className="text-sm text-blue-100">Staff Members</p>
      </div>
      <div className="text-center">
        <p className="font-semibold text-lg">{totalShifts}</p>
        <p className="text-sm text-blue-100">Assigned Shifts</p>
      </div>
      <div className="text-center">
        <p className="font-semibold text-lg">{requests}</p>
        <p className="text-sm text-blue-100">Pending Requests</p>
      </div>
    </div>
  </header>
);

export default Header;