"use client";

import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";
import { assignShiftsFairly } from "@/lib/utils"; // Should accept real staff data now
import { supabase } from "@/lib/supabase";
import { AssignedShift, Staff } from "@/lib/types";

export default function AdminPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [assignments, setAssignments] = useState<AssignedShift[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);

  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  const fetchAssignments = async () => {
    const { data, error } = await supabase
      .from("shift_assignments")
      .select("*")
      .eq("date", formattedDate);

    if (!error && data) setAssignments(data);
    else setAssignments([]);
  };

  const fetchStaff = async () => {
    const { data, error } = await supabase.from("staff").select("*");
    if (!error && data) setStaff(data);
    else alert("Failed to load staff data.");
  };

  const handleGenerate = async () => {
    setLoading(true);

    // Step 1: Group staff by department and role
    const departments = groupStaffByDepartment(staff);

    // Step 2: Generate new assignments
    const newAssignments = assignShiftsFairly(departments, selectedDate, []);

    // Step 3: Save to Supabase
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

  useEffect(() => {
    fetchStaff();
  }, []);

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
          disabled={loading || staff.length === 0}
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

// Helper to group staff into departments with roles
function groupStaffByDepartment(staff: Staff[]) {
  const grouped: Record<string, { doctors: string[]; nurses: string[] }> = {};

  for (const person of staff) {
    if (!grouped[person.department]) {
      grouped[person.department] = { doctors: [], nurses: [] };
    }
    if (person.role === "doctor") {
      grouped[person.department].doctors.push(person.name);
    } else if (person.role === "nurse") {
      grouped[person.department].nurses.push(person.name);
    }
  }

  return grouped;
}
