const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
        milestone: { type: mongoose.Schema.Types.ObjectId, ref: "Milestone" },
        title: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        deadline: { type: Date },
        priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
        status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);