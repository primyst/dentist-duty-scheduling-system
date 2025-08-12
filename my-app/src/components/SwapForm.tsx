"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface SwapFormProps {
  requesterId: string;
  department: string;
}

export default function SwapForm({ requesterId, department }: SwapFormProps) {
  const [requestedDay, setRequestedDay] = useState("");
  const [requestedShift, setRequestedShift] = useState("");
  const [desiredDay, setDesiredDay] = useState("");
  const [desiredShift, setDesiredShift] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!requestedDay || !requestedShift || !desiredDay || !desiredShift || !reason.trim()) {
      setMessage("Please fill in all fields.");
      return;
    }

    const { error } = await supabase.from("shift_swap_requests").insert({
      requester_id: requesterId,
      department, // ✅ store department with the request
      requested_day: requestedDay,
      requested_shift: requestedShift,
      desired_day: desiredDay,
      desired_shift: desiredShift,
      reason,
      status: "pending",
    });

    if (error) {
      setMessage("❌ Failed to request swap.");
      console.error(error);
    } else {
      setMessage("✅ Swap request submitted!");
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
      {/* Your inputs remain the same */}
      {/* ... */}
    </div>
  );
}