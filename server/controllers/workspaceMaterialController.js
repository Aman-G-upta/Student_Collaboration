const cloudinary = require("../config/cloudinary");
const WorkspaceMaterial = require("../models/WorkspaceMaterial");
const Workspace = require("../models/Workspace");
const { getFileType } = require("../middleware/upload");
const uploadToCloudinary = require("../utils/cloudinaryUpload");

const canAccessWorkspace = (workspace, userId) =>
    workspace.faculty.toString() === userId || workspace.students.some((s) => s.toString() === userId);

const uploadMaterial = async (req, res) => {
    try {
        const { title } = req.body || {};
        if (!req.file) return res.status(400).json({ message: "File is required" });

        const workspace = await Workspace.findById(req.params.workspaceId);
        if (!workspace) return res.status(404).json({ message: "Workspace not found" });

        if (workspace.faculty.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Only the workspace owner can add material" });
        }

        const fileType = getFileType(req.file.mimetype);
        const folder = `student-collaborator/workspace/${workspace._id}`;

        const result = await uploadToCloudinary(
            req.file,
            folder
        );
        const material = await WorkspaceMaterial.create({
            workspace: workspace._id,
            title: (title && title.trim()) || req.file.originalname,
            fileName: req.file.originalname,
            fileUrl: result.secure_url,
            publicId: result.public_id,
            resourceType: result.resource_type, // ← new
            fileType,
            uploadedBy: req.user.userId
        });
        const populated = await WorkspaceMaterial.findById(material._id).populate("uploadedBy", "name email");
        res.status(201).json({ message: "Material uploaded", material: populated });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "Server error" });
    }
};

const getWorkspaceMaterials = async (req, res) => {
    try {
        const workspace = await Workspace.findById(req.params.workspaceId);
        if (!workspace) return res.status(404).json({ message: "Workspace not found" });

        if (!canAccessWorkspace(workspace, req.user.userId)) {
            return res.status(403).json({ message: "You do not have access to this workspace" });
        }

        const all = await WorkspaceMaterial.find({ workspace: workspace._id })
            .populate("uploadedBy", "name email")
            .sort({ createdAt: -1 });

        const images = all.filter((m) => m.fileType === "image");
        const documents = all.filter((m) => m.fileType === "document");

        res.status(200).json({ images, documents });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const deleteMaterial = async (req, res) => {
    try {
        const material = await WorkspaceMaterial.findById(req.params.id);
        if (!material) return res.status(404).json({ message: "Material not found" });

        if (material.uploadedBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: "You can only delete your own uploads" });
        }

        await cloudinary.uploader.destroy(material.publicId, {
            resource_type: material.resourceType || "image",
            type: "upload",
            invalidate: true
        });

        await material.deleteOne(); // ← this line was missing

        res.status(200).json({ message: "Deleted successfully" });

    } catch (error) {
        console.error("Delete material failed:", error?.message || error);
        res.status(500).json({ message: error?.message || "Server error" });
    }
};

module.exports = { uploadMaterial, getWorkspaceMaterials, deleteMaterial };