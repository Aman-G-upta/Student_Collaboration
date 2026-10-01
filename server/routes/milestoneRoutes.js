const express = require("express");
const {
    createMilestone,
    getProjectMilestones,
    updateMilestoneStatus,
    deleteMilestone
} = require("../controllers/milestoneController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/project/:projectId", protect, createMilestone);
router.get("/project/:projectId", protect, getProjectMilestones);
router.patch("/:id/status", protect, updateMilestoneStatus);
router.delete("/:id", protect, deleteMilestone);

module.exports = router;