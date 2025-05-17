export interface Staff {
  id: string;
  name: string;
  role: "doctor" | "nurse";
  departments: string[];
}

export interface Department {
  name: string;
  workdays: string[];
  shifts: string[];
}

export interface AssignedShift {
  date: string;
  department: string;
  shift: string;
  doctors: Staff[];
  nurses: Staff[];
}
