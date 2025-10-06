"use client";
import React, { useState } from "react";

interface SwapModalProps {
  show: boolean;
  onClose: () => void;
  dentists: string[];
  onSwap: (from: string, to: string, day: string) => void;
}

const SwapModal: React.FC<SwapModalProps> = ({ show, onClose, dentists, onSwap }) => {
  const [from, setFrom] = useState(dentists[0]);
  const [to, setTo] = useState(dentists[1]);
  const [day, setDay] = useState("Monday");

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow-lg w-96">
        <h2 className="text-lg font-bold mb-2">Swap Shift</h2>
        <div className="flex flex-col gap-2">
          <div>
            <label>From:</label>
            <select value={from} onChange={e => setFrom(e.target.value)} className="ml-2 border rounded p-1">
              {dentists.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label>To:</label>
            <select value={to} onChange={e => setTo(e.target.value)} className="ml-2 border rounded p-1">
              {dentists.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label>Day:</label>
            <select value={day} onChange={e => setDay(e.target.value)} className="ml-2 border rounded p-1">
              {["Monday","Tuesday","Wednesday","Thursday","Friday"].map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end mt-4 gap-2">
          <button className="px-4 py-2 bg-gray-500 text-white rounded" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => { onSwap(from, to, day); onClose(); }}>Swap</button>
        </div>
      </div>
    </div>
  );
};

export default SwapModal;