import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Crown, Check, X, UserCheck, Clock } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import { useNavigate, Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import ProjectMilestones from "../components/ProjectMilestones";
import ProjectTasks from "../components/ProjectTasks";
import ProjectDocuments from "../components/ProjectDocuments";

const statusStyles = {
    accepted: "bg-green-100 text-green-700",
    pending: "bg-amber-100 text-amber-700",
    rejected: "bg-red-100 text-red-700"
};

const ProjectDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [project, setProject] = useState(null);
    const [facultyList, setFacultyList] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState("");
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const navigate = useNavigate();


    const fetchProject = async () => {
        try {
            const { data } = await api.get(`/project/${id}`);
            setProject(data.project);
        } catch (error) {
            toast.error("Failed to load project");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProject();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        if (user.role === "student") {
            api.get("/user/faculty").then(({ data }) => setFacultyList(data.faculty));
        }
    }, [user.role]);

    const myMembership = project?.members.find((m) => m.user._id === user.id);
    const isLeader = myMembership?.role === "leader";

    const respond = async (action) => {
        setBusy(true);
        try {
            await api.post(`/project/${id}/respond`, { action });
            toast.success(`Invite ${action}ed`);
            fetchProject();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setBusy(false);
        }
    };

    const sendGuideRequest = async () => {
        if (!selectedFaculty) return toast.error("Select a faculty member first");
        setBusy(true);
        try {
            await api.post(`/project/${id}/request-guide`, { facultyId: selectedFaculty });
            toast.success("Guide request sent");
            fetchProject();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setBusy(false);
        }
    };

    const respondGuideRequest = async (action) => {
        setBusy(true);
        try {
            await api.post(`/project/${id}/guide-request/respond`, { action });
            toast.success(`Guide request ${action}ed`);
            fetchProject();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setBusy(false);
        }
    };

    const handleDeleteProject = async () => {
        if (!window.confirm("Delete this project? This can't be undone.")) return;
        try {
            await api.delete(`/project/${id}`);
            toast.success("Project deleted");
            navigate("/projects");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete project");
        }
    };

    if (loading) return <Loader />;
    if (!project) return null;

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 sm:p-8 mb-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">{project.title}</h1>
                        <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                        <p className="text-xs text-gray-400 mt-2">{project.domain} • {project.workspace?.title}</p>
                    </div>
                    <span className="text-xs font-medium uppercase tracking-wide text-brand-700 bg-brand-50 px-3 py-1.5 rounded-full shrink-0">
                        {project.status}
                    </span>

                    {isLeader && (
                        <button onClick={handleDeleteProject} className="flex items-center gap-1.5 text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg text-xs font-medium transition shrink-0">
                            <Trash2 size={13} /> Delete
                        </button>
                    )}
                </div>

                {myMembership?.status === "pending" && (
                    <div className="mt-6 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <p className="text-sm text-amber-800 flex-1">You've been invited to this team.</p>
                        <button onClick={() => respond("accept")} disabled={busy} className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition">
                            <Check size={14} /> Accept
                        </button>
                        <button onClick={() => respond("reject")} disabled={busy} className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition">
                            <X size={14} /> Reject
                        </button>
                    </div>
                )}
            </div>

            {/* Guide section */}
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 mb-6">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-4">
                    <UserCheck size={16} className="text-brand-600" /> Project Guide
                </h2>

                {project.guide ? (
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-semibold">
                            {project.guide.name?.[0]}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-800">{project.guide.name}</p>
                            <p className="text-xs text-gray-400">{project.guide.email}</p>
                        </div>
                        <span className="ml-auto text-xs font-medium text-green-700 bg-green-100 px-2.5 py-1 rounded-full">Assigned</span>
                    </div>


                ) : project.guideRequest ? (
                    <div className="flex items-center gap-3 flex-wrap">
                        <Clock size={16} className="text-amber-500" />

                        {user.role === "faculty" ? (
                            <p className="text-sm text-gray-600">
                                Requested by <span className="font-medium text-gray-800">
                                    {project.members.find((m) => m.role === "leader")?.user?.name}
                                </span>{" "}
                                <span className={`ml-1 text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusStyles[project.guideRequest.status]}`}>
                                    {project.guideRequest.status}
                                </span>
                            </p>
                        ) : (
                            <p className="text-sm text-gray-600">
                                Request sent to <span className="font-medium text-gray-800">{project.guideRequest.faculty?.name}</span>{" "}
                                <span className={`ml-1 text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusStyles[project.guideRequest.status]}`}>
                                    {project.guideRequest.status}
                                </span>
                            </p>
                        )}

                        {user.role === "faculty" && project.guideRequest.status === "pending" && project.guideRequest.faculty?._id === user.id && (
                            <div className="flex gap-2 ml-auto">
                                <button onClick={() => respondGuideRequest("accept")} disabled={busy} className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition">
                                    <Check size={13} /> Accept
                                </button>
                                <button onClick={() => respondGuideRequest("reject")} disabled={busy} className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition">
                                    <X size={13} /> Reject
                                </button>
                            </div>
                        )}
                    </div>
                ) : isLeader ? (
                    <div className="flex flex-col sm:flex-row gap-3">
                        <select
                            value={selectedFaculty}
                            onChange={(e) => setSelectedFaculty(e.target.value)}
                            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none transition bg-white text-sm"
                        >
                            <option value="">Select a faculty member</option>
                            {facultyList.map((f) => (
                                <option key={f._id} value={f._id}>{f.name} — {f.department}</option>
                            ))}
                        </select>
                        <button onClick={sendGuideRequest} disabled={busy} className="bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition shrink-0">
                            Request Guide
                        </button>
                    </div>
                ) : (
                    <p className="text-sm text-gray-400">No guide assigned yet — the team leader can request one.</p>
                )}
            </div>

            {project.guide && (
                <>
                    <ProjectMilestones project={project} />
                    <ProjectTasks project={project} />

                </>
            )}
            <ProjectDocuments project={project} />
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Team Members</h2>
            <div className="bg-white rounded-xl border border-gray-200 divide-y">
                {project.members.map((m) => (
                    <div key={m.user._id} className="px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {m.role === "leader" && <Crown size={14} className="text-amber-500" />}
                            <span className="text-sm font-medium text-gray-700">{m.user.name}</span>
                            <span className="text-xs text-gray-400">{m.user.email}</span>
                        </div>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusStyles[m.status]}`}>
                            {m.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>

    );
};

export default ProjectDetail;