"use client";

import { useEffect, useState } from "react";
import { Calendar, RefreshCcw } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { staff, swapRequests } from "@/lib/data";
import { Staff, Swap } from "@/lib/types";

export default function RequestPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [staffMember, setStaffMember] = useState<Staff | null>(null);

  const staffId = "staff11"; // Simulated login

  useEffect(() => {
    const found = staff.find((s) => s.id === staffId);
    setStaffMember(found || null);
  }, []);

  if (!staffMember || !selectedDate) return <p className="p-4">Loading...</p>;

  const requestsForUser = swapRequests.filter(
    (req) => req.to === staffMember.name
  );

  return (
    <main className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Shift Requests</h1>

      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-5 h-5 text-blue-600" />
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          className="border px-3 py-2 rounded-md"
          dateFormat="MMMM d, yyyy"
        />
      </div>

      <section className="space-y-4">
        {requestsForUser.length > 0 ? (
          requestsForUser.map((req, index) => (
            <div
              key={index}
              className="bg-white border rounded-lg shadow p-4 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-blue-700 font-semibold">
                    {req.department} Department
                  </h2>
                  <p className="text-sm text-gray-600">Shift: {req.shift}</p>
                </div>
                <RefreshCcw className="text-blue-500 w-5 h-5" />
              </div>
              <p className="text-sm text-gray-700">
                <strong>From:</strong> {req.requesterName}
              </p>
              <p className="text-sm text-gray-700">
                <strong>To:</strong> {req.to}
              </p>
              <p
                className={`text-sm font-medium ${
                  req.status === "Pending"
                    ? "text-yellow-600"
                    : req.status === "Approved"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                Status: {req.status}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No shift swap requests found.</p>
        )}
      </section>
    </main>
  );
}
