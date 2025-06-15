"use client";

import { useEffect, useState } from "react";
import { ShiftAssignment } from "@/lib/types";
import { staff } from "@/lib/data";
import { supabase } from "@/lib/supabaseClient";
import { Stethoscope, Syringe } from "lucide-react";

export default function StaffDashboard() {
  const [schedule, setSchedule] = useState<ShiftAssignment[]>([]);
  const [staffInfo, setStaffInfo] = useState<null | (typeof staff)[0]>(null);
  const [date] = useState(new Date());

  useEffect(() => {
    const storedStaff = localStorage.getItem("loggedInStaff");
    if (storedStaff) {
      setStaffInfo(JSON.parse(storedStaff));
    }
  }, []);

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!staffInfo || !date) return;

      const dateStr = date.toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("shift_assignments")
        .select("*")
        .eq("day", dateStr)
        .eq("department", staffInfo.department.name);

      if (error) {
        console.error("Failed to fetch schedule:", error.message);
        return;
      }

      setSchedule(data || []);
    };

    fetchSchedule();
  }, [staffInfo, date]);

  if (!staffInfo) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Welcome, {staffInfo.name}
      </h1>
      <p className="text-gray-600 mb-6">
        Here are your department&rsquo;s shifts for {date.toDateString()}
      </p>

      {schedule.map((shift) => (
        <div
          key={shift.shift}
          className="bg-white rounded-xl shadow-md p-4 mb-4"
        >
          <h2 className="text-blue-700 font-bold text-lg">
            {shift.department} - {shift.shift}
          </h2>

          <div className="mt-3">
            <div className="text-blue-600 font-medium flex items-center gap-2">
              <Stethoscope className="w-4 h-4" />
              Doctors
            </div>
            <ul className="ml-6 list-disc text-sm text-gray-700">
              {shift.doctors.map((id) => {
                const doc = staff.find((s) => s.id === id);
                return <li key={id}>{doc?.name || "Unknown"}</li>;
              })}
            </ul>
          </div>

          <div className="mt-3">
            <div className="text-green-600 font-medium flex items-center gap-2">
              <Syringe className="w-4 h-4" />
              Nurses
            </div>
            <ul className="ml-6 list-disc text-sm text-gray-700">
              {shift.nurses.map((id) => {
                const nurse = staff.find((s) => s.id === id);
                return <li key={id}>{nurse?.name || "Unknown"}</li>;
              })}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
