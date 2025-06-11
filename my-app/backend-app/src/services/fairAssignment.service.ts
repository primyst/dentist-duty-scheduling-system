import { Shift } from '../models/shift.model';
import { User } from '../models/user.model';
import { Department } from '../models/department.model';

export class FairAssignmentService {
    private shifts: Shift[];
    private users: User[];
    private departments: Department[];

    constructor(shifts: Shift[], users: User[], departments: Department[]) {
        this.shifts = shifts;
        this.users = users;
        this.departments = departments;
    }

    public assignShiftsFairly(): void {
        const departmentShifts = this.groupShiftsByDepartment();
        const userWorkloads = this.initializeUserWorkloads();

        for (const department in departmentShifts) {
            const shifts = departmentShifts[department];
            shifts.forEach(shift => {
                const user = this.findUserWithLeastWorkload(userWorkloads);
                this.assignShiftToUser(shift, user);
                userWorkloads[user.id]++;
            });
        }
    }

    private groupShiftsByDepartment(): Record<string, Shift[]> {
        return this.shifts.reduce((acc, shift) => {
            if (!acc[shift.departmentId]) {
                acc[shift.departmentId] = [];
            }
            acc[shift.departmentId].push(shift);
            return acc;
        }, {} as Record<string, Shift[]>);
    }

    private initializeUserWorkloads(): Record<string, number> {
        return this.users.reduce((acc, user) => {
            acc[user.id] = 0;
            return acc;
        }, {} as Record<string, number>);
    }

    private findUserWithLeastWorkload(userWorkloads: Record<string, number>): User {
        return this.users.reduce((prev, curr) => {
            return userWorkloads[curr.id] < userWorkloads[prev.id] ? curr : prev;
        });
    }

    private assignShiftToUser(shift: Shift, user: User): void {
        // Logic to assign the shift to the user
        // This could involve updating a database or an in-memory structure
    }
}