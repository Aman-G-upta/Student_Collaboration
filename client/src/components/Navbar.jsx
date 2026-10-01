import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    if (!user) return null;

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    <Link to="/dashboard" className="flex items-center gap-2 font-bold text-brand-700 text-lg">
                        <LayoutDashboard size={22} />
                        Student Collaborator
                    </Link>

                    <div className="hidden md:flex items-center gap-6">
                        <span className="text-sm text-gray-500">
                            {user.name}{" "}
                            <span className="ml-1 px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 text-xs font-medium capitalize">
                                {user.role}
                            </span>
                        </span>
                        <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-red-600 transition">
                            <LogOut size={16} /> Logout
                        </button>
                    </div>

                    <button className="md:hidden" onClick={() => setOpen(!open)}>
                        {open ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {open && (
                    <div className="md:hidden pb-4 flex flex-col gap-3 border-t border-gray-100 pt-3">
                        <span className="text-sm text-gray-500">
                            {user.name}{" "}
                            <span className="ml-1 px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 text-xs font-medium capitalize">
                                {user.role}
                            </span>
                        </span>
                        <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm font-medium text-red-600">
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;