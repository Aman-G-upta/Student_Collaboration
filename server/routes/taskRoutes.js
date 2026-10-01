const express = require("express");
const {
    createTask,
    getProjectTasks,
    updateTaskStatus,
    deleteTask
} = require("../controllers/taskController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/project/:projectId", protect, createTask);
router.get("/project/:projectId", protect, getProjectTasks);
router.patch("/:id/status", protect, updateTaskStatus);
router.delete("/:id", protect, deleteTask);

module.exports = router;