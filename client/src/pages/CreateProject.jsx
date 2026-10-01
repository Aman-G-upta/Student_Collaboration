import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";

const CreateProject = () => {
    const navigate = useNavigate();
    const [workspaces, setWorkspaces] = useState([]);
    const [form, setForm] = useState({
        workspaceId: "", title: "", description: "", domain: "", teamSize: 4, memberEmails: ""
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get("/workspace/my").then(({ data }) => setWorkspaces(data.workspaces));
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...form,
                teamSize: Number(form.teamSize),
                memberEmails: form.memberEmails.split(",").map((s) => s.trim()).filter(Boolean)
            };

            const { data } = await api.post("/project/create", payload);
            toast.success("Project created!");
            navigate(`/project/${data.project._id}`);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto px-4 py-10">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h1 className="text-xl font-bold text-gray-800 mb-1">Create a Project</h1>
                <p className="text-sm text-gray-500 mb-6">You'll be added as team leader automatically.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Workspace</label>
                        <select name="workspaceId" required value={form.workspaceId} onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none transition bg-white">
                            <option value="">Select a workspace</option>
                            {workspaces.map((ws) => (
                                <option key={ws._id} value={ws._id}>{ws.title}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                        <input name="title" required value={form.title} onChange={handleChange} placeholder="AI Career Advisor"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none transition" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea name="description" rows={3} value={form.description} onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none transition" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
                            <input name="domain" value={form.domain} onChange={handleChange} placeholder="Artificial Intelligence"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none transition" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
                            <input type="number" name="teamSize" value={form.teamSize} onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none transition" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Invite Teammates (emails, comma-separated)</label>
                        <input name="memberEmails" value={form.memberEmails} onChange={handleChange} placeholder="rahul@college.edu, priya@college.edu"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none transition" />
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition">
                        {loading ? "Creating..." : "Create Project"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateProject;