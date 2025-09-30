"use client";

import React from "react";
import { Users, Calendar, BarChart3 } from "lucide-react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

// Schedule data (match your ScheduleTable)
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
  "Dr. Sarah": "#3B82F6",
  "Dr. Micheal": "#10B981",
  "Dr. Usman": "#F59E0B",
  "Dr. Ubaydah": "#8B5CF6",
  "Dr. Abdulqudus": "#EC4899",
  "Dr. Faridah": "#F97316",
};

const StatsPanel = () => {
  const dentists = Object.keys(schedule);

  // Calculate shifts per dentist dynamically
  const shiftsPerDentist: Record<string, number> = {};
  dentists.forEach((dentist) => {
    const shifts = Object.values(schedule[dentist]).filter((s) => s !== "-").length;
    shiftsPerDentist[dentist] = shifts;
  });

  const totalShifts = Object.values(shiftsPerDentist).reduce((a, b) => a + b, 0);

  // Bar chart
  const barData = {
    labels: dentists,
    datasets: [
      {
        label: "Shifts per Dentist",
        data: dentists.map((d) => shiftsPerDentist[d]),
        backgroundColor: dentists.map((d) => dentistColors[d]),
      },
    ],
  };

  // Pie chart
  const pieData = {
    labels: dentists,
    datasets: [
      {
        data: dentists.map((d) => shiftsPerDentist[d]),
        backgroundColor: dentists.map((d) => dentistColors[d]),
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Quick Stats */}
      <div className="bg-white shadow rounded-lg p-4 flex items-center gap-4">
        <Users className="text-blue-600" size={28} />
        <div>
          <p className="text-sm text-slate-500">Total Dentists</p>
          <h3 className="text-xl font-bold">{dentists.length}</h3>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4 flex items-center gap-4">
        <Calendar className="text-green-600" size={28} />
        <div>
          <p className="text-sm text-slate-500">Shifts This Week</p>
          <h3 className="text-xl font-bold">{totalShifts}</h3>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4 flex items-center gap-4">
        <BarChart3 className="text-purple-600" size={28} />
        <div>
          <p className="text-sm text-slate-500">Coverage</p>
          <h3 className="text-xl font-bold">
            {Math.round((totalShifts / (dentists.length * 5)) * 100)}%
          </h3>
        </div>
      </div>

      {/* Charts */}
      <div className="md:col-span-2 bg-white rounded-lg shadow p-4">
        <h4 className="font-semibold mb-2">Shifts per Dentist (Bar Chart)</h4>
        <Bar data={barData} />
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h4 className="font-semibold mb-2">Shift Distribution (Pie Chart)</h4>
        <Pie data={pieData} />
      </div>
    </div>
  );
};

export default StatsPanel;
