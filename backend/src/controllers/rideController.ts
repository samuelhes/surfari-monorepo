import { Request, Response } from 'express';
import { getDb } from '../db/db';
import { Ride } from '../models/ride';

export const createRide = async (req: Request, res: Response) => {
    // @ts-ignore
    const driverId = req.user?.id;
    const { origin, destination, departure_time, duration_minutes, seats_total, price_per_seat, notes } = req.body;
    const db = await getDb();

    try {
        const result = await db.run(
            `INSERT INTO rides (driver_id, origin, destination, departure_time, duration_minutes, seats_total, seats_available, price_per_seat, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [driverId, origin, destination, departure_time, duration_minutes, seats_total, seats_total, price_per_seat, notes]
        );
        res.status(201).json({ id: result.lastID, ...req.body, seats_available: seats_total, driver_id: driverId });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create ride' });
    }
};

export const getRides = async (req: Request, res: Response) => {
    const { origin, destination, date } = req.query;
    const db = await getDb();

    let query = `SELECT r.*, u.full_name as driver_name, u.profile_photo as driver_photo, u.car_info 
               FROM rides r 
               JOIN users u ON r.driver_id = u.id 
               WHERE r.status = 'PUBLISHED' AND r.seats_available > 0`;
    const params: any[] = [];

    if (origin) {
        query += ` AND r.origin LIKE ?`;
        params.push(`%${origin}%`);
    }
    if (destination) {
        query += ` AND r.destination LIKE ?`;
        params.push(`%${destination}%`);
    }
    if (date) {
        query += ` AND date(r.departure_time) = date(?)`;
        params.push(date);
    }

    query += ` ORDER BY r.departure_time ASC`;

    const rides = await db.all(query, params);

    // Parse car_info
    const ridesWithCar = rides.map(ride => ({
        ...ride,
        car_info: ride.car_info ? JSON.parse(ride.car_info) : null
    }));

    res.json(ridesWithCar);
};

export const getRideById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const db = await getDb();
    const ride = await db.get(`SELECT r.*, u.full_name as driver_name, u.profile_photo as driver_photo, u.car_info 
                             FROM rides r 
                             JOIN users u ON r.driver_id = u.id 
                             WHERE r.id = ?`, [id]);

    if (!ride) return res.status(404).json({ error: 'Ride not found' });

    ride.car_info = ride.car_info ? JSON.parse(ride.car_info) : null;
    res.json(ride);
};
