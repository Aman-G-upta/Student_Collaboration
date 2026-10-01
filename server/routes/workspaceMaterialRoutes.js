const express = require("express");
const {
    uploadMaterial,
    getWorkspaceMaterials,
    deleteMaterial
} = require("../controllers/workspaceMaterialController");
const protect = require("../middleware/authMiddleware");
const { upload } = require("../middleware/upload");

const router = express.Router();

router.post("/workspace/:workspaceId", protect, upload.single("file"), uploadMaterial);
router.get("/workspace/:workspaceId", protect, getWorkspaceMaterials);
router.delete("/:id", protect, deleteMaterial);

module.exports = router;