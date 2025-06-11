export interface Department {
    id: string;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

export class DepartmentModel {
    private departments: Department[] = [];

    public createDepartment(department: Department): Department {
        this.departments.push(department);
        return department;
    }

    public getDepartmentById(id: string): Department | undefined {
        return this.departments.find(department => department.id === id);
    }

    public getAllDepartments(): Department[] {
        return this.departments;
    }

    public updateDepartment(id: string, updatedData: Partial<Department>): Department | undefined {
        const departmentIndex = this.departments.findIndex(department => department.id === id);
        if (departmentIndex !== -1) {
            this.departments[departmentIndex] = { ...this.departments[departmentIndex], ...updatedData };
            return this.departments[departmentIndex];
        }
        return undefined;
    }

    public deleteDepartment(id: string): boolean {
        const departmentIndex = this.departments.findIndex(department => department.id === id);
        if (departmentIndex !== -1) {
            this.departments.splice(departmentIndex, 1);
            return true;
        }
        return false;
    }
}