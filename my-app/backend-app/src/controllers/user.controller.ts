import { Request, Response } from 'express';
import UserService from '../services/user.service';

class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    public async getUserDetails(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.params.id;
            const user = await this.userService.getUserById(userId);
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching user details', error });
        }
    }

    public async updateUser(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.params.id;
            const updatedUser = await this.userService.updateUser(userId, req.body);
            return res.status(200).json(updatedUser);
        } catch (error) {
            return res.status(500).json({ message: 'Error updating user', error });
        }
    }
}

export default UserController;