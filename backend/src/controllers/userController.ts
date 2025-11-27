import { Request, Response } from 'express';
import { getDb } from '../db/db';

export const getUserTrips = async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user?.id;
    const db = await getDb();

    // As passenger
    const requests = await db.all(
        `SELECT r.*, ride.origin, ride.destination, ride.departure_time, ride.driver_id, u.full_name as driver_name
     FROM requests r
     JOIN rides ride ON r.ride_id = ride.id
     JOIN users u ON ride.driver_id = u.id
     WHERE r.passenger_id = ?
     ORDER BY ride.departure_time DESC`,
        [userId]
    );

    // As driver
    const rides = await db.all(
        `SELECT * FROM rides WHERE driver_id = ? ORDER BY departure_time DESC`,
        [userId]
    );

    res.json({ asPassenger: requests, asDriver: rides });
};

export const rateUser = async (req: Request, res: Response) => {
    // Mock rating implementation
    res.status(201).json({ message: 'Rating submitted' });
};
