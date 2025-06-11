export class DepartmentController {
    constructor(private departmentService: any) {}

    async createDepartment(req: any, res: any) {
        try {
            const departmentData = req.body;
            const newDepartment = await this.departmentService.create(departmentData);
            res.status(201).json(newDepartment);
        } catch (error) {
            res.status(500).json({ message: 'Error creating department', error });
        }
    }

    async getDepartments(req: any, res: any) {
        try {
            const departments = await this.departmentService.getAll();
            res.status(200).json(departments);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching departments', error });
        }
    }

    async updateDepartment(req: any, res: any) {
        try {
            const departmentId = req.params.id;
            const updatedData = req.body;
            const updatedDepartment = await this.departmentService.update(departmentId, updatedData);
            res.status(200).json(updatedDepartment);
        } catch (error) {
            res.status(500).json({ message: 'Error updating department', error });
        }
    }

    async deleteDepartment(req: any, res: any) {
        try {
            const departmentId = req.params.id;
            await this.departmentService.delete(departmentId);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error deleting department', error });
        }
    }
}