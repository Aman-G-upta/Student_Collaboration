import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";

const JoinWorkspace = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await api.post("/workspace/join", { code });
            toast.success("Joined workspace!");
            navigate(`/workspace/${data.workspace._id}`);
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid code");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto px-4 py-16">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
                <h1 className="text-xl font-bold text-gray-800 mb-1">Join a Workspace</h1>
                <p className="text-sm text-gray-500 mb-6">Enter the code shared by your faculty.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder="AIIT26X7" maxLength={10} required
                        className="w-full text-center tracking-widest font-semibold text-lg px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none transition uppercase"
                    />

                    <button type="submit" disabled={loading} className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition">
                        {loading ? "Joining..." : "Join Workspace"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default JoinWorkspace;