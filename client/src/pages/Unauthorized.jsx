import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

const Unauthorized = () => (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <ShieldAlert size={28} className="text-red-500" />
        </div>
        <h1 className="text-xl font-bold text-gray-800">Access restricted</h1>
        <p className="text-sm text-gray-500 mt-2 max-w-sm">
            This page isn't available for your account role.
        </p>
        <Link to="/dashboard" className="mt-6 text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-lg transition">
            Back to Dashboard
        </Link>
    </div>
);

export default Unauthorized;