import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, LayoutDashboard, Plus, LogIn, FolderPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import RoleGate from "./RoleGate";

const MobileTopbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    if (!user) return null;

    return (
        <div className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="flex items-center justify-between px-4 h-14">
                <Link to="/dashboard" className="flex items-center gap-2 font-bold text-brand-700">
                    <LayoutDashboard size={20} /> Student Collaborator
                </Link>
                <button onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button>
            </div>

            {open && (
                <div className="px-4 pb-4 flex flex-col gap-1 border-t border-gray-100 pt-3">
                    <Link to="/dashboard" onClick={() => setOpen(false)} className="text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-50">Dashboard</Link>

                    <RoleGate allow={["faculty"]}>
                        <Link to="/workspace/create" onClick={() => setOpen(false)} className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-50"><Plus size={15}/> Create Workspace</Link>
                    </RoleGate>
                    <RoleGate allow={["student"]}>
                        <Link to="/workspace/join" onClick={() => setOpen(false)} className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-50"><LogIn size={15}/> Join Workspace</Link>
                        <Link to="/project/create" onClick={() => setOpen(false)} className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-50"><FolderPlus size={15}/> Create Project</Link>
                    </RoleGate>

                    <button onClick={() => { logout(); navigate("/login"); }} className="flex items-center gap-2 text-sm font-medium text-red-600 px-3 py-2 mt-1 border-t border-gray-100 pt-3">
                        <LogOut size={15} /> Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default MobileTopbar;