import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    LayoutDashboard, Plus, LogIn, FolderPlus, Users, FolderKanban,
    LogOut, GraduationCap, Briefcase, PanelLeftClose, PanelLeft
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import RoleGate from "./RoleGate";

const NavItem = ({ to, icon: Icon, label, collapsed }) => {
    const location = useLocation();
    const active = location.pathname === to;

    return (
        <Link
            to={to}
            title={collapsed ? label : undefined}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                active ? "bg-brand-600 text-white shadow-card" : "text-gray-600 hover:bg-brand-50 hover:text-brand-700"
            } ${collapsed ? "justify-center px-0" : ""}`}
        >
            <Icon size={18} className="shrink-0" />
            {!collapsed && label}
        </Link>
    );
};

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(() => localStorage.getItem("sidebarCollapsed") === "true");

    useEffect(() => {
        localStorage.setItem("sidebarCollapsed", collapsed);
    }, [collapsed]);

    if (!user) return null;

    return (
        <aside className={`hidden md:flex flex-col shrink-0 h-screen sticky top-0 border-r border-gray-100 bg-white py-6 transition-all duration-200 ${collapsed ? "w-20 px-2" : "w-64 px-4"}`}>
            <div className={`flex items-center mb-8 ${collapsed ? "justify-center" : "justify-between px-2"}`}>
                {!collapsed && (
                    <div className="flex items-center gap-2 font-bold text-brand-700 text-lg">
                        <LayoutDashboard size={22} />
                        Student Collaborator
                    </div>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="text-gray-400 hover:text-brand-600 hover:bg-brand-50 p-1.5 rounded-lg transition"
                    title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
                </button>
            </div>

            <nav className="flex flex-col gap-1 flex-1">
                <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" collapsed={collapsed} />
                <NavItem to="/workspaces" icon={Users} label="My Workspaces" collapsed={collapsed} />
                <NavItem to="/projects" icon={FolderKanban} label="My Projects" collapsed={collapsed} />

                <RoleGate allow={["faculty"]}>
                    {!collapsed && <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mt-4 mb-1 px-3">Faculty</p>}
                    <NavItem to="/workspace/create" icon={Plus} label="Create Workspace" collapsed={collapsed} />
                </RoleGate>

                <RoleGate allow={["student"]}>
                    {!collapsed && <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mt-4 mb-1 px-3">Student</p>}
                    <NavItem to="/workspace/join" icon={LogIn} label="Join Workspace" collapsed={collapsed} />
                    <NavItem to="/project/create" icon={FolderPlus} label="Create Project" collapsed={collapsed} />
                </RoleGate>
            </nav>

            <div className="mt-auto pt-4 border-t border-gray-100">
                <div className={`flex items-center gap-3 mb-3 ${collapsed ? "justify-center" : "px-2"}`}>
                    <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
                        {user.role === "faculty" ? <Briefcase size={16} /> : <GraduationCap size={16} />}
                    </div>
                    {!collapsed && (
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                            <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                        </div>
                    )}
                </div>
                <button
                    onClick={() => { logout(); navigate("/login"); }}
                    title={collapsed ? "Logout" : undefined}
                    className="w-full flex items-center justify-center gap-2 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition"
                >
                    <LogOut size={16} /> {!collapsed && "Logout"}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;