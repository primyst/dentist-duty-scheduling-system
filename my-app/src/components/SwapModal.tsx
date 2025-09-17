"use client";

import React from "react";
import { ArrowRightLeft } from "lucide-react";

const SwapModal = () => {
  // just a dummy static modal (not functional)
  return (
    <div className="hidden"> 
      {/* This can later be wired with useState to toggle visibility */}
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 shadow-lg w-96">
          <h2 className="text-lg font-bold mb-4">Request Shift Swap</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Target Dentist"
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Shift / Day"
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <button className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            <ArrowRightLeft size={18} /> Submit Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwapModal;