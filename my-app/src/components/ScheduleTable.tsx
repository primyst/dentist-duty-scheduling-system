"use client";
import React from "react";
import ShiftCell from "@/components/ShiftCell";

interface ScheduleTableProps {
  dentists: string[];
  days: string[];
  schedule: Record<string, Record<string, string | null>>;
  conflicts: Record<string, Record<string, boolean>>;
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ dentists, days, schedule, conflicts }) => (
  <div className="overflow-x-auto mt-4">
    <div className="flex">
      <div className="w-28 h-12 flex items-center justify-center border font-bold">Dentist</div>
      {days.map(day => (
        <div key={day} className="w-28 h-12 flex items-center justify-center border font-bold">{day}</div>
      ))}
    </div>
    {dentists.map(dentist => (
      <div key={dentist} className="flex">
        <div className="w-28 h-12 flex items-center justify-center border font-bold">{dentist}</div>
        {days.map(day => (
          <ShiftCell key={day} shift={schedule[dentist][day]} conflict={conflicts[dentist]?.[day]} />
        ))}
      </div>
    ))}
  </div>
);

export default ScheduleTable;