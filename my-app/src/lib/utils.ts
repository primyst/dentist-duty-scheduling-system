import { Staff, Department, AssignedShift } from "./types";

const countAssignments = (assignments: AssignedShift[], staffId: string) => { return assignments.filter((a) => a.staffId === staffId).length; };

const shuffle = <T,>(array: T[]): T[] => { return [...array].sort(() => Math.random() - 0.5); };

export function distributeShifts( staffList: Staff[], departments: Department[], date: Date ): AssignedShift[] { const assignments: AssignedShift[] = []; const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

for (const department of departments) { if (!department.workdays.includes(dayName)) continue;

const deptShifts = department.shifts;
const eligibleDoctors = shuffle(
  staffList.filter(
    (s) => s.role === "doctor" && s.departments.includes(department.name)
  )
);
const eligibleNurses = shuffle(
  staffList.filter(
    (s) => s.role === "nurse" && s.departments.includes(department.name)
  )
);

let docIndex = 0;
let nurseIndex = 0;

for (const shift of deptShifts) {
  eligibleDoctors.sort(
    (a, b) =>
      countAssignments(assignments, a.id) -
      countAssignments(assignments, b.id)
  );
  const assignedDoctor = eligibleDoctors[0];
  if (assignedDoctor) {
    assignments.push({
      staffId: assignedDoctor.id,
      department: department.name,
      shift,
      date: date.toISOString().split("T")[0],
    });
  }

  eligibleNurses.sort(
    (a, b) =>
      countAssignments(assignments, a.id) -
      countAssignments(assignments, b.id)
  );
  const assignedNurse = eligibleNurses[0];
  if (assignedNurse) {
    assignments.push({
      staffId: assignedNurse.id,
      department: department.name,
      shift,
      date: date.toISOString().split("T")[0],
    });
  }
}

}

return assignments; }

