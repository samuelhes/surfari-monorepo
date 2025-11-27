import { getDb } from '../db/db';
import bcrypt from 'bcryptjs';

const seed = async () => {
    const db = await getDb();

    // Clear existing data
    await db.exec('DELETE FROM users');
    await db.exec('DELETE FROM rides');
    await db.exec('DELETE FROM requests');
    await db.exec('DELETE FROM payments');

    // Create Users
    const password = await bcrypt.hash('password123', 10);

    // Driver
    await db.run(
        `INSERT INTO users (email, password, full_name, phone, role, car_info, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ['driver@test.com', password, 'John Driver', '1234567890', 'DRIVER', JSON.stringify({ brand: 'Toyota', model: 'Corolla', color: 'White', plate: 'ABC-123', seats: 4 }), 1]
    );

    // Passenger
    await db.run(
        `INSERT INTO users (email, password, full_name, phone, role) VALUES (?, ?, ?, ?, ?)`,
        ['passenger@test.com', password, 'Jane Passenger', '0987654321', 'PASSENGER']
    );

    console.log('Database seeded!');
};

seed().catch(console.error);
