"use client";

import { useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import ScheduleTable from "@/components/ScheduleTable";
import Sidebar from "@/components/Sidebar";

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <Sidebar />
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
      <ScheduleTable date={selectedDate} view="daily" />
    </main>
  );
}