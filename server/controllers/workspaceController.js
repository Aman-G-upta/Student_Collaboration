const Workspace = require("../models/Workspace");
const generateCode = require("../utils/generateCode");
const Project = require("../models/Project");

// Faculty creates a workspace
const createWorkspace = async (req, res) => {
    try {
        const { title, description, department, year } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Title is required"
            });
        }

        // Ensure the generated code is unique
        let code;
        let existing = true;

        while (existing) {
            code = generateCode();
            existing = await Workspace.findOne({ code });
        }

        const workspace = await Workspace.create({
            title,
            description,
            department,
            year,
            code,
            faculty: req.user.userId
        });

        res.status(201).json({
            message: "Workspace created successfully",
            workspace
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// Student joins a workspace using a code
const joinWorkspace = async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({
                message: "Join code is required"
            });
        }

        const workspace = await Workspace.findOne({ code: code.toUpperCase() });

        if (!workspace) {
            return res.status(404).json({
                message: "Invalid join code"
            });
        }

        const alreadyJoined = workspace.students.includes(req.user.userId);

        if (alreadyJoined) {
            return res.status(400).json({
                message: "You have already joined this workspace"
            });
        }

        workspace.students.push(req.user.userId);
        await workspace.save();

        res.status(200).json({
            message: "Joined workspace successfully",
            workspace
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// Get workspaces relevant to the logged-in user
const getMyWorkspaces = async (req, res) => {
    try {
        let workspaces;

        if (req.user.role === "faculty") {
            workspaces = await Workspace.find({ faculty: req.user.userId })
                .populate("faculty", "name email")
                .populate("students", "name email studentId");
        } else {
            workspaces = await Workspace.find({ students: req.user.userId })
                .populate("faculty", "name email");
        }

        res.status(200).json({ workspaces });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// Get a single workspace by ID
const getWorkspaceById = async (req, res) => {
    try {
        const workspace = await Workspace.findById(req.params.id)
            .populate("faculty", "name email")
            .populate("students", "name email studentId department year");

        if (!workspace) {
            return res.status(404).json({
                message: "Workspace not found"
            });
        }

        res.status(200).json({ workspace });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};
// Faculty deletes their own workspace
const deleteWorkspace = async (req, res) => {
    try {
        const workspace = await Workspace.findById(req.params.id);

        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        if (workspace.faculty.toString() !== req.user.userId) {
            return res.status(403).json({ message: "You do not own this workspace" });
        }

        const projectCount = await Project.countDocuments({ workspace: workspace._id });

        if (projectCount > 0) {
            return res.status(400).json({
                message: `Cannot delete — ${projectCount} project(s) still exist in this workspace. Delete them first.`
            });
        }

        await workspace.deleteOne();

        res.status(200).json({ message: "Workspace deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    createWorkspace,
    joinWorkspace,
    getMyWorkspaces,
    getWorkspaceById,
    deleteWorkspace
};