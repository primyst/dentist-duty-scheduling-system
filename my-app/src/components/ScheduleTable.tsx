"use client";

import React from "react";

const dentists = [
  "Dr. Sarah",
  "Dr. Micheal",
  "Dr. Usman",
  "Dr. Ubaydah",
  "Dr. Abdulqudus",
  "Dr. Faridah",
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// Dummy schedule (dentist -> day -> shift)
const schedule: Record<string, Record<string, string>> = {
  "Dr. Sarah": {
    Monday: "Morning",
    Tuesday: "-",
    Wednesday: "Morning",
    Thursday: "-",
    Friday: "Morning",
  },
  "Dr. Micheal": {
    Monday: "-",
    Tuesday: "-",
    Wednesday: "Afternoon",
    Thursday: "Morning",
    Friday: "Afternoon",
  },
  "Dr. Usman": {
    Monday: "-",
    Tuesday: "Morning",
    Wednesday: "Afternoon",
    Thursday: "Afternoon",
    Friday: "-",
  },
  "Dr. Ubaydah": {
    Monday: "Afternoon",
    Tuesday: "Afternoon",
    Wednesday: "-",
    Thursday: "-",
    Friday: "Afternoon",
  },
  "Dr. Abdulqudus": {
    Monday: "Morning",
    Tuesday: "Afternoon",
    Wednesday: "-",
    Thursday: "Afternoon",
    Friday: "-",
  },
  "Dr. Faridah": {
    Monday: "-",
    Tuesday: "Morning",
    Wednesday: "Afternoon",
    Thursday: "-",
    Friday: "Afternoon",
  },
};

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
                  {schedule[dentist][day]}
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