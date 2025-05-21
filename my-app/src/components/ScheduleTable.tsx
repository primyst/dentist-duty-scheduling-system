"use client";

import { FC } from "react";
import { department, staff } from "@/lib/data";
import { Stethoscope, Syringe } from "lucide-react";
import { Role } from "@/lib/types";

interface Props {
  date: Date | null;
}

const getDayName = (date: Date) => {
  return date.toLocaleDateString("en-US", { weekday: "long" });
};

const ScheduleTable: FC<Props> = ({ date }) => {
  if (!date) return null;

  const dayName = getDayName(date);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {department.map((dept) => {
        if (!dept.workdays.includes(dayName)) return null;

        return (
          <div key={dept.name} className="bg-white rounded-xl shadow-md p-4">
            <h2 className="text-lg font-bold text-blue-700">{dept.name}</h2>

            {dept.time.length > 0 ? (
              dept.time.map((shiftTime) => {
                const assignedDoctors = staff
                  .filter(
                    (s) =>
                      s.department.name === dept.name && s.role === "doctor"
                  )
                  .map((d) => d.name);

                const assignedNurses = staff
                  .filter(
                    (s) => s.department.name === dept.name && s.role === "nurse"
                  )
                  .map((n) => n.name);

                return (
                  <div key={shiftTime} className="mt-4 border-t pt-3">
                    <p className="font-medium text-gray-800">{shiftTime}</p>

                    <div className="mt-2">
                      <div className="flex items-center gap-2 text-blue-600 font-medium">
                        <Stethoscope className="w-4 h-4" />
                        Doctors
                      </div>
                      {assignedDoctors.length ? (
                        <ul className="ml-6 list-disc text-sm text-gray-700">
                          {assignedDoctors.map((doc) => (
                            <li key={doc}>{doc}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="ml-6 text-sm text-gray-400">None</p>
                      )}
                    </div>

                    <div className="mt-2">
                      <div className="flex items-center gap-2 text-green-600 font-medium">
                        <Syringe className="w-4 h-4" />
                        Nurses
                      </div>
                      {assignedNurses.length ? (
                        <ul className="ml-6 list-disc text-sm text-gray-700">
                          {assignedNurses.map((nurse) => (
                            <li key={nurse}>{nurse}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="ml-6 text-sm text-gray-400">None</p>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm italic text-gray-400 mt-2">
                No shifts listed
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ScheduleTable;
