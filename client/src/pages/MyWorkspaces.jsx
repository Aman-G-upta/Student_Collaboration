import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Copy, Plus, LogIn } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

const MyWorkspaces = () => {
    const { user } = useAuth();
    const [workspaces, setWorkspaces] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/workspace/my")
            .then(({ data }) => setWorkspaces(data.workspaces))
            .catch(() => toast.error("Failed to load workspaces"))
            .finally(() => setLoading(false));
    }, []);

    const copyCode = (code) => {
        navigator.clipboard.writeText(code);
        toast.success("Join code copied");
    };

    if (loading) return <Loader />;

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">My Workspaces</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {user.role === "faculty" ? "Workspaces you've created" : "Workspaces you've joined"}
                    </p>
                </div>

                {user.role === "faculty" ? (
                    <Link to="/workspace/create" className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition">
                        <Plus size={16} /> New Workspace
                    </Link>
                ) : (
                    <Link to="/workspace/join" className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition">
                        <LogIn size={16} /> Join Workspace
                    </Link>
                )}
            </div>

            {workspaces.length === 0 ? (
                <p className="text-sm text-gray-400 bg-white border border-dashed border-gray-200 rounded-xl p-10 text-center">
                    {user.role === "faculty" ? "You haven't created a workspace yet." : "You haven't joined a workspace yet."}
                </p>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {workspaces.map((ws) => (
                        <div key={ws._id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-card transition">
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
        </div>
    );
};

export default MyWorkspaces;