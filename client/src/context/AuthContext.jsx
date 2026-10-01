import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    });

    const [loading, setLoading] = useState(false);

    const login = async (email, password) => {
        setLoading(true);

        try {
            const { data } = await api.post("/auth/login", { email, password });

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Login failed"
            };
        } finally {
            setLoading(false);
        }
    };

    const register = async (payload) => {
        setLoading(true);

        try {
            await api.post("/auth/register", payload);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Registration failed"
            };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);