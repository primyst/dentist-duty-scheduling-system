export interface User {
    id: string;
    username: string;
    password: string;
    role: 'admin' | 'staff';
    departmentId: string;
}

export interface Department {
    id: string;
    name: 'Emergency' | 'Surgery' | string;
}

export interface Shift {
    id: string;
    departmentId: string;
    startTime: Date;
    endTime: Date;
    assignedUserId?: string;
}

export interface ShiftRequest {
    id: string;
    userId: string;
    shiftId: string;
    requestDate: Date;
    status: 'pending' | 'approved' | 'rejected';
}

export interface FairShiftAssignment {
    userId: string;
    shiftId: string;
    assigned: boolean;
}