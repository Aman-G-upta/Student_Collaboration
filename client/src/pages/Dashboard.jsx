import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
    Plus,
    LogIn,
    Users,
    FolderKanban,
    Mail,
    Copy,
    UserCheck
} from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

const Dashboard = () => {
    const { user } = useAuth();
    const [workspaces, setWorkspaces] = useState([]);
    const [projects, setProjects] = useState([]);
    const [invites, setInvites] = useState([]);
    const [guideRequests, setGuideRequests] = useState([]);
    const [loading, setLoading] = useState(true);



    const fetchData = async () => {
        setLoading(true);

        try {
            const requests = [api.get("/workspace/my"), api.get("/project/my")];
            if (user.role === "student") requests.push(api.get("/project/invites"));
            if (user.role === "faculty") requests.push(api.get("/project/guide-requests"));

            const responses = await Promise.all(requests);

            setWorkspaces(responses[0].data.workspaces);
            setProjects(responses[1].data.projects);

            if (user.role === "student") setInvites(responses[2].data.invites);
            if (user.role === "faculty") setGuideRequests(responses[2].data.requests);
        } catch (error) {
            toast.error("Failed to load dashboard");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const copyCode = (code) => {
        navigator.clipboard.writeText(code);
        toast.success("Join code copied");
    };

    if (loading) return <Loader />;

    return (

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.name.split(" ")[0]}</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {user.role === "faculty" ? "Manage your project workspaces" : "Track your workspaces, teams and invites"}
                    </p>
                </div>

                <div className="flex gap-3">
                    {user.role === "faculty" ? (
                        <Link to="/workspace/create" className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition">
                            <Plus size={16} /> New Workspace
                        </Link>
                    ) : (
                        <>
                            <Link to="/workspace/join" className="flex items-center gap-2 bg-white border border-gray-300 hover:border-brand-400 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-lg transition">
                                <LogIn size={16} /> Join Workspace
                            </Link>
                            <Link to="/project/create" className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition">
                                <Plus size={16} /> New Project
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {user.role === "faculty" && guideRequests.length > 0 && (
                <section className="mb-8">
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                        <UserCheck size={18} className="text-brand-600" /> Guide Requests
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {guideRequests.map((proj) => (
                            <Link key={proj._id} to={`/project/${proj._id}`} className="bg-amber-50 border border-amber-200 rounded-xl p-4 hover:shadow-md transition">
                                <p className="font-semibold text-gray-800">{proj.title}</p>
                                <p className="text-xs text-gray-500 mt-1">{proj.workspace?.title}</p>
                                <span className="inline-block mt-3 text-xs font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
                                    Requested by {proj.members?.find((m) => m.role === "leader")?.user?.name || "a student"}
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
            <section className="mb-8">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                    <Users size={18} className="text-brand-600" /> Workspaces
                </h2>

                {workspaces.length === 0 ? (
                    <p className="text-sm text-gray-400 bg-white border border-dashed border-gray-200 rounded-xl p-6 text-center">
                        {user.role === "faculty" ? "You haven't created a workspace yet." : "You haven't joined a workspace yet."}
                    </p>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {workspaces.map((ws) => (
                            <div key={ws._id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
                                <Link to={`/workspace/${ws._id}`}>
                                    <p className="font-semibold text-gray-800">{ws.title}</p>
                                    <p className="text-xs text-gray-500 mt-1">{ws.department} {ws.year ? `• Year ${ws.year}` : ""}</p>
                                </Link>

                                {user.role === "faculty" && (
                                    <button onClick={() => copyCode(ws.code)} className="flex items-center gap-1.5 mt-3 text-xs font-medium text-brand-700 bg-brand-50 px-2.5 py-1.5 rounded-full hover:bg-brand-100 transition">
                                        <Copy size={12} /> {ws.code}
                                    </button>
                                )}

                                <p className="text-xs text-gray-400 mt-2">{ws.students?.length || 0} student{ws.students?.length === 1 ? "" : "s"}</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                    <FolderKanban size={18} className="text-brand-600" /> My Projects
                </h2>

                {projects.length === 0 ? (
                    <p className="text-sm text-gray-400 bg-white border border-dashed border-gray-200 rounded-xl p-6 text-center">No projects yet.</p>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projects.map((proj) => (
                            <Link key={proj._id} to={`/project/${proj._id}`} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
                                <div className="flex items-start justify-between">
                                    <p className="font-semibold text-gray-800">{proj.title}</p>
                                    <span className="text-[10px] font-medium uppercase tracking-wide text-brand-700 bg-brand-50 px-2 py-1 rounded-full">
                                        {proj.status}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{proj.domain}</p>
                                <p className="text-xs text-gray-400 mt-2">{proj.members?.length || 0} members</p>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Dashboard;