"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface SwapRequest {
  id: number;
  requester_id: string;
  requested_day: string;
  requested_shift: string;
  desired_day: string;
  desired_shift: string;
  status: "pending" | "approved" | "rejected";
}

export default function SwapRequestsPage() {
  const [requests, setRequests] = useState<SwapRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all requests from the database on mount
  useEffect(() => {
    const fetchRequests = async () => {
      const { data, error } = await supabase
        .from("shift_swap_requests")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error("Error fetching requests:", error.message);
      } else {
        setRequests(data || []);
      }
      setLoading(false);
    };

    fetchRequests();
  }, []);

  // Update the status of a swap request
  const updateStatus = async (id: number, newStatus: "approved" | "rejected") => {
    const { error } = await supabase
      .from("shift_swap_requests")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      console.error("Error updating request:", error.message);
      return;
    }

    // Reflect the new status in the local state
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: newStatus } : r
      )
    );
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-blue-800">
        Shift Swap Requests (Admin)
      </h1>

      {loading ? (
        <p>Loading requests...</p>
      ) : requests.length === 0 ? (
        <p>No swap requests found.</p>
      ) : (
        <div className="space-y-6">
          {requests.map((req) => (
            <div key={req.id} className="border p-4 rounded-lg shadow">
              <p><strong>Requester ID:</strong> {req.requester_id}</p>
              <p><strong>Requested:</strong> {req.requested_day} – {req.requested_shift}</p>
              <p><strong>Wants:</strong> {req.desired_day} – {req.desired_shift}</p>
              <p><strong>Status:</strong> <span className="capitalize">{req.status}</span></p>

              {req.status === "pending" && (
                <div className="mt-3 flex gap-3">
                  <button
                    onClick={() => updateStatus(req.id, "approved")}
                    className="px-4 py-2 bg-green-600 text-white rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(req.id, "rejected")}
                    className="px-4 py-2 bg-red-600 text-white rounded"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}