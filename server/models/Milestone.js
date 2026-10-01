const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema(
    {
        project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
        title: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        deadline: { type: Date },
        status: { type: String, enum: ["pending", "completed"], default: "pending" },
        order: { type: Number, default: 0 }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Milestone", milestoneSchema);