export type Role = "doctor" | "nurse";

export type Department = {
  name: string;
  workdays: string[];
  shifts: {
    time: string;
    doctors: string[];
    nurses: string[];
  }[];
};

export type Staff = {
  id: string;
  name: string;
  role: Role[];
  departments: string[];
};

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
