"use client";

import { useState } from "react";
import { departments } from "@/lib/data";
import { assignShifts } from "@/lib/utils";
import { AssignedShift } from "@/lib/types";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Clock, Stethoscope, Syringe } from "lucide-react";

export default function ShiftScheduler() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [assignedShifts, setAssignedShifts] = useState<AssignedShift[]>([]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    const newAssignments = assignShifts(date, departments);
    setAssignedShifts(newAssignments);
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Calendar */}
      <div className="flex justify-center mb-6">
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
        />
      </div>

      <h2 className="text-2xl font-bold text-center mb-4">
        Shifts for {format(selectedDate, "EEEE, MMMM d")}
      </h2>

      {/* Shift Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {assignedShifts.map((shift, idx) => (
          <div key={idx} className="bg-white border rounded-xl shadow p-4">
            <h3 className="text-lg font-semibold text-blue-700 mb-3">
              {shift.department} — {shift.shift}
            </h3>

            <p className="flex items-center gap-2 text-sm text-blue-700 mt-1">
              <Stethoscope className="w-4 h-4" />
              {shift.doctors.length > 0
                ? shift.doctors.map((doc) => doc.name).join(", ")
                : "No doctor assigned"}
            </p>

            <p className="flex items-center gap-2 text-sm text-green-700 mt-1">
              <Syringe className="w-4 h-4" />
              {shift.nurses.length > 0
                ? shift.nurses.map((nurse) => nurse.name).join(", ")
                : "No nurse assigned"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
