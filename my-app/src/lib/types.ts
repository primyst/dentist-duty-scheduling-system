export type Role = "doctor" | "nurse";

export interface Staff {
  id: string;
  name: string;
  role: Role;
  departments: string[];
}

export interface Department {
  name: string;
  workdays: string[];
  shifts: string[];
}

export interface ShiftAssignment {
  department: string;
  day: string;
  shift: string;
  doctors: Staff[];
  nurses: Staff[];
}

export interface ShiftSwapRequest {
  id: string;
  staffId: string;
  department: string;
  day: string;
  shift: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
}
