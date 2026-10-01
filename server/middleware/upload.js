const multer = require("multer");

const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/msword",
    "application/vnd.ms-powerpoint",
    "image/png",
    "image/jpeg",
    "image/webp"
];

const fileFilter = (req, file, cb) => {
    console.log("FILE RECEIVED:");
    console.log("Name:", file.originalname);
    console.log("MIME:", file.mimetype);

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Unsupported file type. Allowed: PDF, DOC(X), PPT(X), PNG, JPG, WEBP"
            ),
            false
        );
    }
};

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});

const getFileType = (mimetype) =>
    mimetype.startsWith("image/") ? "image" : "document";

module.exports = {
    upload,
    getFileType
};