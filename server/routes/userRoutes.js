const express = require("express");
const { getFacultyList } = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/faculty", protect, getFacultyList);

module.exports = router;