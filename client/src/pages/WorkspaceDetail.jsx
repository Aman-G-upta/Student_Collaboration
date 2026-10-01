import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Copy, Users, FolderKanban } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import { useNavigate, Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import WorkspaceMaterials from "../components/WorkspaceMaterials";

const WorkspaceDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [workspace, setWorkspace] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await api.get(`/workspace/${id}`);
                setWorkspace(data.workspace);

                if (user.role === "faculty") {
                    const projRes = await api.get(`/project/workspace/${id}`);
                    setProjects(projRes.data.projects);
                }
            } catch (error) {
                toast.error("Failed to load workspace");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, user.role]);

    const copyCode = () => {
        navigator.clipboard.writeText(workspace.code);
        toast.success("Code copied");
    };

    const handleDeleteWorkspace = async () => {
        if (!window.confirm("Delete this workspace? This can't be undone.")) return;
        try {
            await api.delete(`/workspace/${id}`);
            toast.success("Workspace deleted");
            navigate("/workspaces");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete workspace");
        }
    };

    if (loading) return <Loader />;
    if (!workspace) return null;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">{workspace.title}</h1>
                        <p className="text-sm text-gray-500 mt-1">{workspace.description}</p>
                        <p className="text-xs text-gray-400 mt-2">
                            {workspace.department} {workspace.year ? `• Year ${workspace.year}` : ""} • Faculty: {workspace.faculty?.name}
                        </p>
                    </div>

                    {user.role === "faculty" && (
                        <button onClick={copyCode} className="flex items-center gap-2 bg-brand-50 text-brand-700 font-semibold px-4 py-2 rounded-lg hover:bg-brand-100 transition shrink-0">
                            <Copy size={14} /> {workspace.code}
                        </button>
                    )}
                    {user.role === "faculty" && (
                        <button onClick={handleDeleteWorkspace} className="flex items-center gap-1.5 text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg text-xs font-medium transition">
                            <Trash2 size={13} /> Delete
                        </button>
                    )}
                </div>
            </div>
            <WorkspaceMaterials workspace={workspace} />

            {user.role === "faculty" && (
                <>
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                        <Users size={18} className="text-brand-600" /> Students ({workspace.students?.length || 0})
                    </h2>
                    <div className="bg-white rounded-xl border border-gray-200 divide-y mb-8">
                        {workspace.students?.length ? (
                            workspace.students.map((s) => (
                                <div key={s._id} className="px-4 py-3 flex items-center justify-between text-sm">
                                    <span className="font-medium text-gray-700">{s.name}</span>
                                    <span className="text-gray-400">{s.email}</span>
                                </div>
                            ))
                        ) : (
                            <p className="px-4 py-6 text-sm text-gray-400 text-center">No students have joined yet.</p>
                        )}
                    </div>

                    <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                        <FolderKanban size={18} className="text-brand-600" /> Projects in this workspace
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {projects.length ? (
                            projects.map((p) => (
                                <Link key={p._id} to={`/project/${p._id}`} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-card transition block">
                                    <div className="flex items-start justify-between">
                                        <p className="font-semibold text-gray-800">{p.title}</p>
                                        <span className="text-[10px] font-medium uppercase tracking-wide text-brand-700 bg-brand-50 px-2 py-1 rounded-full">
                                            {p.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">{p.members?.length || 0} members</p>
                                    {p.guide && <p className="text-xs text-gray-400 mt-1">Guide: {p.guide.name}</p>}
                                </Link>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 bg-white border border-dashed border-gray-200 rounded-xl p-6 text-center col-span-2">
                                No projects created yet.
                            </p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default WorkspaceDetail;