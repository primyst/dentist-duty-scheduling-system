import { Department, Staff, ShiftAssignment } from "./types";

function getWeekday(date: string): string {
  return new Date(date).toLocaleDateString("en-US", { weekday: "long" });
}

export function generateSchedule(
  departments: Department[],
  staffList: Staff[],
  date: string
): ShiftAssignment[] {
  const schedule: ShiftAssignment[] = [];
  const weekday = getWeekday(date);

  const shiftCount: Record<string, number> = {};

  for (const department of departments) {
    if (!department.workdays.includes(weekday)) continue;

    // ✅ Filter staff by department string match
    const deptStaff = staffList.filter((s) => s.department === department.name);
    const doctors = deptStaff.filter((s) => s.role === "doctor");
    const nurses = deptStaff.filter((s) => s.role === "nurse");

    const getLeastWorked = (list: Staff[], count: number) => {
      return [...list]
        .sort((a, b) => (shiftCount[a.id] ?? 0) - (shiftCount[b.id] ?? 0))
        .slice(0, count);
    };

    for (const shift of department.time) {
      const assignedDoctors = getLeastWorked(doctors, 2);
      const assignedNurses = getLeastWorked(nurses, 2);

      assignedDoctors.forEach(
        (d) => (shiftCount[d.id] = (shiftCount[d.id] ?? 0) + 1)
      );
      assignedNurses.forEach(
        (n) => (shiftCount[n.id] = (shiftCount[n.id] ?? 0) + 1)
      );

      schedule.push({
        department: department.name,
        day: date,
        shift,
        doctors: assignedDoctors.map((d) => d.id),
        nurses: assignedNurses.map((n) => n.id),
      });
    }
  }

  return schedule;
}
