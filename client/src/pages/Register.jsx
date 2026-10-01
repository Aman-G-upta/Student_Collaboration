import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Register = () => {
    const { register, loading } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "", email: "", password: "", role: "student",
        studentId: "", department: "", year: ""
    });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await register(form);

        if (result.success) {
            toast.success("Account created — please log in");
            navigate("/login");
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-indigo-50 px-4 py-10">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-1">Create your account</h1>
                <p className="text-sm text-gray-500 mb-6">Join your college's project workspace</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input name="name" required value={form.name} onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none transition" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">College Email</label>
                        <input type="email" name="email" required value={form.email} onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none transition" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" name="password" required value={form.password} onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none transition" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">I am a</label>
                        <div className="grid grid-cols-2 gap-2">
                            {["student", "faculty"].map((r) => (
                                <button
                                    type="button" key={r}
                                    onClick={() => setForm({ ...form, role: r })}
                                    className={`py-2 rounded-lg text-sm font-medium border transition capitalize ${
                                        form.role === r
                                            ? "bg-brand-600 text-white border-brand-600"
                                            : "bg-white text-gray-600 border-gray-300 hover:border-brand-400"
                                    }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>

                    {form.role === "student" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                            <input name="studentId" value={form.studentId} onChange={handleChange} placeholder="23IT045"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none transition" />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                            <input name="department" value={form.department} onChange={handleChange} placeholder="IT"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none transition" />
                        </div>

                        {form.role === "student" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                <input type="number" name="year" value={form.year} onChange={handleChange} placeholder="3"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none transition" />
                            </div>
                        )}
                    </div>

                    <button
                        type="submit" disabled={loading}
                        className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition"
                    >
                        {loading ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                <p className="text-sm text-gray-500 mt-6 text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="text-brand-600 font-medium hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;