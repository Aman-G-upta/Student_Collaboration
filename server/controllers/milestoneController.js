const Milestone = require("../models/Milestone");
const Project = require("../models/Project");

const isGuide = (project, userId) => project.guide && project.guide.toString() === userId;
const isMember = (project, userId) => project.members.some((m) => m.user.toString() === userId && m.status === "accepted");

const createMilestone = async (req, res) => {
    try {
        const { title, description, deadline } = req.body || {};

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        const project = await Project.findById(req.params.projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (!isGuide(project, req.user.userId)) {
            return res.status(403).json({ message: "Only the project guide can create milestones" });
        }

        const count = await Milestone.countDocuments({ project: project._id });

        const milestone = await Milestone.create({
            project: project._id,
            title,
            description,
            deadline,
            order: count
        });

        res.status(201).json({ message: "Milestone created", milestone });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const getProjectMilestones = async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const authorized = isGuide(project, req.user.userId) || isMember(project, req.user.userId);
        if (!authorized) {
            return res.status(403).json({ message: "You do not have access to this project" });
        }

        const milestones = await Milestone.find({ project: project._id }).sort({ order: 1, createdAt: 1 });
        res.status(200).json({ milestones });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const updateMilestoneStatus = async (req, res) => {
    try {
        const { status } = req.body || {};
        if (!["pending", "completed"].includes(status)) {
            return res.status(400).json({ message: "Status must be 'pending' or 'completed'" });
        }

        const milestone = await Milestone.findById(req.params.id);
        if (!milestone) {
            return res.status(404).json({ message: "Milestone not found" });
        }

        const project = await Project.findById(milestone.project);
        if (!isGuide(project, req.user.userId)) {
            return res.status(403).json({ message: "Only the project guide can update milestone status" });
        }

        milestone.status = status;
        await milestone.save();

        res.status(200).json({ message: "Milestone updated", milestone });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const deleteMilestone = async (req, res) => {
    try {
        const milestone = await Milestone.findById(req.params.id);
        if (!milestone) {
            return res.status(404).json({ message: "Milestone not found" });
        }

        const project = await Project.findById(milestone.project);
        if (!isGuide(project, req.user.userId)) {
            return res.status(403).json({ message: "Only the project guide can delete milestones" });
        }

        await milestone.deleteOne();
        res.status(200).json({ message: "Milestone deleted" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { createMilestone, getProjectMilestones, updateMilestoneStatus, deleteMilestone };