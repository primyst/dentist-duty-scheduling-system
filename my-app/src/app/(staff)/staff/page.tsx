"use client";

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ScheduleTable from "@/components/ScheduleTable";
import { Calendar } from "lucide-react";
import SwapForm from "@/components/SwapForm";

export default function StaffPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [staffInfo, setStaffInfo] = useState<{
    id?: string;
    name?: string;
    department: string;
  } | null>(null);

  useEffect(() => {
    // If you have stored a richer staff object earlier, use that.
    // For this simple flow, we just read department.
    const department = localStorage.getItem("department") || "Emergency";
    setStaffInfo({ department });
  }, []);

  if (!staffInfo) return null;

  return (
    <div className="max-w-3xl space-y-8">
      <h1 className="text-xl font-bold">
        Welcome{staffInfo?.name ? `, ${staffInfo.name}` : ""} 👋
      </h1>

      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-green-600" />
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          className="border px-3 py-2 rounded-md"
          dateFormat="MMMM d, yyyy"
        />
      </div>

      <ScheduleTable date={selectedDate} onlyDepartment={staffInfo.department} view="daily" />

      <SwapForm
  requesterId={staffInfo.id || "anonymous"}
  department={staffInfo.department}
/>
    </div>
  );
}
