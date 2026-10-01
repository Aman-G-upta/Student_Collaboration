const express = require("express");

const {
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
} = require("../controllers/projectController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/create", protect, authorize("student"), createProject);
router.post("/:id/respond", protect, authorize("student"), respondToInvite);
router.get("/my", protect, getMyProjects);
router.get("/invites", protect, authorize("student"), getMyInvites);
router.get("/guide-requests", protect, authorize("faculty"), getMyGuideRequests);
router.get("/:id", protect, getProjectById);
router.get("/workspace/:workspaceId", protect, authorize("faculty"), getWorkspaceProjects);
router.post("/:id/request-guide", protect, authorize("student"), requestGuide);
router.post("/:id/guide-request/respond", protect, authorize("faculty"), respondToGuideRequest);
router.delete("/:id", protect, authorize("student"), deleteProject);

module.exports = router;