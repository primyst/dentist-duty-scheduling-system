"use client";
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface StatsPanelProps {
  schedule: Record<string, Record<string, string | null>>;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ schedule }) => {
  const dentistNames = Object.keys(schedule);
  const shiftCounts = dentistNames.map(d =>
    Object.values(schedule[d]).filter(Boolean).length
  );

  const data = {
    labels: dentistNames,
    datasets: [
      {
        label: "Total Shifts",
        data: shiftCounts,
        backgroundColor: "rgba(54, 162, 235, 0.7)"
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Shift Distribution per Dentist" }
    }
  };

  return (
    <div className="mt-6 p-4 border rounded-md bg-gray-100">
      <Bar data={data} options={options} />
    </div>
  );
};

export default StatsPanel;