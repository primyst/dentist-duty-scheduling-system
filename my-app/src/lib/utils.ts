import { departments, staff } from "./data";
import { ShiftAssignment, Staff } from "./types";

function getRandomStaff(pool: Staff[], count: number) {
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function generateShiftAssignments(): ShiftAssignment[] {
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const assignments: ShiftAssignment[] = [];

  for (const dept of departments) {
    for (const day of daysOfWeek) {
      if (!dept.workdays.includes(day)) continue;

      for (const shift of dept.shifts) {
        const deptDoctors = staff.filter(
          (s) => s.role === "doctor" && s.departments.includes(dept.name)
        );
        const deptNurses = staff.filter(
          (s) => s.role === "nurse" && s.departments.includes(dept.name)
        );

        const selectedDoctors = getRandomStaff(deptDoctors, 2);
        const selectedNurses = getRandomStaff(deptNurses, 2);

        assignments.push({
          department: dept.name,
          day,
          shift,
          doctors: selectedDoctors,
          nurses: selectedNurses,
        });
      }
    }
  }

  return assignments;
}