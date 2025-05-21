"use client";

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import { staff } from "@/lib/data";
import { Staff } from "@/lib/types";

export default function StaffPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [staffMember, setStaffMember] = useState<Staff | null>(null);

  const staffId = "staff11"; // replace with real auth later

  useEffect(() => {
    const found = staff.find((s) => s.id === staffId);
    setStaffMember(found || null);
  }, []);

  const getDayName = (date: Date) =>
    date.toLocaleDateString("en-US", { weekday: "long" });

  if (!staffMember || !selectedDate) return <p>Loading...</p>;

  const { department, name, role } = staffMember;
  const dayName = getDayName(selectedDate);
  const isWorking = department.workdays.includes(dayName);

  return (
    <main className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Welcome, {name}</h1>

      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-5 h-5 text-blue-600" />
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          className="border px-3 py-2 rounded-md"
          dateFormat="MMMM d, yyyy"
        />
      </div>

      <section className="bg-white rounded-md shadow-md p-6">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">
          {department.name} Department
        </h2>

        {isWorking ? (
          <>
            <p className="mb-4">
              <strong>Role:</strong> <span className="capitalize">{role}</span>
            </p>
            <p className="mb-4">
              <strong>Day:</strong> {dayName}
            </p>

            <div className="space-y-4">
              {department.time.length > 0 ? (
                department.time.map((shift) => (
                  <div
                    key={shift}
                    className="border rounded-md p-4 shadow-sm bg-blue-50"
                  >
                    <p className="font-semibold text-blue-800 mb-1">Shift:</p>
                    <p className="text-gray-700">{shift}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No shifts available</p>
              )}
            </div>
          </>
        ) : (
          <p className="text-gray-500 italic">
            You're not scheduled to work on {dayName}.
          </p>
        )}
      </section>
    </main>
  );
}
