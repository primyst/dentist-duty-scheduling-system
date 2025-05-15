"use client";

import { useState } from "react";
import { departments, getStaffByDepartment } from "@/lib/data";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Clock, Stethoscope, Syringe } from "lucide-react";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function ShiftScheduleViewer() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const selectedDay = daysOfWeek[selectedDate.getDay()];

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
            const staff = getStaffByDepartment(dept.name);

            return (
              <div
                key={dept.name}
                className="bg-white border rounded-xl shadow p-4"
              >
                <h3 className="text-xl font-semibold text-blue-700 mb-3">
                  {dept.name}
                </h3>

                {dept.shifts.map((shift, idx) => (
                  <div
                    key={idx}
                    className="border rounded p-3 mb-3 bg-gray-100"
                  >
                    <p className="flex items-center gap-2 text-sm text-gray-700 font-medium mb-1">
                      <Clock className="w-4 h-4" /> {shift}
                    </p>
                    <p className="flex items-center gap-2 text-sm text-blue-700">
                      <Stethoscope className="w-4 h-4" />
                      {staff.doctors.map((d) => d.name).join(", ")}
                    </p>
                    <p className="flex items-center gap-2 text-sm text-green-700">
                      <Syringe className="w-4 h-4" />
                      {staff.nurses.map((n) => n.name).join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            );
          })}
      </div>
    </div>
  );
}
