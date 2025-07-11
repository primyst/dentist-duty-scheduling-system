"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { staff, department } from "@/lib/data";

const data = department.map((dept) => {
  const deptStaff = staff.filter((s) => s.department === dept.name);
  const doctors = deptStaff.filter((s) => s.role === "doctor").length;
  const nurses = deptStaff.filter((s) => s.role === "nurse").length;

  return {
    department: dept.name,
    doctors,
    nurses,
  };
});

export default function DepartmentStaffBarChart() {
  return (
    <div className="w-full h-72 bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Staff Count by Department</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="department" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="doctors" fill="#3182ce" />
          <Bar dataKey="nurses" fill="#38a169" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}