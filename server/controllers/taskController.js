const Task = require("../models/Task");
const Project = require("../models/Project");

const isGuide = (project, userId) => project.guide && project.guide.toString() === userId;
const isMember = (project, userId) => project.members.some((m) => m.user.toString() === userId && m.status === "accepted");

const createTask = async (req, res) => {
    try {
        const { title, description, assignedTo, milestone, deadline, priority } = req.body || {};

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        const project = await Project.findById(req.params.projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (!isGuide(project, req.user.userId)) {
            return res.status(403).json({ message: "Only the project guide can create tasks" });
        }

        if (assignedTo) {
            const validMember = project.members.some(
                (m) => m.user.toString() === assignedTo && m.status === "accepted"
            );
            if (!validMember) {
                return res.status(400).json({ message: "Assigned user is not an accepted member of this project" });
            }
        }

        const task = await Task.create({
            project: project._id,
            milestone: milestone || undefined,
            title,
            description,
            assignedTo: assignedTo || undefined,
            deadline,
            priority: priority || "medium"
        });

        const populated = await Task.findById(task._id).populate("assignedTo", "name email");
        res.status(201).json({ message: "Task created", task: populated });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const getProjectTasks = async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const authorized = isGuide(project, req.user.userId) || isMember(project, req.user.userId);
        if (!authorized) {
            return res.status(403).json({ message: "You do not have access to this project" });
        }

        const tasks = await Task.find({ project: project._id })
            .populate("assignedTo", "name email")
            .sort({ createdAt: 1 });

        res.status(200).json({ tasks });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body || {};
        if (!["pending", "in-progress", "completed"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        const project = await Project.findById(task.project);
        const isAssignee = task.assignedTo && task.assignedTo.toString() === req.user.userId;
        const guide = isGuide(project, req.user.userId);

        if (!isAssignee && !guide) {
            return res.status(403).json({ message: "You are not authorized to update this task" });
        }

        task.status = status;
        await task.save();

        const populated = await Task.findById(task._id).populate("assignedTo", "name email");
        res.status(200).json({ message: "Task updated", task: populated });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        const project = await Project.findById(task.project);
        if (!isGuide(project, req.user.userId)) {
            return res.status(403).json({ message: "Only the project guide can delete tasks" });
        }

        await task.deleteOne();
        res.status(200).json({ message: "Task deleted" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { createTask, getProjectTasks, updateTaskStatus, deleteTask };