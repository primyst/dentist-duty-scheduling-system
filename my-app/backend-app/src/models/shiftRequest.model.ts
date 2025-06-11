export interface ShiftRequest {
    id: string;
    userId: string;
    shiftId: string;
    requestDate: Date;
    status: 'pending' | 'approved' | 'rejected';
    reason?: string;
}

export class ShiftRequestModel {
    constructor(private db: any) {}

    async createRequest(request: ShiftRequest): Promise<ShiftRequest> {
        // Logic to save the request to the database
        // Example: Save to db and return the saved request
        await this.db.save(request);
        return request;
    }

    async getRequestById(id: string): Promise<ShiftRequest | null> {
        // Logic to retrieve a request by ID from the database
        const request = await this.db.findById(id);
        return request ? request as ShiftRequest : null;
    }

    async updateRequestStatus(id: string, status: 'approved' | 'rejected'): Promise<ShiftRequest | null> {
        // Logic to update the status of a request in the database
        const updatedRequest = await this.db.updateStatusById(id, status);
        return updatedRequest ? updatedRequest as ShiftRequest : null;
    }

    async getAllRequestsByUserId(userId: string): Promise<ShiftRequest[]> {
        // Logic to retrieve all requests for a specific user
        const requests = await this.db.findAllByUserId(userId);
        return requests as ShiftRequest[];
    }
}