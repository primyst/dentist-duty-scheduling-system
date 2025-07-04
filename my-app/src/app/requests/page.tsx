"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SwapRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      const { data, error } = await supabase
        .from("shift_swap_requests")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching swap requests:", error.message);
      } else {
        setRequests(data);
      }

      setLoading(false);
    };

    fetchRequests();
  }, []);

const updateStatus = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase
      .from("shift_swap_requests")
      .update({ status })
      .eq("id", id);

    if (error) {
      alert(`Failed to ${status} request.`);
      return;
    }

    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Pending Shift Swap Requests</h1>

      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((req) => (
            <li
              key={req.id}
              className="border p-4 rounded-md shadow space-y-2 bg-white"
            >
              <p className="font-medium text-gray-800">
                <span className="text-blue-600">{req.requester_id}</span> wants to swap:
              </p>
              <p>
                <strong>Giving away:</strong> {req.requested_day} –{" "}
                {req.requested_shift}
              </p>
              <p>
                <strong>Wants:</strong> {req.desired_day} – {req.desired_shift}
              </p>

              <div className="flex gap-2 mt-2">
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded"
                  onClick={() => updateStatus(req.id, "approved")}
                >
                  Approve
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => updateStatus(req.id, "rejected")}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}