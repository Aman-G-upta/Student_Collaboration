const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const workspaceRoutes = require("./routes/workspaceRoutes");
const projectRoutes = require("./routes/projectRoutes");
dotenv.config();
const app = express();
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const milestoneRoutes = require("./routes/milestoneRoutes");
const taskRoutes = require("./routes/taskRoutes");
const workspaceMaterialRoutes = require("./routes/workspaceMaterialRoutes");
const documentRoutes = require("./routes/documentRoutes");


connectDB();

// Middleware
// app.use(cors());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/project", projectRoutes);
app.use("/api/workspace", workspaceRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/milestone", milestoneRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/material", workspaceMaterialRoutes);
app.use("/api/document", documentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});