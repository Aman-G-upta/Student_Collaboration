const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        role: { type: String, enum: ["leader", "member"], default: "member" },
        status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" }
    },
    { _id: false }
);

const guideRequestSchema = new mongoose.Schema(
    {
        faculty: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
        respondedAt: { type: Date }
    },
    { _id: false }
);

const projectSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        domain: { type: String },
        teamSize: { type: Number, default: 4 },
        workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true },
        members: [memberSchema],
        guide: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        guideRequest: guideRequestSchema,
        status: { type: String, enum: ["forming", "active", "completed"], default: "forming" }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);