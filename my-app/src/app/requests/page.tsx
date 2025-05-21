"use client";

import { useState } from "react";
import { generateShiftAssignments } from "@/lib/utils";
import { ShiftAssignment, ShiftSwapRequest } from "@/lib/types";

const currentUserId = "n1"; // Simulating Nurse Daniel

export default function RequestsPage() {
  const [requests, setRequests] = useState<ShiftSwapRequest[]>([]);
  const [reason, setReason] = useState("");
  const schedule = generateShiftAssignments();

  const myShifts = schedule.filter(
    (s) =>
      s.nurses.some((n) => n.id === currentUserId) ||
      s.doctors.some((d) => d.id === currentUserId)
  );

  function handleRequestSubmit(shift: ShiftAssignment) {
    if (!reason.trim()) return;

    const newRequest: ShiftSwapRequest = {
      id: Date.now().toString(),
      staffId: currentUserId,
      department: shift.department,
      day: shift.day,
      shift: shift.shift,
      reason,
      status: "pending",
    };

    setRequests([newRequest, ...requests]);
    setReason("");
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Shift Swap Requests</h1>

      <h2 className="font-semibold mb-2">My Shifts</h2>
      {myShifts.map((shift, i) => (
        <div key={i} className="border p-4 rounded mb-3">
          <p className="text-sm">
            {shift.day} — {shift.shift}
          </p>
          <p className="font-medium">{shift.department}</p>
          <textarea
            className="w-full mt-2 p-2 border rounded"
            placeholder="Reason for swap..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <button
            className="mt-2 px-4 py-1 bg-blue-600 text-white rounded"
            onClick={() => handleRequestSubmit(shift)}
          >
            Submit Swap Request
          </button>
        </div>
      ))}

      <hr className="my-6" />

      <h2 className="font-semibold mb-2">My Requests</h2>
      {requests.length === 0 ? (
        <p>No requests yet.</p>
      ) : (
        requests.map((r) => (
          <div key={r.id} className="border p-4 rounded mb-2">
            <p className="text-sm text-gray-500">
              {r.day} — {r.shift} ({r.department})
            </p>
            <p>
              <strong>Reason:</strong> {r.reason}
            </p>
            <p className="text-sm mt-1">
              Status:{" "}
              <span
                className={
                  r.status === "pending"
                    ? "text-yellow-600"
                    : r.status === "approved"
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {r.status}
              </span>
            </p>
          </div>
        ))
      )}
    </main>
  );
}
