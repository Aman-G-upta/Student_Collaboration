import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Milestone as MilestoneIcon, Plus, Check, Trash2, Calendar } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const ProjectMilestones = ({ project }) => {
    const { user } = useAuth();
    const [milestones, setMilestones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: "", description: "", deadline: "" });
    const [busy, setBusy] = useState(false);

    const isGuide = project.guide && project.guide._id === user.id;

    const fetchMilestones = async () => {
        try {
            const { data } = await api.get(`/milestone/project/${project._id}`);
            setMilestones(data.milestones);
        } catch (error) {
            toast.error("Failed to load milestones");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMilestones();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [project._id]);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) return toast.error("Title is required");
        setBusy(true);

        try {
            await api.post(`/milestone/project/${project._id}`, form);
            toast.success("Milestone added");
            setForm({ title: "", description: "", deadline: "" });
            setShowForm(false);
            fetchMilestones();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setBusy(false);
        }
    };

    const toggleStatus = async (milestone) => {
        try {
            await api.patch(`/milestone/${milestone._id}/status`, {
                status: milestone.status === "completed" ? "pending" : "completed"
            });
            fetchMilestones();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this milestone?")) return;
        try {
            await api.delete(`/milestone/${id}`);
            toast.success("Milestone deleted");
            fetchMilestones();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    const completedCount = milestones.filter((m) => m.status === "completed").length;
    const progress = milestones.length ? Math.round((completedCount / milestones.length) * 100) : 0;

    if (loading) return null;

    return (
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                    <MilestoneIcon size={16} className="text-brand-600" /> Milestones
                    {milestones.length > 0 && (
                        <span className="text-xs font-normal text-gray-400">({completedCount}/{milestones.length} • {progress}%)</span>
                    )}
                </h2>

                {isGuide && (
                    <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700">
                        <Plus size={14} /> Add Milestone
                    </button>
                )}
            </div>

            {milestones.length > 0 && (
                <div className="w-full h-1.5 bg-gray-100 rounded-full mb-5 overflow-hidden">
                    <div className="h-full bg-brand-600 transition-all" style={{ width: `${progress}%` }} />
                </div>
            )}

            {showForm && (
                <form onSubmit={handleCreate} className="bg-gray-50 rounded-xl p-4 mb-4 space-y-3">
                    <input
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="Milestone title (e.g. SRS Submission)"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                    <textarea
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="Description (optional)"
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                    <div className="flex gap-3">
                        <input
                            type="date"
                            value={form.deadline}
                            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                        />
                        <button type="submit" disabled={busy} className="bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
                            {busy ? "Adding..." : "Add"}
                        </button>
                    </div>
                </form>
            )}

            {milestones.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">No milestones yet.</p>
            ) : (
                <div className="space-y-2">
                    {milestones.map((m) => (
                        <div key={m._id} className={`flex items-start gap-3 p-3 rounded-xl border transition ${m.status === "completed" ? "bg-green-50 border-green-100" : "bg-white border-gray-100"}`}>
                            <button
                                onClick={() => isGuide && toggleStatus(m)}
                                disabled={!isGuide}
                                className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
                                    m.status === "completed" ? "bg-green-500 border-green-500" : "border-gray-300"
                                } ${isGuide ? "cursor-pointer" : "cursor-default"}`}
                            >
                                {m.status === "completed" && <Check size={12} className="text-white" />}
                            </button>

                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium ${m.status === "completed" ? "text-green-800 line-through" : "text-gray-800"}`}>
                                    {m.title}
                                </p>
                                {m.description && <p className="text-xs text-gray-500 mt-0.5">{m.description}</p>}
                                {m.deadline && (
                                    <p className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                        <Calendar size={11} /> {new Date(m.deadline).toLocaleDateString()}
                                    </p>
                                )}
                            </div>

                            {isGuide && (
                                <button onClick={() => handleDelete(m._id)} className="text-gray-300 hover:text-red-500 transition shrink-0">
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectMilestones;