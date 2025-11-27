import { Request, Response } from 'express';
import { getDb } from '../db/db';

export const addPaymentMethod = async (req: Request, res: Response) => {
    // Mock adding payment method
    res.status(201).json({ message: 'Payment method added', id: 'pm_mock_123' });
};

export const getPaymentMethods = async (req: Request, res: Response) => {
    // Mock getting payment methods
    res.json([{ id: 'pm_mock_123', brand: 'Visa', last4: '4242' }]);
};
