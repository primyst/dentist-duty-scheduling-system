import { Department, Staff, AssignedShift } from "./types";
import { staff as allStaff } from "./data";
import { supabase } from "@/lib/supabase";

// Get all staff by department and role
export const getStaffByDepartment = (department: string) => {
  const doctors = allStaff.filter(
    (s) => s.role === "doctor" && s.departments.includes(department)
  );
  const nurses = allStaff.filter(
    (s) => s.role === "nurse" && s.departments.includes(department)
  );
  return { doctors, nurses };
};

// Utility to format a Date as "YYYY-MM-DD"
export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

// Fairly assign a shift by rotating through staff
export const assignShiftsFairly = (
  departments: Department[],
  date: Date,
  existingAssignments: AssignedShift[]
): AssignedShift[] => {
  const assignedShifts: AssignedShift[] = [];
  const day = date.toLocaleDateString("en-US", { weekday: "long" });
  const formattedDate = formatDate(date);

  // Track how many shifts each staff has (optional for balancing)
  const staffShiftCount: Record<string, number> = {};

  departments
    .filter((dept) => dept.workdays.includes(day))
    .forEach((dept) => {
      const { doctors, nurses } = getStaffByDepartment(dept.name);

      let doctorIndex = 0;
      let nurseIndex = 0;

      dept.shifts.forEach((shift) => {
        const assignedDoctors: Staff[] = [];
        const assignedNurses: Staff[] = [];

        // Assign one doctor for the shift
        if (doctors.length > 0) {
          const doctor = doctors[doctorIndex % doctors.length];
          assignedDoctors.push(doctor);
          doctorIndex++;
          staffShiftCount[doctor.id] = (staffShiftCount[doctor.id] || 0) + 1;
        }

        // Assign one nurse for the shift
        if (nurses.length > 0) {
          const nurse = nurses[nurseIndex % nurses.length];
          assignedNurses.push(nurse);
          nurseIndex++;
          staffShiftCount[nurse.id] = (staffShiftCount[nurse.id] || 0) + 1;
        }

        assignedShifts.push({
          date: formattedDate,
          department: dept.name,
          shift,
          doctors: assignedDoctors,
          nurses: assignedNurses,
        });
      });
    });

  return assignedShifts;
};

// Get assignments for a specific date
export const getAssignmentsForDate = (
  date: Date,
  allAssignments: AssignedShift[]
): AssignedShift[] => {
  const formattedDate = formatDate(date);
  return allAssignments.filter((a) => a.date === formattedDate);
};

// Get assignments for a specific staff member
export const getAssignmentsForStaff = (
  staffId: string,
  allAssignments: AssignedShift[]
): AssignedShift[] => {
  return allAssignments.filter(
    (a) =>
      a.doctors.some((d) => d.id === staffId) ||
      a.nurses.some((n) => n.id === staffId)
  );
};

export const saveAssignmentsToSupabase = async (
  assignments: AssignedShift[]
) => {
  const { data, error } = await supabase
    .from("shift_assignments")
    .insert(assignments);

  if (error) {
    console.error("Error saving assignments:", error.message);
    return false;
  }

  console.log("Assignments saved:", data);
  return true;
};