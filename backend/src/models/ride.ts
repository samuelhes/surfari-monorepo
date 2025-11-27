export interface Ride {
    id: number;
    driver_id: number;
    origin: string;
    destination: string;
    departure_time: string;
    duration_minutes: number;
    seats_total: number;
    seats_available: number;
    price_per_seat: number;
    notes?: string;
    status: 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
}

export interface RideRequest {
    id: number;
    ride_id: number;
    passenger_id: number;
    seats_requested: number;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'PAYMENT_FAILED' | 'CANCELLED';
    created_at: string;
}
