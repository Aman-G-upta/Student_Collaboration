const mongoose = require("mongoose");

const workspaceMaterialSchema = new mongoose.Schema(
    {
        workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true },
        title: { type: String, required: true, trim: true },
        fileName: { type: String, required: true },
        fileUrl: { type: String, required: true },
        publicId: { type: String, required: true },
        resourceType: { type: String, default: "raw" }, // ← new
        fileType: { type: String, enum: ["image", "document"], required: true },
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model("WorkspaceMaterial", workspaceMaterialSchema);