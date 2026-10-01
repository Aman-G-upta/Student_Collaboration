const express = require("express");
const {
    uploadDocument,
    getProjectDocuments,
    reviewDocument,
    deleteDocument
} = require("../controllers/documentController");
const protect = require("../middleware/authMiddleware");
const { upload } = require("../middleware/upload");

const router = express.Router();

router.post("/project/:projectId", protect, upload.single("file"), uploadDocument);
router.get("/project/:projectId", protect, getProjectDocuments);
router.patch("/:id/review", protect, reviewDocument);
router.delete("/:id", protect, deleteDocument);

module.exports = router;