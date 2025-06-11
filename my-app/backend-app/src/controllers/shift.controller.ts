import { Request, Response } from 'express';
import ShiftService from '../services/shift.service';

class ShiftController {
    private shiftService: ShiftService;

    constructor() {
        this.shiftService = new ShiftService();
    }

    public async createShift(req: Request, res: Response): Promise<Response> {
        try {
            const shiftData = req.body;
            const newShift = await this.shiftService.createShift(shiftData);
            return res.status(201).json(newShift);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    public async getShifts(req: Request, res: Response): Promise<Response> {
        try {
            const shifts = await this.shiftService.getShifts();
            return res.status(200).json(shifts);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    public async getShiftById(req: Request, res: Response): Promise<Response> {
        try {
            const shiftId = req.params.id;
            const shift = await this.shiftService.getShiftById(shiftId);
            if (!shift) {
                return res.status(404).json({ message: 'Shift not found' });
            }
            return res.status(200).json(shift);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    public async updateShift(req: Request, res: Response): Promise<Response> {
        try {
            const shiftId = req.params.id;
            const shiftData = req.body;
            const updatedShift = await this.shiftService.updateShift(shiftId, shiftData);
            if (!updatedShift) {
                return res.status(404).json({ message: 'Shift not found' });
            }
            return res.status(200).json(updatedShift);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    public async deleteShift(req: Request, res: Response): Promise<Response> {
        try {
            const shiftId = req.params.id;
            const deleted = await this.shiftService.deleteShift(shiftId);
            if (!deleted) {
                return res.status(404).json({ message: 'Shift not found' });
            }
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

export default ShiftController;