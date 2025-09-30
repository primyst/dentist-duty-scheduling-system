"use client";

import React, { useState } from "react";

const dentists = [
  "Dr. Sarah",
  "Dr. Micheal",
  "Dr. Usman",
  "Dr. Ubaydah",
  "Dr. Abdulqudus",
  "Dr. Faridah",
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// Dummy schedule
const schedule: Record<string, Record<string, string>> = {
  "Dr. Sarah": { Monday: "Morning", Tuesday: "-", Wednesday: "Morning", Thursday: "-", Friday: "Morning" },
  "Dr. Micheal": { Monday: "-", Tuesday: "-", Wednesday: "Afternoon", Thursday: "Morning", Friday: "Afternoon" },
  "Dr. Usman": { Monday: "-", Tuesday: "Morning", Wednesday: "Afternoon", Thursday: "Afternoon", Friday: "-" },
  "Dr. Ubaydah": { Monday: "Afternoon", Tuesday: "Afternoon", Wednesday: "-", Thursday: "-", Friday: "Afternoon" },
  "Dr. Abdulqudus": { Monday: "Morning", Tuesday: "Afternoon", Wednesday: "-", Thursday: "Afternoon", Friday: "-" },
  "Dr. Faridah": { Monday: "-", Tuesday: "Morning", Wednesday: "Afternoon", Thursday: "-", Friday: "Afternoon" },
};

// Assign colors to dentists
const dentistColors: Record<string, string> = {
  "Dr. Sarah": "bg-blue-400",
  "Dr. Micheal": "bg-green-400",
  "Dr. Usman": "bg-yellow-400",
  "Dr. Ubaydah": "bg-purple-400",
  "Dr. Abdulqudus": "bg-pink-400",
  "Dr. Faridah": "bg-orange-400",
};

const ScheduleTable = () => {
  const [selectedDentist, setSelectedDentist] = useState<string | null>(null);

  return (
    <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
      <h2 className="text-lg font-bold mb-4">Weekly Schedule</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="px-4 py-2 text-left">Dentist</th>
            {days.map((day) => (
              <th key={day} className="px-4 py-2 text-center">{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dentists.map((dentist) => (
            <tr key={dentist} className="border-b">
              <td className="px-4 py-2 font-medium">{dentist}</td>
              {days.map((day) => {
                const shift = schedule[dentist][day];
                return (
                  <td
                    key={`${dentist}-${day}`}
                    className={`px-4 py-2 text-center text-white rounded cursor-pointer ${
                      shift !== "-" ? dentistColors[dentist] : ""
                    } ${selectedDentist === dentist ? "ring-2 ring-blue-500" : ""}`}
                    onClick={() => setSelectedDentist(shift !== "-" ? dentist : null)}
                  >
                    {shift}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {selectedDentist && (
        <div className="mt-2 p-2 bg-blue-50 border border-blue-300 rounded">
          Selected Dentist: <strong>{selectedDentist}</strong>
        </div>
      )}
    </div>
  );
};

export default ScheduleTable;