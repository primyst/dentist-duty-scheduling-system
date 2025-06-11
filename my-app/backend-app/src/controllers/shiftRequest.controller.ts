export class ShiftRequestController {
    constructor(private shiftRequestService: any) {}

    async submitRequest(req: any, res: any) {
        try {
            const requestData = req.body;
            const newRequest = await this.shiftRequestService.createRequest(requestData);
            res.status(201).json(newRequest);
        } catch (error) {
            res.status(500).json({ message: 'Error submitting request', error });
        }
    }

    async updateRequest(req: any, res: any) {
        try {
            const requestId = req.params.id;
            const updatedData = req.body;
            const updatedRequest = await this.shiftRequestService.updateRequest(requestId, updatedData);
            res.status(200).json(updatedRequest);
        } catch (error) {
            res.status(500).json({ message: 'Error updating request', error });
        }
    }

    async getRequests(req: any, res: any) {
        try {
            const requests = await this.shiftRequestService.getAllRequests();
            res.status(200).json(requests);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching requests', error });
        }
    }

    async getRequestById(req: any, res: any) {
        try {
            const requestId = req.params.id;
            const request = await this.shiftRequestService.getRequestById(requestId);
            if (!request) {
                return res.status(404).json({ message: 'Request not found' });
            }
            res.status(200).json(request);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching request', error });
        }
    }
}