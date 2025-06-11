import { User } from '../models/user.model';
import { sign, verify } from 'jsonwebtoken';
import { Request, Response } from 'express';
import { Role } from '../types/index';
import { config } from '../config/index';

export class AuthService {
    private secretKey: string;

    constructor() {
        this.secretKey = config.JWT_SECRET;
    }

    async register(userData: any): Promise<User> {
        const user = new User(userData);
        return await user.save();
    }

    async login(email: string, password: string): Promise<string | null> {
        const user = await User.findOne({ email });
        if (user && user.comparePassword(password)) {
            return this.generateToken(user);
        }
        return null;
    }

    private generateToken(user: User): string {
        const payload = { id: user._id, role: user.role };
        return sign(payload, this.secretKey, { expiresIn: '1h' });
    }

    async verifyToken(token: string): Promise<any> {
        try {
            return verify(token, this.secretKey);
        } catch (error) {
            return null;
        }
    }

    async getUserRole(userId: string): Promise<Role | null> {
        const user = await User.findById(userId);
        return user ? user.role : null;
    }
}