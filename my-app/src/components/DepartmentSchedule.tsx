"use client";

import { ShiftAssignment } from "@/lib/types";

interface DepartmentScheduleProps {
  department: string;
  schedule: ShiftAssignment[];
}

export default function DepartmentSchedule({
  department,
  schedule,
}: DepartmentScheduleProps) {
  const filteredSchedule = schedule.filter((S) => S.department === department);

  return (
    <div className="mb-8">
      <h2 className="text-lg lg:text-xl font-bold mb-4">
        {department} Department
      </h2>

      {filteredSchedule.map((shift, index) => (
        <div
          key={index}
          className="border border-gray-300 rounded-lg p-4 mb-4 shadow-sm"
        >
          <p className="text-sm text-gray-500 mb-2">
            {shift.day} - {shift.shift}
          </p>
          <div className="mb-2">
            <p className="font-semibold">Doctors:</p>
            <ul className="list-disc ml-5">
              {shift.doctors.map((doc) => (
                <li key={doc.id}>{doc.name}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold">Nurses:</p>
            <ul className="list-disc ml-5">
              {shift.nurses.map((nurse) => (
                <li key={nurse.id}>{nurse.name}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
