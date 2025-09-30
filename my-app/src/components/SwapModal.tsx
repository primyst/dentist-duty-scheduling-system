"use client";

import React, { useState } from "react";
import { ArrowRightLeft } from "lucide-react";

interface SwapModalProps {
  show: boolean;
  onClose: () => void;
}

const SwapModal: React.FC<SwapModalProps> = ({ show, onClose }) => {
  const [yourName, setYourName] = useState("");
  const [targetDentist, setTargetDentist] = useState("");
  const [shiftDay, setShiftDay] = useState("");

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Request Shift Swap</h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full border rounded px-3 py-2"
            value={yourName}
            onChange={(e) => setYourName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Target Dentist"
            className="w-full border rounded px-3 py-2"
            value={targetDentist}
            onChange={(e) => setTargetDentist(e.target.value)}
          />
          <input
            type="text"
            placeholder="Shift / Day"
            className="w-full border rounded px-3 py-2"
            value={shiftDay}
            onChange={(e) => setShiftDay(e.target.value)}
          />
        </div>
        <button
          className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          onClick={onClose}
        >
          <ArrowRightLeft size={18} /> Submit Request
        </button>
      </div>
    </div>
  );
};

export default SwapModal;