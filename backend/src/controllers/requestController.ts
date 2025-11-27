import { Request, Response } from 'express';
import { getDb } from '../db/db';
import { RideRequest } from '../models/ride';

export const createRequest = async (req: Request, res: Response) => {
    // @ts-ignore
    const passengerId = req.user?.id;
    const { rideId } = req.params;
    const { seats_requested } = req.body;
    const db = await getDb();

    try {
        const result = await db.run(
            `INSERT INTO requests (ride_id, passenger_id, seats_requested) VALUES (?, ?, ?)`,
            [rideId, passengerId, seats_requested]
        );
        res.status(201).json({ id: result.lastID, ride_id: rideId, passenger_id: passengerId, seats_requested, status: 'PENDING' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create request' });
    }
};

export const getRequestsForRide = async (req: Request, res: Response) => {
    const { rideId } = req.params;
    const db = await getDb();

    const requests = await db.all(
        `SELECT r.*, u.full_name as passenger_name, u.profile_photo as passenger_photo 
     FROM requests r 
     JOIN users u ON r.passenger_id = u.id 
     WHERE r.ride_id = ?`,
        [rideId]
    );
    res.json(requests);
};

export const acceptRequest = async (req: Request, res: Response) => {
    const { rideId, requestId } = req.params;
    const db = await getDb();

    // Mock Payment Logic
    // In a real app, we would charge the user here.
    // For now, we assume success.

    try {
        // Check if seats are available
        const ride = await db.get('SELECT seats_available, price_per_seat FROM rides WHERE id = ?', [rideId]);
        const request = await db.get('SELECT seats_requested FROM requests WHERE id = ?', [requestId]);

        if (ride.seats_available < request.seats_requested) {
            return res.status(400).json({ error: 'Not enough seats available' });
        }

        // Update request status
        await db.run(`UPDATE requests SET status = 'ACCEPTED' WHERE id = ?`, [requestId]);

        // Update ride seats
        await db.run(`UPDATE rides SET seats_available = seats_available - ? WHERE id = ?`, [request.seats_requested, rideId]);

        // Create Payment Record
        const amount = ride.price_per_seat * request.seats_requested;
        await db.run(`INSERT INTO payments (request_id, amount, status) VALUES (?, ?, 'SUCCESS')`, [requestId, amount]);

        res.json({ message: 'Request accepted and payment processed', status: 'ACCEPTED' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to accept request' });
    }
};

export const rejectRequest = async (req: Request, res: Response) => {
    const { requestId } = req.params;
    const db = await getDb();

    await db.run(`UPDATE requests SET status = 'REJECTED' WHERE id = ?`, [requestId]);
    res.json({ message: 'Request rejected', status: 'REJECTED' });
};
