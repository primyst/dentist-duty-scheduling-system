"use client";

import React from "react";

const dentists = ["Dr. Sarah", "Dr. Micheal", "Dr. Usman", "Dr. Ubaydah", "Dr. Abdulqudus", "Dr. Faridah"];
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const ScheduleTable = () => {
  return (
    <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="px-4 py-2 text-left">Dentist</th>
            {days.map((day) => (
              <th key={day} className="px-4 py-2 text-center">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dentists.map((dentist) => (
            <tr key={dentist} className="border-b">
              <td className="px-4 py-2 font-medium">{dentist}</td>
              {days.map((day) => (
                <td
                  key={`${dentist}-${day}`}
                  className="px-4 py-2 text-center text-sm text-slate-600"
                >
                  Morning / Afternoon
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleTable;