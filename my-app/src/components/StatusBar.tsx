"use client";
import React from "react";

const StatusBar = () => (
  <div className="flex justify-around p-2 bg-gray-200 mt-4 border-t rounded">
    <div className="flex items-center gap-1"><div className="w-4 h-4 bg-blue-300"></div> Morning</div>
    <div className="flex items-center gap-1"><div className="w-4 h-4 bg-green-300"></div> Afternoon</div>
    <div className="flex items-center gap-1"><div className="w-4 h-4 bg-red-400"></div> Conflict</div>
    <div className="flex items-center gap-1"><div className="w-4 h-4 bg-white border"></div> Unassigned</div>
  </div>
);

export default StatusBar;