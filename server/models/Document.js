const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
    {
        project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
        title: { type: String, required: true, trim: true },
        fileName: { type: String, required: true },
        fileUrl: { type: String, required: true },
        publicId: { type: String, required: true },
        resourceType: { type: String, default: "raw" }, // ← new
        fileType: { type: String, enum: ["image", "document"], required: true },
        version: { type: Number, required: true, default: 1 },
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        status: { type: String, enum: ["pending", "approved", "changes-requested"], default: "pending" },
        feedback: { type: String, trim: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Document", documentSchema);