import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export const PublishRide = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        origin: '',
        destination: '',
        departure_time: '',
        seats_total: 3,
        price_per_seat: 0,
        duration_minutes: 60,
        notes: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/rides', formData);
            navigate('/');
        } catch (error) {
            console.error('Failed to publish ride', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-sm border">
            <h1 className="text-2xl font-bold mb-6">Publish a Ride</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="From"
                        value={formData.origin}
                        onChange={e => setFormData({ ...formData, origin: e.target.value })}
                        required
                    />
                    <Input
                        label="To"
                        value={formData.destination}
                        onChange={e => setFormData({ ...formData, destination: e.target.value })}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Departure Time"
                        type="datetime-local"
                        value={formData.departure_time}
                        onChange={e => setFormData({ ...formData, departure_time: e.target.value })}
                        required
                    />
                    <Input
                        label="Est. Duration (minutes)"
                        type="number"
                        value={formData.duration_minutes}
                        onChange={e => setFormData({ ...formData, duration_minutes: Number(e.target.value) })}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Available Seats"
                        type="number"
                        min="1"
                        max="8"
                        value={formData.seats_total}
                        onChange={e => setFormData({ ...formData, seats_total: Number(e.target.value) })}
                        required
                    />
                    <Input
                        label="Price per Seat ($)"
                        type="number"
                        min="0"
                        value={formData.price_per_seat}
                        onChange={e => setFormData({ ...formData, price_per_seat: Number(e.target.value) })}
                        required
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Notes</label>
                    <textarea
                        className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                        rows={3}
                        value={formData.notes}
                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Meeting point, luggage info, etc."
                    />
                </div>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="secondary" onClick={() => navigate('/')}>Cancel</Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Publishing...' : 'Publish Ride'}
                    </Button>
                </div>
            </form>
        </div>
    );
};
