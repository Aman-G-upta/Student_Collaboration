const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (file, folder) => {
    return new Promise((resolve, reject) => {
        const safeName = file.originalname
            .replace(/\.[^/.]+$/, "")
            .replace(/[^a-zA-Z0-9-_]/g, "-");

        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "auto",
                public_id: `${Date.now()}-${safeName}`
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error);
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        stream.end(file.buffer);
    });
};

module.exports = uploadToCloudinary;