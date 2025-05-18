"use client";

import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";
import { assignShiftsFairly, getAssignmentsForDate } from "@/lib/utils";
import { departments } from "@/lib/data";
import { supabase } from "@/lib/supabase"; // path to your client.ts
import { AssignedShift } from "@/lib/types";

export default function AdminPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [assignments, setAssignments] = useState<AssignedShift[]>([]);
  const [loading, setLoading] = useState(false);

  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  const fetchAssignments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("shift_assignments")
      .select("*")
      .eq("date", formattedDate);

    if (!error && data) {
      setAssignments(data);
    } else {
      setAssignments([]);
    }
    setLoading(false);
  };

  const handleGenerate = async () => {
    setLoading(true);

    // Step 1: Generate new assignments
    const newAssignments = assignShiftsFairly(departments, selectedDate, []);

    // Step 2: Insert into Supabase
    const { error } = await supabase
      .from("shift_assignments")
      .insert(newAssignments);

    if (!error) {
      setAssignments(newAssignments);
      alert("Shifts generated and saved!");
    } else {
      console.error("Insert error", error);
      alert("Failed to save shifts.");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchAssignments();
  }, [selectedDate]);

  return (
    <div className="p-4 md:p-8 md:ml-64 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Admin: Shift Assignments
      </h2>

      <div className="flex justify-center mb-6">
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
        />
      </div>

      <div className="flex justify-center mb-4">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
        >
          {loading ? "Processing..." : "Generate & Save Shifts"}
        </button>
      </div>

      {assignments.length > 0 ? (
        <div className="space-y-4">
          {assignments.map((a, i) => (
            <div key={i} className="bg-white border shadow rounded p-4">
              <p className="text-sm font-medium text-blue-700">
                {a.department} - {a.shift}
              </p>
              <p className="text-sm">Doctors: {a.doctors.join(", ")}</p>
              <p className="text-sm">Nurses: {a.nurses.join(", ")}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">
          No assignments for this date.
        </p>
      )}
    </div>
  );
}
