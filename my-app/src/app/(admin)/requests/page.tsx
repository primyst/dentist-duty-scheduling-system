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
  reason?: string | null;
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<SwapRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("shift_swap_requests")
        .select("*")
        .order("id", { ascending: false });

      if (!error) setRequests(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const updateStatus = async (id: number, status: "approved" | "rejected") => {
    const { error } = await supabase
      .from("shift_swap_requests")
      .update({ status })
      .eq("id", id);
    if (!error) {
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Shift Swap Requests</h1>
      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <p>No requests.</p>
      ) : (
        <div className="space-y-6">
          {requests.map((req) => (
            <div key={req.id} className="border p-4 rounded-lg bg-white shadow">
              <p><strong>Requester:</strong> {req.requester_id}</p>
              <p><strong>Give:</strong> {req.requested_day} – {req.requested_shift}</p>
              <p><strong>Wants:</strong> {req.desired_day} – {req.desired_shift}</p>
              {req.reason ? <p><strong>Reason:</strong> {req.reason}</p> : null}
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
    </div>
  );
                }
