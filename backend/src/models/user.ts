export interface User {
    id: number;
    email: string;
    password?: string;
    full_name: string;
    phone: string;
    role: 'PASSENGER' | 'DRIVER';
    profile_photo?: string;
    car_info?: string; // JSON string
    is_verified: number; // 0 or 1
}

export interface CarInfo {
    brand: string;
    model: string;
    color: string;
    plate: string;
    seats: number;
}
