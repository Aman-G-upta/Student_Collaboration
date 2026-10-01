import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";

const CreateWorkspace = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ title: "", description: "", department: "", year: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await api.post("/workspace/create", form);
            toast.success(`Workspace created — code: ${data.workspace.code}`);
            navigate(`/workspace/${data.workspace._id}`);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto px-4 py-10">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h1 className="text-xl font-bold text-gray-800 mb-1">Create a Workspace</h1>
                <p className="text-sm text-gray-500 mb-6">Students will join it with the generated code.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input name="title" required value={form.title} onChange={handleChange} placeholder="AI & ML Projects — BE IT 2026"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none transition" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea name="description" rows={3} value={form.description} onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none transition" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                            <input name="department" value={form.department} onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none transition" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                            <input type="number" name="year" value={form.year} onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none transition" />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition">
                        {loading ? "Creating..." : "Create Workspace"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateWorkspace;