import { Outlet, Link } from 'react-router-dom';
import { useAuthStore } from '../state/authStore';
import { LogOut, Car, User as UserIcon } from 'lucide-react';

export const Layout = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                        <Car className="w-8 h-8" />
                        Surfari
                    </Link>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <div className="flex items-center gap-2">
                                    {user.profile_photo ? (
                                        <img src={user.profile_photo} alt={user.full_name} className="w-8 h-8 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                            <UserIcon className="w-5 h-5 text-gray-500" />
                                        </div>
                                    )}
                                    <span className="hidden sm:block font-medium text-gray-700">{user.full_name}</span>
                                </div>
                                <button onClick={handleLogout} className="text-gray-500 hover:text-red-500">
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="text-blue-600 font-medium hover:underline">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6">
                <Outlet />
            </main>

            <footer className="bg-white border-t py-6 text-center text-gray-500 text-sm">
                <p>© 2023 Surfari Ride Sharing. Built with Antigravity.</p>
            </footer>
        </div>
    );
};
