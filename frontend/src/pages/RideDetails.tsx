import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../state/authStore';
import api from '../services/api';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { format } from 'date-fns';
import { Calendar, Clock, User, Car } from 'lucide-react';

export const RideDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [ride, setRide] = useState<any>(null);
    const [requests, setRequests] = useState<any[]>([]);
    const [seatsRequested, setSeatsRequested] = useState(1);
    const [loading, setLoading] = useState(false);
    const [requestStatus, setRequestStatus] = useState<string | null>(null);

    useEffect(() => {
        fetchRideDetails();
    }, [id]);

    useEffect(() => {
        if (ride && user && user.id === ride.driver_id) {
            fetchRequests();
        }
    }, [ride, user]);

    const fetchRideDetails = async () => {
        try {
            const response = await api.get(`/rides/${id}`);
            setRide(response.data);
        } catch (error) {
            console.error('Failed to fetch ride', error);
        }
    };

    const fetchRequests = async () => {
        try {
            const response = await api.get(`/rides/${id}/requests`);
            setRequests(response.data);
        } catch (error) {
            console.error('Failed to fetch requests', error);
        }
    };

    const handleRequestSeat = async () => {
        if (!user) return navigate('/login');
        setLoading(true);
        try {
            await api.post(`/rides/${id}/requests`, { seats_requested: seatsRequested });
            setRequestStatus('PENDING');
            alert('Request sent! You will be charged only if the driver accepts.');
        } catch (error) {
            console.error('Failed to request seat', error);
            alert('Failed to request seat.');
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (requestId: number) => {
        try {
            await api.post(`/rides/${id}/requests/${requestId}/accept`);
            fetchRequests();
            fetchRideDetails(); // Update seats available
            alert('Request accepted and payment processed!');
        } catch (error) {
            console.error('Failed to accept request', error);
            alert('Failed to accept request.');
        }
    };

    const handleReject = async (requestId: number) => {
        try {
            await api.post(`/rides/${id}/requests/${requestId}/reject`);
            fetchRequests();
        } catch (error) {
            console.error('Failed to reject request', error);
        }
    };

    if (!ride) return <div className="text-center py-10">Loading...</div>;

    const isDriver = user?.id === ride.driver_id;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                            {ride.origin} <span className="text-gray-400">→</span> {ride.destination}
                        </h1>
                        <div className="flex items-center gap-4 mt-2 text-gray-600">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {format(new Date(ride.departure_time), 'EEEE, MMM d, yyyy')}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {format(new Date(ride.departure_time), 'HH:mm')}
                            </span>
                            <span>• {ride.duration_minutes} mins</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">${ride.price_per_seat}</div>
                        <div className="text-gray-500">per seat</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-6">
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <User className="w-5 h-5" /> Driver
                        </h3>
                        <div className="flex items-center gap-3">
                            <img
                                src={ride.driver_photo || `https://ui-avatars.com/api/?name=${ride.driver_name}`}
                                alt={ride.driver_name}
                                className="w-12 h-12 rounded-full"
                            />
                            <div>
                                <div className="font-medium">{ride.driver_name}</div>
                                <div className="text-sm text-gray-500">Verified Driver</div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Car className="w-5 h-5" /> Vehicle
                        </h3>
                        {ride.car_info && (
                            <div className="text-gray-700">
                                <div>{ride.car_info.color} {ride.car_info.brand} {ride.car_info.model}</div>
                                <div className="text-sm text-gray-500">{ride.car_info.plate}</div>
                            </div>
                        )}
                    </div>
                </div>

                {ride.notes && (
                    <div className="mt-6 bg-gray-50 p-4 rounded-lg text-gray-700">
                        <h4 className="font-semibold mb-1">Notes</h4>
                        <p>{ride.notes}</p>
                    </div>
                )}
            </div>

            {!isDriver && (
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h2 className="text-xl font-bold mb-4">Book a Seat</h2>
                    {requestStatus === 'PENDING' ? (
                        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Request sent! Waiting for driver approval.
                        </div>
                    ) : (
                        <div className="flex items-end gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Number of seats</label>
                                <select
                                    className="w-full px-3 py-2 border rounded-lg"
                                    value={seatsRequested}
                                    onChange={(e) => setSeatsRequested(Number(e.target.value))}
                                >
                                    {[...Array(ride.seats_available)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex-1">
                                <div className="text-sm text-gray-500 mb-1">Total Price</div>
                                <div className="text-xl font-bold">${ride.price_per_seat * seatsRequested}</div>
                            </div>
                            <Button onClick={handleRequestSeat} disabled={loading || ride.seats_available === 0} className="flex-[2]">
                                {loading ? 'Sending Request...' : 'Request to Book'}
                            </Button>
                        </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2 text-center">
                        You will only be charged if the driver accepts your request.
                    </p>
                </div>
            )}

            {isDriver && (
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h2 className="text-xl font-bold mb-4">Passenger Requests</h2>
                    <div className="space-y-4">
                        {requests.map((req) => (
                            <div key={req.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={req.passenger_photo || `https://ui-avatars.com/api/?name=${req.passenger_name}`}
                                        alt={req.passenger_name}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div>
                                        <div className="font-medium">{req.passenger_name}</div>
                                        <div className="text-sm text-gray-500">{req.seats_requested} seats requested</div>
                                    </div>
                                </div>

                                {req.status === 'PENDING' ? (
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="danger" onClick={() => handleReject(req.id)}>Reject</Button>
                                        <Button size="sm" onClick={() => handleAccept(req.id)}>Accept & Charge</Button>
                                    </div>
                                ) : (
                                    <div className={`px-3 py-1 rounded-full text-sm font-medium
                    ${req.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {req.status}
                                    </div>
                                )}
                            </div>
                        ))}
                        {requests.length === 0 && <p className="text-gray-500">No requests yet.</p>}
                    </div>
                </div>
            )}
        </div>
    );
};
