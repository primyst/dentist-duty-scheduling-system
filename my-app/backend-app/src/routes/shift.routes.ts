import { Router } from 'express';
import ShiftController from '../controllers/shift.controller';

const router = Router();
const shiftController = new ShiftController();

// Route to create a new shift
router.post('/', shiftController.createShift);

// Route to get all shifts
router.get('/', shiftController.getAllShifts);

// Route to get a specific shift by ID
router.get('/:id', shiftController.getShiftById);

// Route to update a shift
router.put('/:id', shiftController.updateShift);

// Route to delete a shift
router.delete('/:id', shiftController.deleteShift);

export default router;