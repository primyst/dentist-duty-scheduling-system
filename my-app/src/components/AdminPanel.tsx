"use client";

import React from "react";
import { UserCheck, XCircle } from "lucide-react";

const AdminPanel = () => {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-lg font-bold mb-4">Pending Requests</h2>
      <div className="flex items-center justify-between border-b py-2">
        <p className="text-sm">Dr. Usman requests swap with Dr. Abdulqudus (Tuesday)</p>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">
            <UserCheck size={16} />
          </button>
          <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">
            <XCircle size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;