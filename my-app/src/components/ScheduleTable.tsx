"use client";

import { FC, useEffect, useState } from "react";
import { department, staff } from "@/lib/data";
import { ShiftAssignment } from "@/lib/types";
import { Stethoscope, Syringe } from "lucide-react";
import { generateWeeklySchedule } from "@/lib/scheduler";
import { supabase } from "@/lib/supabaseClient";

interface Props {
  date: Date | null;
  onlyDepartment?: string;
  view?: "weekly" | "daily";
}

const ScheduleTable: FC<Props> = ({ date, onlyDepartment, view }) => {
  const [schedule, setSchedule] = useState<ShiftAssignment[]>([]);

  useEffect(() => {
    const saveAndLoadSchedule = async () => {
      if (!date) return;

      const start = new Date(date);
      const dates: string[] = [];

      for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        dates.push(d.toISOString().split("T")[0]);
      }

      // Fetch any existing schedule from Supabase
      const { data: existing, error: fetchError } = await supabase
        .from("shift_assignment")
        .select("*")
        .in("day", dates);

      if (fetchError) {
        console.error("Fetch error:", fetchError.message);
        return;
      }

      if (existing && existing.length === dates.length * department.length) {
        setSchedule(existing);
        return;
      }

      // Generate weekly schedule if not complete
      const generated = generateWeeklySchedule(department, staff, date);
      setSchedule(generated);

      const { error: insertError } = await supabase
        .from("shift_assignment")
        .insert(generated);

      if (insertError) {
        console.error("Insert error:", insertError.message);
      }
    };

    saveAndLoadSchedule();
  }, [date]);

  if (!date) return null;

  const visibleDepartments = onlyDepartment
    ? department.filter((d) => d.name.toLowerCase() === onlyDepartment.toLowerCase())
    : department;

  const days = view === "daily"
  ? [{
      name: date.toLocaleDateString("en-US", { weekday: "long" }),
      dateStr: date.toISOString().split("T")[0],
    }]
  : [...Array(7)].map((_, i) => {
      const d = new Date(date);
      d.setDate(date.getDate() + i);
      return {
        name: d.toLocaleDateString("en-US", { weekday: "long" }),
        dateStr: d.toISOString().split("T")[0],
      };
    });

  return (
    <div className="space-y-10">
      {days.map(({ name, dateStr }) => (
        <div key={dateStr}>
          <h2 className="text-xl font-bold text-blue-800 mb-2">
            {name} – {dateStr}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleDepartments.map((dept) => {
              if (!dept.workdays.includes(name)) return null;

              return (
                <div key={`${dept.name}-${dateStr}`} className="bg-white rounded-xl shadow p-4">
                  <h3 className="text-lg font-bold text-blue-700">{dept.name}</h3>

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
        </div>
      ))}
    </div>
  );
};

export default ScheduleTable;