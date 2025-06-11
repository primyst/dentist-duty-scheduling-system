import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  role: 'admin' | 'staff';
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'staff'], default: 'staff' }
});

export const UserModel = mongoose.model<IUser>('User', UserSchema);

// Example: department.routes.ts
import { Router } from 'express';
import * as departmentController from '../controllers/department.controller';
// import { isAdmin } from '../middlewares/role.middleware';
import { isAdmin } from '../middlewares/role.middleware';
import { authMiddleware } from '../middlewares/auth.middleware'; // Your JWT/auth middleware

const router = Router();

router.post('/', authMiddleware, isAdmin, departmentController.createDepartment); // Only admin can create
router.get('/', authMiddleware, departmentController.getDepartments); // All authenticated users

export default router;