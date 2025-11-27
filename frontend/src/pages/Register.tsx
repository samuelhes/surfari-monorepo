import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../state/authStore';
import api from '../services/api';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        phone: '',
        role: 'PASSENGER',
        car_brand: '',
        car_model: '',
        car_color: '',
        car_plate: '',
        car_seats: 4
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuthStore();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const payload: any = {
                email: formData.email,
                password: formData.password,
                full_name: formData.full_name,
                phone: formData.phone,
                role: formData.role
            };

            if (formData.role === 'DRIVER') {
                payload.car_info = {
                    brand: formData.car_brand,
                    model: formData.car_model,
                    color: formData.car_color,
                    plate: formData.car_plate,
                    seats: Number(formData.car_seats)
                };
            }

            const response = await api.post('/auth/register', payload);
            login(response.data.token, response.data.user);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Create Account</h2>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Full Name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">I want to be a</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 bg-white"
                        >
                            <option value="PASSENGER">Passenger</option>
                            <option value="DRIVER">Driver</option>
                        </select>
                    </div>

                    {formData.role === 'DRIVER' && (
                        <div className="space-y-4 border-t pt-4 mt-2">
                            <h3 className="font-medium text-gray-900">Car Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Brand" name="car_brand" value={formData.car_brand} onChange={handleChange} required />
                                <Input label="Model" name="car_model" value={formData.car_model} onChange={handleChange} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Color" name="car_color" value={formData.car_color} onChange={handleChange} required />
                                <Input label="Plate" name="car_plate" value={formData.car_plate} onChange={handleChange} required />
                            </div>
                            <Input label="Seats" type="number" name="car_seats" value={formData.car_seats} onChange={handleChange} required min="1" />
                        </div>
                    )}

                    <Button type="submit" fullWidth disabled={loading} className="mt-4">
                        {loading ? 'Creating Account...' : 'Register'}
                    </Button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 font-medium hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};
