const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
    createWorkspace,
    joinWorkspace,
    getMyWorkspaces,
    getWorkspaceById, 
    deleteWorkspace
} = require("../controllers/workspaceController");


const router = express.Router();

router.post("/create", protect, authorize("faculty"), createWorkspace);
router.post("/join", protect, authorize("student"), joinWorkspace);
router.get("/my", protect, getMyWorkspaces);
router.get("/:id", protect, getWorkspaceById);
router.delete("/:id", protect, authorize("faculty"), deleteWorkspace);

module.exports = router;