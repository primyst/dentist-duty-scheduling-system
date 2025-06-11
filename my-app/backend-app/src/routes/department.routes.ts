import { Router } from 'express';
import { DepartmentController } from '../controllers/department.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();
const departmentController = new DepartmentController();

// Routes for department management
router.post('/', authMiddleware, roleMiddleware(['admin']), departmentController.createDepartment);
router.get('/', authMiddleware, departmentController.getDepartments);
router.get('/:id', authMiddleware, departmentController.getDepartmentById);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), departmentController.updateDepartment);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), departmentController.deleteDepartment);

export default router;