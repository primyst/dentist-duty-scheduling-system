"use client";

import { FC, useEffect, useState } from "react";
import { department, staff } from "@/lib/data";
import { ShiftAssignment } from "@/lib/types";
import { Stethoscope, Syringe } from "lucide-react";
import { generateSchedule } from "@/lib/scheduler";
import { supabase } from "@/lib/supabaseClient";

interface Props {
  date: Date | null;
  onlyDepartment?: string;
}

const getDayName = (date: Date) => {
  return date.toLocaleDateString("en-US", { weekday: "long" });
};

const ScheduleTable: FC<Props> = ({ date, onlyDepartment }) => {
  const [schedule, setSchedule] = useState<ShiftAssignment[]>([]);

  useEffect(() => {
    const saveSchedule = async () => {
      if (!date) return;

      const dateStr = date.toISOString().split("T")[0];

      const { data: existing, error: fetchError } = await supabase
        .from("shift_assignment")
        .select("*")
        .eq("day", dateStr);

      if (fetchError) {
        console.error("Error fetching schedule:", fetchError.message);
        return;
      }

      if (existing && existing.length > 0) {
        setSchedule(existing);
        return;
      }

      const generated = generateSchedule(department, staff, dateStr);
      setSchedule(generated);

      const { error: insertError } = await supabase
        .from("shift_assignment")
        .insert(generated);

      if (insertError) {
        console.error("Error saving schedule:", insertError.message);
      }
    };

    saveSchedule();
  }, [date]);

  if (!date) return null;

  const dayName = getDayName(date);
  const dateStr = date.toISOString().split("T")[0];

  const visibleDepartments = onlyDepartment
  ? department.filter((d) => d.id === onlyDepartment)
  : department;

  if (onlyDepartment && visibleDepartments.length === 0) {
  return <p className="text-gray-500">No matching department found for your account.</p>;
}

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {visibleDepartments.map((dept) => {
        if (!dept.workdays.includes(dayName)) return null;

        return (
          <div key={dept.name} className="bg-white rounded-xl shadow-md p-4">
            <h2 className="text-lg font-bold text-blue-700">{dept.name}</h2>

            {dept.time.map((shiftTime) => {
              const shift = schedule.find(
                (s) =>
                  s.department === dept.name &&
                  s.shift === shiftTime &&
                  s.day === dateStr
              );

              return (
                <div key={shiftTime} className="mt-4 border-t pt-3">
                  <p className="font-medium text-gray-800">{shiftTime}</p>

                  <div className="mt-2">
                    <div className="flex items-center gap-2 text-blue-600 font-medium">
                      <Stethoscope className="w-4 h-4" /> Doctors
                    </div>
                    {shift?.doctors?.length ? (
                      <ul className="ml-6 list-disc text-sm text-gray-700">
                        {shift.doctors.map((docId) => {
                          const doc = staff.find((s) => s.id === docId);
                          return <li key={docId}>{doc?.name || "Unknown"}</li>;
                        })}
                      </ul>
                    ) : (
                      <p className="ml-6 text-sm text-gray-400">None</p>
                    )}
                  </div>

                  <div className="mt-2">
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                      <Syringe className="w-4 h-4" /> Nurses
                    </div>
                    {shift?.nurses?.length ? (
                      <ul className="ml-6 list-disc text-sm text-gray-700">
                        {shift.nurses.map((nurseId) => {
                          const nurse = staff.find((s) => s.id === nurseId);
                          return (
                            <li key={nurseId}>{nurse?.name || "Unknown"}</li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="ml-6 text-sm text-gray-400">None</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default ScheduleTable;
