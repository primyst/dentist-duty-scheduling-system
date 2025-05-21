export type Role = "doctor" | "nurse";

export interface Department {
  name: string;
  workdays: string[];
  time: string[];
}

export interface Staff {
  id: string;
  name: string;
  department: Department;
  role: Role;
}

export interface ShiftAssignment {
    department: string
    day: string
    shift: string
    doctors: string
    nurses: string
}

export interface Swap {
  id: string;
  requesterId: string;
  requesterName: string;
  to: string;
  department: string;
  day: string;
  shift: string;
  status: "Pending" | "Approved" | "Rejected";
}
