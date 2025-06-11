import { Router } from 'express';
import ShiftRequestController from '../controllers/shiftRequest.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';

const router = Router();
const shiftRequestController = new ShiftRequestController();

// Route to submit a shift change request
router.post('/', authenticate, shiftRequestController.submitRequest);

// Route to get all shift change requests for a user
router.get('/', authenticate, shiftRequestController.getUserRequests);

// Route to update the status of a shift change request (admin only)
router.patch('/:id/status', authenticate, authorize('admin'), shiftRequestController.updateRequestStatus);

// Route to get all shift change requests (admin only)
router.get('/admin', authenticate, authorize('admin'), shiftRequestController.getAllRequests);

export default router;