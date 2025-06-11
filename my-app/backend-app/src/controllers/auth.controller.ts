import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    public async register(req: Request, res: Response): Promise<Response> {
        try {
            const user = await this.authService.register(req.body);
            return res.status(201).json(user);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    public async login(req: Request, res: Response): Promise<Response> {
        try {
            const token = await this.authService.login(req.body);
            return res.status(200).json({ token });
        } catch (error) {
            return res.status(401).json({ message: error.message });
        }
    }

    public async getProfile(req: Request, res: Response): Promise<Response> {
        try {
            const user = await this.authService.getProfile(req.user.id);
            return res.status(200).json(user);
        } catch (error) {
            return res.status(404).json({ message: error.message });
        }
    }
}

export default new AuthController();