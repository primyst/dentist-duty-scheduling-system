"use client";

import { useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import ScheduleTable from "@/components/ScheduleTable";

import { generateWeeklySchedule } from "@/lib/scheduler";
import { department } from "@/lib/data";
import { staff } from "@/lib/data";
import { format } from "date-fns";

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  // Generate weekly schedule ONCE (based on start of the selected week)
  const weeklySchedule = useMemo(() => {
    if (!selectedDate) return [];
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay()); // Sunday as week start
    return generateWeeklySchedule(departments, staff, startOfWeek);
  }, [selectedDate]);

  // Format selected date to "YYYY-MM-DD"
  const selectedDateString = useMemo(() => {
    if (!selectedDate) return "";
    return format(selectedDate, "yyyy-MM-dd");
  }, [selectedDate]);

  // Filter schedule to only show selected day's data
  const dailySchedule = weeklySchedule.filter(
    (s) => s.day === selectedDateString
  );

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Date Picker */}
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-5 h-5 text-blue-600" />
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          className="border px-3 py-2 rounded-md"
          dateFormat="MMMM d, yyyy"
        />
      </div>

      {/* Schedule Table */}
      <ScheduleTable schedule={dailySchedule} />
    </main>
  );
}