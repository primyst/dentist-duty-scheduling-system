"use client";
import React from "react";

interface ShiftCellProps {
  shift: string | null;
  conflict?: boolean;
}

const ShiftCell: React.FC<ShiftCellProps> = ({ shift, conflict }) => {
  let bgColor = "bg-white";
  if (conflict) bgColor = "bg-red-400";
  else if (shift === "Morning") bgColor = "bg-blue-300";
  else if (shift === "Afternoon") bgColor = "bg-green-300";

  return (
    <div className={`w-28 h-12 flex items-center justify-center border ${bgColor}`}>
      {shift || "-"}
    </div>
  );
};

export default ShiftCell;