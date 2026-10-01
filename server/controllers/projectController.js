const mongoose = require("mongoose");
const Project = require("../models/Project");
const Workspace = require("../models/Workspace");
const User = require("../models/User");

// Student creates a project and invites teammates by email
const createProject = async (req, res) => {
    try {
        const { workspaceId, title, description, domain, teamSize, memberEmails } = req.body || {};

        if (!workspaceId || !title) {
            return res.status(400).json({ message: "Workspace and title are required" });
        }

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        const isMember = workspace.students.includes(req.user.userId);
        if (!isMember) {
            return res.status(403).json({ message: "You must join this workspace before creating a project" });
        }

        let invitedMembers = [];
        if (Array.isArray(memberEmails) && memberEmails.length > 0) {
            const invitedUsers = await User.find({ email: { $in: memberEmails } });
            invitedMembers = invitedUsers
                .filter((u) => u._id.toString() !== req.user.userId)
                .map((u) => ({ user: u._id, role: "member", status: "pending" }));
        }

        const project = await Project.create({
            title,
            description,
            domain,
            teamSize: teamSize || 4,
            workspace: workspaceId,
            members: [
                { user: req.user.userId, role: "leader", status: "accepted" },
                ...invitedMembers
            ]
        });

        res.status(201).json({ message: "Project created successfully", project });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Invited student accepts or rejects
const respondToInvite = async (req, res) => {
    try {
        const { action } = req.body || {};
        if (!["accept", "reject"].includes(action)) {
            return res.status(400).json({ message: "Action must be 'accept' or 'reject'" });
        }

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const member = project.members.find((m) => m.user.toString() === req.user.userId);
        if (!member) {
            return res.status(404).json({ message: "You were not invited to this project" });
        }

        member.status = action === "accept" ? "accepted" : "rejected";
        await project.save();

        if (action === "accept") {
            await Workspace.findByIdAndUpdate(project.workspace, {
                $addToSet: { students: req.user.userId }
            });
        }

        res.status(200).json({ message: `Invite ${action}ed successfully`, project });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Projects the logged-in user belongs to
const getMyProjects = async (req, res) => {
    try {
        let projects;

        if (req.user.role === "faculty") {
            // Faculty sees projects they're already guiding
            projects = await Project.find({ guide: req.user.userId })
                .populate("members.user", "name email studentId")
                .populate("guide", "name email")
                .populate("guideRequest.faculty", "name email department")
                .populate("workspace", "title code");
        } else {
            projects = await Project.find({ "members.user": req.user.userId })
                .populate("members.user", "name email studentId")
                .populate("guide", "name email")
                .populate("guideRequest.faculty", "name email department")
                .populate("workspace", "title code");
        }

        res.status(200).json({ projects });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Pending invites for the logged-in user
const getMyInvites = async (req, res) => {
    try {
        const projects = await Project.find({
            members: { $elemMatch: { user: req.user.userId, status: "pending" } }
        }).populate("workspace", "title");

        res.status(200).json({ invites: projects });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Single project detail — the one that was missing populates
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate("members.user", "name email studentId department year")
            .populate("guide", "name email")
            .populate("guideRequest.faculty", "name email department")
            .populate("workspace", "title code faculty");

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json({ project });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Faculty views all projects inside a workspace they own
const getWorkspaceProjects = async (req, res) => {
    try {
        const workspace = await Workspace.findById(req.params.workspaceId);
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        if (workspace.faculty.toString() !== req.user.userId) {
            return res.status(403).json({ message: "You do not own this workspace" });
        }

        const projects = await Project.find({ workspace: req.params.workspaceId })
            .populate("members.user", "name email studentId")
            .populate("guide", "name email");

        res.status(200).json({ projects });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Student (leader) requests a faculty guide
const requestGuide = async (req, res) => {
    try {
        const { facultyId } = req.body || {};
        if (!facultyId) {
            return res.status(400).json({ message: "Faculty ID is required" });
        }

        const faculty = await User.findOne({ _id: facultyId, role: "faculty" });
        if (!faculty) {
            return res.status(404).json({ message: "Faculty member not found" });
        }

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const isLeader = project.members.find(
            (m) => m.user.toString() === req.user.userId && m.role === "leader"
        );
        if (!isLeader) {
            return res.status(403).json({ message: "Only the team leader can request a guide" });
        }

        if (project.guide) {
            return res.status(400).json({ message: "This project already has a guide" });
        }

        project.guideRequest = { faculty: facultyId, status: "pending" };
        await project.save();

        const updated = await Project.findById(project._id)
            .populate("guideRequest.faculty", "name email department")
            .populate("members.user", "name email studentId")
            .populate("workspace", "title code");

        res.status(201).json({ message: "Guide request sent", project: updated });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Faculty accepts or rejects a guide request
const respondToGuideRequest = async (req, res) => {
    try {
        const { action } = req.body || {};
        if (!["accept", "reject"].includes(action)) {
            return res.status(400).json({ message: "Action must be 'accept' or 'reject'" });
        }

        const project = await Project.findById(req.params.id);
        if (!project || !project.guideRequest || !project.guideRequest.faculty) {
            return res.status(404).json({ message: "No guide request found for this project" });
        }

        if (project.guideRequest.faculty.toString() !== req.user.userId.toString()) {
            return res.status(403).json({ message: "This request was not sent to you" });
        }

        project.guideRequest.status = action === "accept" ? "accepted" : "rejected";
        project.guideRequest.respondedAt = new Date();

        if (action === "accept") {
            project.guide = req.user.userId;
            project.status = "active";
        }

        await project.save();

        const updated = await Project.findById(project._id)
            .populate("guide", "name email")
            .populate("guideRequest.faculty", "name email department")
            .populate("members.user", "name email studentId")
            .populate("workspace", "title code");

        res.status(200).json({ message: `Guide request ${action}ed`, project: updated });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Faculty: all pending guide requests sent to them
const getMyGuideRequests = async (req, res) => {
    try {
        const facultyObjectId = new mongoose.Types.ObjectId(req.user.userId);

        const projects = await Project.find({
            "guideRequest.faculty": facultyObjectId,
            "guideRequest.status": "pending"
        })
            .populate("members.user", "name email")
            .populate("workspace", "title")
            .populate("guideRequest.faculty", "name email");

        res.status(200).json({ requests: projects });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const isLeader = project.members.find(
            (m) => m.user.toString() === req.user.userId && m.role === "leader"
        );

        if (!isLeader) {
            return res.status(403).json({ message: "Only the team leader can delete this project" });
        }

        await project.deleteOne();

        res.status(200).json({ message: "Project deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    createProject,
    respondToInvite,
    getMyProjects,
    getMyInvites,
    getProjectById,
    getWorkspaceProjects,
    requestGuide,
    respondToGuideRequest,
    getMyGuideRequests,
    deleteProject
};