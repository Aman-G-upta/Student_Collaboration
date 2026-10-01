import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateWorkspace from "./pages/CreateWorkspace";
import JoinWorkspace from "./pages/JoinWorkspace";
import WorkspaceDetail from "./pages/WorkspaceDetail";
import CreateProject from "./pages/CreateProject";
import ProjectDetail from "./pages/ProjectDetail";
import Unauthorized from "./pages/Unauthorized";
import MyWorkspaces from "./pages/MyWorkspaces";
import MyProjects from "./pages/MyProjects";

const AppRoutes = () => {
    const { user } = useAuth();

    if (!user) {
        return (
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        );
    }

    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/login" element={<Navigate to="/dashboard" />} />
                <Route path="/register" element={<Navigate to="/dashboard" />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/workspace/create" element={<ProtectedRoute allowedRoles={["faculty"]}><CreateWorkspace /></ProtectedRoute>} />
                <Route path="/workspace/join" element={<ProtectedRoute allowedRoles={["student"]}><JoinWorkspace /></ProtectedRoute>} />
                <Route path="/workspace/:id" element={<ProtectedRoute><WorkspaceDetail /></ProtectedRoute>} />
                <Route path="/project/create" element={<ProtectedRoute allowedRoles={["student"]}><CreateProject /></ProtectedRoute>} />
                <Route path="/project/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />

                <Route path="/workspaces" element={<ProtectedRoute><MyWorkspaces /></ProtectedRoute>} />
                <Route path="/projects" element={<ProtectedRoute><MyProjects /></ProtectedRoute>} />

                <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
        </Layout>
    );
};

const App = () => (
    <AuthProvider>
        <Toaster position="top-right" />
        <AppRoutes />
    </AuthProvider>
);

export default App;