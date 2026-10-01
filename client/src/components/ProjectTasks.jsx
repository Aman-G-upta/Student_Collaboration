import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ListChecks, Plus, Trash2, Calendar } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const priorityStyles = {
    low: "bg-gray-100 text-gray-600",
    medium: "bg-amber-100 text-amber-700",
    high: "bg-red-100 text-red-700"
};

const statusOptions = ["pending", "in-progress", "completed"];

const statusStyles = {
    pending: "bg-gray-100 text-gray-600",
    "in-progress": "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700"
};

const ProjectTasks = ({ project }) => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: "", description: "", assignedTo: "", deadline: "", priority: "medium" });
    const [busy, setBusy] = useState(false);

    const isGuide = project.guide && project.guide._id === user.id;
    const acceptedMembers = project.members.filter((m) => m.status === "accepted");

    const fetchTasks = async () => {
        try {
            const { data } = await api.get(`/task/project/${project._id}`);
            setTasks(data.tasks);
        } catch (error) {
            toast.error("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [project._id]);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) return toast.error("Title is required");
        setBusy(true);

        try {
            await api.post(`/task/project/${project._id}`, form);
            toast.success("Task added");
            setForm({ title: "", description: "", assignedTo: "", deadline: "", priority: "medium" });
            setShowForm(false);
            fetchTasks();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setBusy(false);
        }
    };

    const handleStatusChange = async (task, status) => {
        try {
            await api.patch(`/task/${task._id}/status`, { status });
            fetchTasks();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this task?")) return;
        try {
            await api.delete(`/task/${id}`);
            toast.success("Task deleted");
            fetchTasks();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    const canUpdate = (task) => isGuide || task.assignedTo?._id === user.id;

    if (loading) return null;

    return (
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                    <ListChecks size={16} className="text-brand-600" /> Tasks
                </h2>

                {isGuide && (
                    <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700">
                        <Plus size={14} /> Add Task
                    </button>
                )}
            </div>

            {showForm && (
                <form onSubmit={handleCreate} className="bg-gray-50 rounded-xl p-4 mb-4 space-y-3">
                    <input
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="Task title (e.g. Complete database design)"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                    <textarea
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="Description (optional)"
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                    <div className="grid grid-cols-2 gap-3">
                        <select
                            value={form.assignedTo}
                            onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                            className="px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white focus:ring-2 focus:ring-brand-500 outline-none"
                        >
                            <option value="">Assign to...</option>
                            {acceptedMembers.map((m) => (
                                <option key={m.user._id} value={m.user._id}>{m.user.name}</option>
                            ))}
                        </select>
                        <select
                            value={form.priority}
                            onChange={(e) => setForm({ ...form, priority: e.target.value })}
                            className="px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white focus:ring-2 focus:ring-brand-500 outline-none"
                        >
                            <option value="low">Low Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="high">High Priority</option>
                        </select>
                    </div>
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

            {tasks.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">No tasks yet.</p>
            ) : (
                <div className="space-y-2">
                    {tasks.map((t) => (
                        <div key={t._id} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <p className="text-sm font-medium text-gray-800">{t.title}</p>
                                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${priorityStyles[t.priority]}`}>
                                        {t.priority}
                                    </span>
                                </div>
                                {t.description && <p className="text-xs text-gray-500 mt-0.5">{t.description}</p>}
                                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                                    {t.assignedTo && <p className="text-xs text-gray-400">Assigned: {t.assignedTo.name}</p>}
                                    {t.deadline && (
                                        <p className="flex items-center gap-1 text-xs text-gray-400">
                                            <Calendar size={11} /> {new Date(t.deadline).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                {canUpdate(t) ? (
                                    <select
                                        value={t.status}
                                        onChange={(e) => handleStatusChange(t, e.target.value)}
                                        className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border-0 capitalize cursor-pointer ${statusStyles[t.status]}`}
                                    >
                                        {statusOptions.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusStyles[t.status]}`}>
                                        {t.status}
                                    </span>
                                )}

                                {isGuide && (
                                    <button onClick={() => handleDelete(t._id)} className="text-gray-300 hover:text-red-500 transition">
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectTasks;