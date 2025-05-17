"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { departments, staff } from "@/lib/data";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { Clock, CalendarCheck } from "lucide-react";

export default function StaffPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [staffName, setStaffName] = useState("");
  const [assignedDepartments, setAssignedDepartments] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/");
      return;
    }

    const parsed = JSON.parse(user);
    if (parsed.role !== "staff") {
      router.push("/");
      return;
    }

    const currentStaff = staff.find((s) => s.id === parsed.id);
    if (!currentStaff) {
      router.push("/");
      return;
    }

    setStaffName(currentStaff.name);
    setAssignedDepartments(currentStaff.departments);
  }, [router]);

  const selectedDay = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
  });

  const visibleDepartments = departments.filter(
    (dept) =>
      assignedDepartments.includes(dept.name) &&
      dept.workdays.includes(selectedDay)
  );

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-center mb-6">
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
        />
      </div>

      <h1 className="text-2xl font-semibold text-center mb-4 text-gray-800">
        Hello, {staffName.split(" ")[0]} — Your Shifts for{" "}
        {format(selectedDate, "EEEE, MMMM d")}
      </h1>

      {visibleDepartments.length === 0 ? (
        <p className="text-center text-gray-500 mt-6">
          <CalendarCheck className="inline-block w-5 h-5 mr-1" />
          No shifts scheduled for today.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleDepartments.map((dept) => (
            <div
              key={dept.name}
              className="bg-white rounded-xl shadow border p-4"
            >
              <h3 className="text-lg font-semibold text-blue-700 mb-3">
                {dept.name} Department
              </h3>

              {dept.shifts.map((shift, index) => (
                <div
                  key={index}
                  className="p-3 rounded bg-gray-100 mb-3 border border-gray-200"
                >
                  <p className="flex items-center gap-2 text-gray-700 text-sm font-medium">
                    <Clock className="w-4 h-4" />
                    {shift}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    You are scheduled today.
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}