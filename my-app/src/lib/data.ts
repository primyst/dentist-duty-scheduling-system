import { Department, Staff } from "./types";

// Departments
export const departments: Department[] = [
  {
    name: "Emergency",
    workdays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    shifts: ["6am - 4pm", "4pm - 10pm"],
  },
  {
    name: "Surgery",
    workdays: ["Monday", "Friday"],
    shifts: ["8am - 2pm"],
  },
  {
    name: "Pediatrics",
    workdays: ["Tuesday", "Thursday"],
    shifts: ["7am - 3pm"],
  },
  {
    name: "Maternity",
    workdays: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    shifts: ["6am - 2pm", "2pm - 8pm"],
  },
];

// Staff list
export const staff: Staff[] = [
  {
    id: "d1",
    name: "Dr. Amao Adetayo",
    role: "doctor",
    departments: ["Emergency"],
  },
  {
    id: "d2",
    name: "Dr. Kudirat Raji",
    role: "doctor",
    departments: ["Emergency"],
  },
  {
    id: "d3",
    name: "Dr. Qudus Aisha",
    role: "doctor",
    departments: ["Emergency"],
  },
  {
    id: "d4",
    name: "Dr. Ayinla Adebayo",
    role: "doctor",
    departments: ["Surgery"],
  },
  {
    id: "d5",
    name: "Dr. Oyetunji Lateef",
    role: "doctor",
    departments: ["Surgery"],
  },
  {
    id: "d6",
    name: "Dr. Lateef Abdulsatar",
    role: "doctor",
    departments: ["Pediatrics"],
  },
  {
    id: "d7",
    name: "Dr. Raji Muibat",
    role: "doctor",
    departments: ["Pediatrics"],
  },
  {
    id: "d8",
    name: "Dr. Kehinde Kamal",
    role: "doctor",
    departments: ["Maternity"],
  },
  {
    id: "d9",
    name: "Dr. Barakat Oyewale",
    role: "doctor",
    departments: ["Maternity"],
  },
  {
    id: "d10",
    name: "Dr. Lateef Lateefah",
    role: "doctor",
    departments: ["Maternity"],
  },

  { id: "n1", name: "Nurse Omarr Blessing", role: "nurse", departments: ["Emergency"] },
  {
    id: "n2",
    name: "Nurse Akinwumi Temitope",
    role: "nurse",
    departments: ["Emergency"],
  },
  {
    id: "n3",
    name: "Nurse Abdulrashid Kamalideen",
    role: "nurse",
    departments: ["Emergency"],
  },
  {
    id: "n4",
    name: "Nurse Usman Kamal",
    role: "nurse",
    departments: ["Surgery"],
  },
  {
    id: "n5",
    name: "Nurse Taiwo Musa",
    role: "nurse",
    departments: ["Surgery"],
  },
  {
    id: "n6",
    name: "Nurse Adeoye Temitope",
    role: "nurse",
    departments: ["Pediatrics"],
  },
  {
    id: "n7",
    name: "Nurse Abiodun Tosin",
    role: "nurse",
    departments: ["Pediatrics"],
  },
  {
    id: "n8",
    name: "Nurse Azeez Saraf",
    role: "nurse",
    departments: ["Maternity"],
  },
  {
    id: "n9",
    name: "Nurse Amad Diallo",
    role: "nurse",
    departments: ["Maternity"],
  },
  {
    id: "n10",
    name: "Nurse Akande Olabanjo",
    role: "nurse",
    departments: ["Maternity"],
  },
];

// Admin ID List
export const validAdminIds = ["admin123", "admin456"];

// Utility functions

// Check if admin ID is valid
export const isValidAdminId = (id: string): boolean => {
  return validAdminIds.includes(id);
};

// Check if staff ID exists
export const isValidStaffId = (id: string): boolean => {
  return staff.some((s) => s.id === id);
};

// Get doctors and nurses by department
export const getStaffByDepartment = (department: string) => {
  const doctors = staff.filter(
    (s) => s.role === "doctor" && s.departments.includes(department)
  );
  const nurses = staff.filter(
    (s) => s.role === "nurse" && s.departments.includes(department)
  );
  return { doctors, nurses };
};
