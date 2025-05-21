'use client';

import { FC } from 'react';
import { department, staff } from '@/lib/data';
import { Role } from '@/lib/types';

interface Props {
  date: Date | null;
}

const getDayName = (date: Date) => {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

const ScheduleTable: FC<Props> = ({ date }) => {
  if (!date) return null;

  const dayName = getDayName(date);

  return (
    <div className="space-y-6">
      {department.map((dept) => {
        if (!dept.workdays.includes(dayName)) return null;

        return (
          <div key={dept.name} className="border rounded-md shadow-md p-4">
            <h2 className="text-xl font-semibold text-blue-600">{dept.name}</h2>
            {dept.time.length > 0 ? (
              dept.time.map((shiftTime) => {
                const assignedDoctors = staff
                  .filter(
                    (s) =>
                      s.department.name === dept.name && s.role === 'doctor'
                  )
                  .map((d) => d.name);

                const assignedNurses = staff
                  .filter(
                    (s) =>
                      s.department.name === dept.name && s.role === 'nurse'
                  )
                  .map((n) => n.name);

                return (
                  <div key={shiftTime} className="mt-4">
                    <p className="font-medium text-gray-700">{shiftTime}</p>
                    <div className="ml-4 mt-2">
                      <p className="text-sm font-semibold">Doctors:</p>
                      {assignedDoctors.length ? (
                        assignedDoctors.map((doc) => (
                          <p key={doc} className="ml-2 text-sm text-gray-600">
                            {doc}
                          </p>
                        ))
                      ) : (
                        <p className="ml-2 text-sm text-gray-400">None</p>
                      )}

                      <p className="text-sm font-semibold mt-2">Nurses:</p>
                      {assignedNurses.length ? (
                        assignedNurses.map((nurse) => (
                          <p key={nurse} className="ml-2 text-sm text-gray-600">
                            {nurse}
                          </p>
                        ))
                      ) : (
                        <p className="ml-2 text-sm text-gray-400">None</p>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm italic text-gray-400 mt-2">No shifts listed</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ScheduleTable;
