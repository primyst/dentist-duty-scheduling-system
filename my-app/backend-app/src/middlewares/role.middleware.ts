import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';

export const roleMiddleware = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user as User;

        if (!user || !roles.includes(user.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        next();
    };
};