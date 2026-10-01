import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const { login, loading } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(form.email, form.password);

        if (result.success) {
            toast.success("Welcome back!");
            navigate("/dashboard");
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-indigo-50 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome back</h1>
                <p className="text-sm text-gray-500 mb-6">Log in to continue to your workspaces</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email" name="email" required value={form.email} onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
                            placeholder="you@college.edu"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password" name="password" required value={form.password} onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit" disabled={loading}
                        className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition"
                    >
                        {loading ? "Logging in..." : "Log In"}
                    </button>
                </form>

                <p className="text-sm text-gray-500 mt-6 text-center">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-brand-600 font-medium hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;