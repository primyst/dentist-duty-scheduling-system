import { Department } from '../models/department.model';

export class DepartmentService {
    private departments: Department[] = [];

    public async createDepartment(departmentData: Partial<Department>): Promise<Department> {
        const newDepartment = new Department(departmentData);
        this.departments.push(newDepartment);
        return newDepartment;
    }

    public async getDepartments(): Promise<Department[]> {
        return this.departments;
    }

    public async updateDepartment(id: string, updatedData: Partial<Department>): Promise<Department | null> {
        const departmentIndex = this.departments.findIndex(dept => dept.id === id);
        if (departmentIndex === -1) {
            return null;
        }
        this.departments[departmentIndex] = { ...this.departments[departmentIndex], ...updatedData };
        return this.departments[departmentIndex];
    }

    public async deleteDepartment(id: string): Promise<boolean> {
        const departmentIndex = this.departments.findIndex(dept => dept.id === id);
        if (departmentIndex === -1) {
            return false;
        }
        this.departments.splice(departmentIndex, 1);
        return true;
    }
}