"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

interface SwapRequest {
  id: number;
  requester_id: string;
  requested_day: string;
  requested_shift: string;
  desired_day: string;
  desired_shift: string;
  status: "pending" | "approved" | "rejected";
  department_id?: string;
}

export default function SwapRequestsPage() {
  const [requests, setRequests] = useState<SwapRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<"admin" | "staff" | null>(null);
  const [departmentId, setDepartmentId] = useState<string | null>(null);
  const router = useRouter();

  // Identify user role and department
  useEffect(() => {
    const adminData = localStorage.getItem("admin");
    const staffData = localStorage.getItem("staffInfo");

    if (!adminData && !staffData) {
      router.push("/"); // Not logged in
      return;
    }

    if (adminData) {
      const parsed = JSON.parse(adminData);
      setRole("admin");
    } else if (staffData) {
      const parsed = JSON.parse(staffData);
      setRole("staff");
      setDepartmentId(parsed.departmentId); // Ensure staffInfo contains departmentId
    }
  }, []);

  // Fetch requests based on role
  useEffect(() => {
    if (!role) return;

    const fetchRequests = async () => {
      let query = supabase.from("shift_swap_requests").select("*").order("id", { ascending: false });

      if (role === "staff" && departmentId) {
        query = query.eq("department_id", departmentId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching requests:", error.message);
      } else {
        setRequests(data || []);
      }
      setLoading(false);
    };

    fetchRequests();
  }, [role, departmentId]);

  // Admin can update status
  const updateStatus = async (id: number, newStatus: "approved" | "rejected") => {
    const { error } = await supabase
      .from("shift_swap_requests")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      console.error("Error updating request:", error.message);
      return;
    }

    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-blue-800">
        Shift Swap Requests {role === "staff" && "(Your Department)"}
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

              {/* Show action buttons only to admin */}
              {role === "admin" && req.status === "pending" && (
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