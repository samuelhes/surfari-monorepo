import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../db/db';
import { User } from '../models/user';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const register = async (req: Request, res: Response) => {
    const { email, password, full_name, phone, role, car_info } = req.body;
    const db = await getDb();

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const carInfoStr = car_info ? JSON.stringify(car_info) : null;

        const result = await db.run(
            `INSERT INTO users (email, password, full_name, phone, role, car_info) VALUES (?, ?, ?, ?, ?, ?)`,
            [email, hashedPassword, full_name, phone, role, carInfoStr]
        );

        const token = jwt.sign({ id: result.lastID, email, role }, JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ token, user: { id: result.lastID, email, full_name, role } });
    } catch (error: any) {
        res.status(400).json({ error: 'Email already exists or invalid data' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const db = await getDb();

    const user = await db.get<User>('SELECT * FROM users WHERE email = ?', [email]);
    if (!user || !user.password) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role } });
};

export const getMe = async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user?.id;
    const db = await getDb();
    const user = await db.get<User>('SELECT id, email, full_name, phone, role, car_info, is_verified FROM users WHERE id = ?', [userId]);
    res.json(user);
};
