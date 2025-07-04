"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SwapForm({ requesterId }: { requesterId: string }) {
  const [requestedDay, setRequestedDay] = useState("");
  const [requestedShift, setRequestedShift] = useState("");
  const [desiredDay, setDesiredDay] = useState("");
  const [desiredShift, setDesiredShift] = useState("");
  const [reason, setReason] = useState(""); // ✅ new state
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!requestedDay || !requestedShift || !desiredDay || !desiredShift || !reason.trim()) {
      setMessage("Please fill in all fields.");
      return;
    }

    const { error } = await supabase.from("shift_swap_requests").insert({
      requester_id: requesterId,
      requested_day: requestedDay,
      requested_shift: requestedShift,
      desired_day: desiredDay,
      desired_shift: desiredShift,
      reason, // ✅ include reason
      status: "pending",
    });

    if (error) {
      setMessage("❌ Failed to request swap.");
      console.error(error);
    } else {
      setMessage("✅ Swap request submitted!");
      // Reset form
      setRequestedDay("");
      setRequestedShift("");
      setDesiredDay("");
      setDesiredShift("");
      setReason("");
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow max-w-md space-y-4">
      <h2 className="text-lg font-bold">Request a Shift Swap</h2>

      {/* Shift to give away */}
      <div>
        <label>My Shift (to give away)</label>
        <input
          type="date"
          value={requestedDay}
          onChange={(e) => setRequestedDay(e.target.value)}
          className="border px-2 py-1 w-full"
        />
        <select
          value={requestedShift}
          onChange={(e) => setRequestedShift(e.target.value)}
          className="border px-2 py-1 w-full mt-1"
        >
          <option value="">Select Shift</option>
          <option value="Morning">Morning</option>
          <option value="Afternoon">Afternoon</option>
          <option value="Night">Night</option>
        </select>
      </div>

      {/* Desired Shift */}
      <div>
        <label>Desired Shift</label>
        <input
          type="date"
          value={desiredDay}
          onChange={(e) => setDesiredDay(e.target.value)}
          className="border px-2 py-1 w-full"
        />
        <select
          value={desiredShift}
          onChange={(e) => setDesiredShift(e.target.value)}
          className="border px-2 py-1 w-full mt-1"
        >
          <option value="">Select Shift</option>
          <option value="Morning">Morning</option>
          <option value="Afternoon">Afternoon</option>
          <option value="Night">Night</option>
        </select>
      </div>

      {/* Reason */}
      <div>
        <label>Reason for Swap</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="border px-2 py-1 w-full mt-1"
          placeholder="Explain why you need this swap..."
          rows={3}
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Submit Request
      </button>

      {message && <p className="text-sm mt-2">{message}</p>}
    </div>
  );
}