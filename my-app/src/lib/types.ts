export type StaffRole = "doctor" | "nurse";

export interface Staff { id: string; name: string; role: StaffRole; departments: string[]; totalShifts?: number; }

export interface Department { name: string; workdays: string[];
shifts: string[];
}

export interface ShiftAssignment { department: string; shiftTime: string; doctor: Staff | null; nurse: Staff | null; }

export interface DailySchedule { date: string; 
 assignments: ShiftAssignment[]; }

