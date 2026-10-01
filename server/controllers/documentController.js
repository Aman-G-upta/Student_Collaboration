const cloudinary = require("../config/cloudinary");
const Document = require("../models/Document");
const Project = require("../models/Project");
const Workspace = require("../models/Workspace");
const { getFileType } = require("../middleware/upload");
const uploadToCloudinary = require("../utils/cloudinaryUpload");

const isProjectMember = (project, userId) =>
    project.members.some((m) => m.user.toString() === userId && m.status === "accepted");

const isProjectGuide = (project, userId) => project.guide && project.guide.toString() === userId;

const canAccessProject = (project, workspace, userId) =>
    isProjectMember(project, userId) || isProjectGuide(project, userId) || workspace.faculty.toString() === userId;

const canReviewProject = (project, workspace, userId) =>
    isProjectGuide(project, userId) || workspace.faculty.toString() === userId;

const uploadDocument = async (req, res) => {
    try {
        const { title } = req.body || {};
        if (!req.file) return res.status(400).json({ message: "File is required" });

        const project = await Project.findById(req.params.projectId);
        if (!project) return res.status(404).json({ message: "Project not found" });

        const workspace = await Workspace.findById(project.workspace);
        if (!workspace) return res.status(404).json({ message: "Workspace not found" });

        if (!canAccessProject(project, workspace, req.user.userId)) {
            return res.status(403).json({ message: "You do not have access to this project" });
        }

        const fileType = getFileType(req.file.mimetype);
        const docTitle = (title && title.trim()) || req.file.originalname;

        let version = 1;
        if (fileType === "document") {
            const escaped = docTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const existing = await Document.find({
                project: project._id,
                fileType: "document",
                title: { $regex: `^${escaped}$`, $options: "i" }
            }).sort({ version: -1 });
            if (existing.length > 0) version = existing[0].version + 1;
        }


        const folder = `student-collaborator/project/${project._id}`;

        const result = await uploadToCloudinary(
            req.file,
            folder
        );
        const document = await Document.create({
            project: project._id,
            title: docTitle,
            fileName: req.file.originalname,
            fileUrl: result.secure_url,
            publicId: result.public_id,
            resourceType: result.resource_type, // ← new — "image" or "raw", exactly what Cloudinary used
            fileType,
            version,
            uploadedBy: req.user.userId,
            status: fileType === "image" ? "approved" : "pending"
        });

        const populated = await Document.findById(document._id).populate("uploadedBy", "name email");
        res.status(201).json({ message: "Uploaded successfully", document: populated });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "Server error" });
    }
};

const getProjectDocuments = async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) return res.status(404).json({ message: "Project not found" });

        const workspace = await Workspace.findById(project.workspace);
        if (!workspace) return res.status(404).json({ message: "Workspace not found" });

        if (!canAccessProject(project, workspace, req.user.userId)) {
            return res.status(403).json({ message: "You do not have access to this project" });
        }

        const all = await Document.find({ project: project._id })
            .populate("uploadedBy", "name email")
            .sort({ createdAt: -1 });

        const images = all.filter((d) => d.fileType === "image");
        const documentsList = all.filter((d) => d.fileType === "document");

        const groups = {};
        documentsList.forEach((doc) => {
            if (!groups[doc.title]) groups[doc.title] = [];
            groups[doc.title].push(doc);
        });
        Object.values(groups).forEach((arr) => arr.sort((a, b) => b.version - a.version));

        res.status(200).json({ images, groups });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const reviewDocument = async (req, res) => {
    try {
        const { status, feedback } = req.body || {};
        if (!["approved", "changes-requested"].includes(status)) {
            return res.status(400).json({ message: "Status must be 'approved' or 'changes-requested'" });
        }

        const document = await Document.findById(req.params.id);
        if (!document) return res.status(404).json({ message: "Document not found" });
        if (document.fileType === "image") {
            return res.status(400).json({ message: "Images do not require review" });
        }

        const project = await Project.findById(document.project);
        const workspace = await Workspace.findById(project.workspace);

        if (!canReviewProject(project, workspace, req.user.userId)) {
            return res.status(403).json({ message: "You are not authorized to review this document" });
        }

        document.status = status;
        document.feedback = feedback || "";
        await document.save();

        const populated = await Document.findById(document._id).populate("uploadedBy", "name email");
        res.status(200).json({ message: "Document reviewed", document: populated });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const deleteDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }

        if (document.uploadedBy.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "You can only delete your own uploads"
            });
        }

        await cloudinary.uploader.destroy(document.publicId, {
            resource_type: document.resourceType || "image",
            type: "upload",
            invalidate: true
        });

        await document.deleteOne();

        res.json({ message: "Document deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message || "Failed to delete document"
        });
    }
};

module.exports = { uploadDocument, getProjectDocuments, reviewDocument, deleteDocument };