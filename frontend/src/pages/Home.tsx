import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../state/authStore';
import api from '../services/api';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Calendar } from '../components/Calendar';
import { Search, Plus, Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export const Home = () => {
    const { user } = useAuthStore();
    const [rides, setRides] = useState<any[]>([]);
    const [allRides, setAllRides] = useState<any[]>([]); // For calendar dots
    const [myTrips, setMyTrips] = useState<{ asPassenger: any[], asDriver: any[] }>({ asPassenger: [], asDriver: [] });
    const [search, setSearch] = useState({ origin: '', destination: '', date: '' });
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [activeTab, setActiveTab] = useState<'search' | 'trips'>('search');

    useEffect(() => {
        fetchRides();
        fetchAllRides(); // Fetch all to populate calendar
        if (user) fetchMyTrips();
    }, [user]);

    const fetchAllRides = async () => {
        try {
            const response = await api.get('/rides');
            setAllRides(response.data);
        } catch (error) {
            console.error('Failed to fetch all rides', error);
        }
    };

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        setSearch({ ...search, date: format(date, 'yyyy-MM-dd') });
        // Trigger search immediately when date is selected
        // We need to use the new date value, state update is async
        const newDate = format(date, 'yyyy-MM-dd');
        fetchRides(newDate);
    };

    const fetchRides = async (dateOverride?: string) => {
        try {
            const params = new URLSearchParams();
            if (search.origin) params.append('origin', search.origin);
            if (search.destination) params.append('destination', search.destination);

            const dateToUse = dateOverride !== undefined ? dateOverride : search.date;
            if (dateToUse) params.append('date', dateToUse);

            const response = await api.get(`/rides?${params.toString()}`);
            setRides(response.data);
        } catch (error) {
            console.error('Failed to fetch rides', error);
        }
    };

    const fetchMyTrips = async () => {
        try {
            const response = await api.get('/users/me/trips');
            setMyTrips(response.data);
        } catch (error) {
            console.error('Failed to fetch my trips', error);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchRides();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                    {activeTab === 'search' ? 'Find a Ride' : 'My Trips'}
                </h1>
                <div className="flex gap-2">
                    <Button
                        variant={activeTab === 'search' ? 'primary' : 'secondary'}
                        onClick={() => setActiveTab('search')}
                    >
                        Search
                    </Button>
                    {user && (
                        <Button
                            variant={activeTab === 'trips' ? 'primary' : 'secondary'}
                            onClick={() => setActiveTab('trips')}
                        >
                            My Trips
                        </Button>
                    )}
                </div>
            </div>

            {activeTab === 'search' && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Search Form */}
                        <div className="md:col-span-2 space-y-4">
                            <div className="bg-white p-4 rounded-xl shadow-sm border">
                                <form onSubmit={handleSearch} className="grid grid-cols-1 gap-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="From"
                                            placeholder="City..."
                                            value={search.origin}
                                            onChange={(e) => setSearch({ ...search, origin: e.target.value })}
                                        />
                                        <Input
                                            label="To"
                                            placeholder="City..."
                                            value={search.destination}
                                            onChange={(e) => setSearch({ ...search, destination: e.target.value })}
                                        />
                                    </div>
                                    <Button type="submit" className="flex items-center justify-center gap-2">
                                        <Search className="w-4 h-4" /> Search
                                    </Button>
                                </form>
                            </div>

                            {user?.role === 'DRIVER' && (
                                <div className="flex justify-end">
                                    <Link to="/publish">
                                        <Button className="flex items-center gap-2">
                                            <Plus className="w-4 h-4" /> Publish a Ride
                                        </Button>
                                    </Link>
                                </div>
                            )}

                            <div className="grid gap-4">
                                {rides.map((ride) => (
                                    <Link to={`/rides/${ride.id}`} key={ride.id} className="block group">
                                        <div className="bg-white p-4 rounded-xl shadow-sm border hover:border-blue-500 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                                                        <span>{ride.origin}</span>
                                                        <span className="text-gray-400">→</span>
                                                        <span>{ride.destination}</span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <CalendarIcon className="w-4 h-4" />
                                                            {format(new Date(ride.departure_time), 'MMM d, yyyy')}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            {format(new Date(ride.departure_time), 'HH:mm')}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <img
                                                            src={ride.driver_photo || `https://ui-avatars.com/api/?name=${ride.driver_name}`}
                                                            alt={ride.driver_name}
                                                            className="w-6 h-6 rounded-full"
                                                        />
                                                        <span>{ride.driver_name}</span>
                                                        <span className="text-gray-300">•</span>
                                                        <span>{ride.car_info?.brand} {ride.car_info?.model}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xl font-bold text-blue-600">${ride.price_per_seat}</div>
                                                    <div className="text-sm text-gray-500">{ride.seats_available} seats left</div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                                {rides.length === 0 && (
                                    <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-dashed">
                                        No rides found for this date.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Calendar Sidebar */}
                        <div className="md:col-span-1">
                            <Calendar
                                events={allRides.map(r => parseISO(r.departure_time))}
                                selectedDate={selectedDate}
                                onDateSelect={handleDateSelect}
                                className="sticky top-24"
                            />
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'trips' && user && (
                <div className="space-y-8">
                    {user.role === 'DRIVER' && (
                        <section>
                            <h3 className="text-lg font-semibold mb-4">Rides I'm Driving</h3>
                            <div className="grid gap-4">
                                {myTrips.asDriver.map((ride) => (
                                    <div key={ride.id} className="bg-white p-4 rounded-xl shadow-sm border">
                                        <div className="flex justify-between">
                                            <div>
                                                <div className="font-semibold">{ride.origin} → {ride.destination}</div>
                                                <div className="text-sm text-gray-500">{format(new Date(ride.departure_time), 'MMM d, HH:mm')}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-sm font-medium ${ride.status === 'PUBLISHED' ? 'text-green-600' : 'text-gray-500'}`}>
                                                    {ride.status}
                                                </div>
                                                <div className="text-sm text-gray-500">{ride.seats_available} seats open</div>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-4 border-t flex justify-end">
                                            <Link to={`/rides/${ride.id}`}>
                                                <Button variant="outline" className="text-sm py-1">Manage</Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                                {myTrips.asDriver.length === 0 && <p className="text-gray-500">No published rides.</p>}
                            </div>
                        </section>
                    )}

                    <section>
                        <h3 className="text-lg font-semibold mb-4">My Bookings</h3>
                        <div className="grid gap-4">
                            {myTrips.asPassenger.map((req) => (
                                <div key={req.id} className="bg-white p-4 rounded-xl shadow-sm border">
                                    <div className="flex justify-between">
                                        <div>
                                            <div className="font-semibold">{req.origin} → {req.destination}</div>
                                            <div className="text-sm text-gray-500">{format(new Date(req.departure_time), 'MMM d, HH:mm')}</div>
                                            <div className="text-sm text-gray-600 mt-1">Driver: {req.driver_name}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-sm font-bold px-2 py-1 rounded-full inline-block
                        ${req.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                                                    req.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'}`}>
                                                {req.status}
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1">{req.seats_requested} seats</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {myTrips.asPassenger.length === 0 && <p className="text-gray-500">No bookings yet.</p>}
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
};
