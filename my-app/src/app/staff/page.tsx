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

  // For now, simulate login with a staff ID
  const staffId = "staff11"; // You can later replace this with real auth

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
      <h1 className="text-2xl font-bold mb-4">Welcome, {name}</h1>

      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-5 h-5 text-blue-600" />
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          className="border px-3 py-2 rounded-md"
          dateFormat="MMMM d, yyyy"
        />
      </div>

      <section className="border rounded-md p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-blue-600 mb-2">
          {department.name} Department
        </h2>
        {isWorking ? (
          <>
            <p className="mb-2">
              <strong>Role:</strong> {role}
            </p>
            <p className="mb-2">
              <strong>Day:</strong> {dayName}
            </p>
            <p className="mb-2">
              <strong>Assigned Shift(s):</strong>
            </p>
            <ul className="list-disc ml-6 text-gray-700">
              {department.time.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-gray-500 italic">
            You’re not scheduled to work on {dayName}.
          </p>
        )}
      </section>
    </main>
  );
}
