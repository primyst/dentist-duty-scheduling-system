"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Clock, Stethoscope, Syringe } from "lucide-react";
import { AssignedShift } from "@/lib/types";
import { getAssignmentsFromSupabase } from "@/lib/supabase/assignments";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const departments = [
  {
    name: "Emergency",
    workdays: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  },
  { name: "Surgery", workdays: ["Monday", "Wednesday", "Friday"] },
  { name: "Pediatrics", workdays: ["Tuesday", "Thursday", "Saturday"] },
];

export default function ShiftScheduleViewer() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [assignments, setAssignments] = useState<AssignedShift[]>([]);
  const selectedDay = daysOfWeek[selectedDate.getDay()];

  useEffect(() => {
    const fetchAssignments = async () => {
      const formatted = selectedDate.toISOString().split("T")[0];
      const data = await getAssignmentsFromSupabase(formatted);
      setAssignments(data);
    };

    fetchAssignments();
  }, [selectedDate]);

  return (
    <div className="p-4 md:p-8 md:ml-64 bg-gray-50 min-h-screen">
      {/* Calendar */}
      <div className="flex justify-center mb-6">
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
        />
      </div>

      <h2 className="text-2xl font-bold text-center mb-4">
        Shifts for {format(selectedDate, "EEEE, MMMM d")}
      </h2>

      {/* Shift Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {departments
          .filter((dept) => dept.workdays.includes(selectedDay))
          .map((dept) => {
            const deptAssignments = assignments.filter(
              (a) => a.department === dept.name
            );

            const uniqueShifts = [
              ...new Set(deptAssignments.map((a) => a.shift)),
            ];

            return (
              <div
                key={dept.name}
                className="bg-white border rounded-xl shadow p-4"
              >
                <h3 className="text-xl font-semibold text-blue-700 mb-3">
                  {dept.name}
                </h3>

                {uniqueShifts.map((shift, idx) => {
                  const shiftData = deptAssignments.find(
                    (a) => a.shift === shift
                  );

                  return (
                    <div
                      key={idx}
                      className="border rounded p-3 mb-3 bg-gray-100"
                    >
                      <p className="flex items-center gap-2 text-sm text-gray-700 font-medium mb-1">
                        <Clock className="w-4 h-4" /> {shift}
                      </p>
                      <p className="flex items-center gap-2 text-sm text-blue-700">
                        <Stethoscope className="w-4 h-4" />
                        {shiftData?.doctors
                          ?.map((d) => (typeof d === "string" ? d : d.name))
                          .join(", ") || "Unassigned"}
                      </p>
                      <p className="flex items-center gap-2 text-sm text-green-700">
                        <Syringe className="w-4 h-4" />
                        {shiftData?.nurses
                          ?.map((n) => (typeof n === "string" ? n : n.name))
                          .join(", ") || "Unassigned"}
                      </p>
                    </div>
                  );
                })}
              </div>
            );
          })}
      </div>
    </div>
  );
}
