import { ShiftRequest } from '../models/shiftRequest.model';
import { User } from '../models/user.model';

export class ShiftRequestService {
    async createShiftRequest(userId: string, shiftId: string, reason: string) {
        const shiftRequest = new ShiftRequest({
            userId,
            shiftId,
            reason,
            status: 'pending',
        });
        return await shiftRequest.save();
    }

    async getShiftRequestsByUser(userId: string) {
        return await ShiftRequest.find({ userId });
    }

    async updateShiftRequestStatus(requestId: string, status: string) {
        return await ShiftRequest.findByIdAndUpdate(requestId, { status }, { new: true });
    }

    async getPendingRequests() {
        return await ShiftRequest.find({ status: 'pending' }).populate('userId');
    }

    async getShiftRequestById(requestId: string) {
        return await ShiftRequest.findById(requestId).populate('userId');
    }
}