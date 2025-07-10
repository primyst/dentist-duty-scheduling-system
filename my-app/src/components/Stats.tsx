import { staff, department } from "@/lib/data"; 
import React from "react";

type Count = {
  doctors: number;
  nurses: number;
};

const getStaffCountByDepartment = () => {
  const result: Record<string, Count> = {};

  for (const dept of department) {
    const deptStaff = staff.filter(s => s.department === dept.name);
    const doctors = deptStaff.filter(s => s.role === "doctor").length;
    const nurses = deptStaff.filter(s => s.role === "nurse").length;

    result[dept.name] = { doctors, nurses };
  }

  return result;
};

export default function Stats() {
  const counts = getStaffCountByDepartment();
  const totalStaff = staff.length;

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">📊 MedSchedule Stats</h1>

      <p className="text-gray-700">Total Staff: {totalStaff}</p>

      {department.map((dept) => (
        <div key={dept.name} className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold">{dept.name}</h2>
          <p>👨‍⚕️ Doctors: {counts[dept.name]?.doctors || 0}</p>
          <p>👩‍⚕️ Nurses: {counts[dept.name]?.nurses || 0}</p>
          <p>📅 Workdays: {dept.workdays.join(", ")}</p>
          <p>🕒 Shifts: {dept.time.join(" | ")}</p>
        </div>
      ))}
    </div>
  );
}