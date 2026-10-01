import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Mail } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

const MyProjects = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [invites, setInvites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const requests = [api.get("/project/my")];
        if (user.role === "student") requests.push(api.get("/project/invites"));

        Promise.all(requests)
            .then((responses) => {
                setProjects(responses[0].data.projects);
                if (user.role === "student") setInvites(responses[1].data.invites);
            })
            .catch(() => toast.error("Failed to load projects"))
            .finally(() => setLoading(false));
    }, [user.role]);

    if (loading) return <Loader />;

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">My Projects</h1>
                    <p className="text-sm text-gray-500 mt-1">Every team you're part of</p>
                </div>

                {user.role === "student" && (
                    <Link to="/project/create" className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition">
                        <Plus size={16} /> New Project
                    </Link>
                )}
            </div>

            {invites.length > 0 && (
                <section className="mb-8">
                    <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-3">
                        <Mail size={16} className="text-brand-600" /> Pending Invites
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {invites.map((inv) => (
                            <Link key={inv._id} to={`/project/${inv._id}`} className="bg-amber-50 border border-amber-200 rounded-xl p-4 hover:shadow-md transition">
                                <p className="font-semibold text-gray-800">{inv.title}</p>
                                <p className="text-xs text-gray-500 mt-1">{inv.workspace?.title}</p>
                                <span className="inline-block mt-3 text-xs font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
                                    Awaiting your response
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {projects.length === 0 ? (
                <p className="text-sm text-gray-400 bg-white border border-dashed border-gray-200 rounded-xl p-10 text-center">No projects yet.</p>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((proj) => (
                        <Link key={proj._id} to={`/project/${proj._id}`} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-card transition">
                            <div className="flex items-start justify-between">
                                <p className="font-semibold text-gray-800">{proj.title}</p>
                                <span className="text-[10px] font-medium uppercase tracking-wide text-brand-700 bg-brand-50 px-2 py-1 rounded-full">
                                    {proj.status}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{proj.domain}</p>
                            <p className="text-xs text-gray-400 mt-2">{proj.members?.length || 0} members</p>
                            {proj.guide && <p className="text-xs text-gray-400 mt-1">Guide: {proj.guide.name}</p>}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyProjects;