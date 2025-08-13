"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ScheduleTable from "@/components/ScheduleTable";
import { Calendar } from "lucide-react";
import SwapForm from "@/components/SwapForm";
import { Sidebar} from "@/components/Sidebar";

export default function StaffPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [staffInfo, setStaffInfo] = useState<{
    id: string;
    name: string;
    department: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("staffInfo");
    if (!stored) {
      router.push("/");
      return;
    }
    setStaffInfo(JSON.parse(stored));
  }, [router]);

  if (!staffInfo) return null;

  return (
    <main className="p-4 max-w-3xl mx-auto space-y-8">
      <h1 className="text-xl font-bold">Welcome, {staffInfo.name} 👋</h1>

      {/* Date Picker */}
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-green-600" />
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          className="border px-3 py-2 rounded-md"
          dateFormat="MMMM d, yyyy"
        />
      </div>

      {/* Daily schedule table */}
      <ScheduleTable
        date={selectedDate}
        onlyDepartment={staffInfo.department}
        view="daily"
      />

      {/* Shift Swap Request form */}
<SwapForm requesterId={staffInfo.id} department={staffInfo.department} />
    </main>
  );
}