const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ["student", "faculty", "admin"],
            default: "student"
        },

        studentId: {
            type: String,
            sparse: true,
            unique: true
        },

        department: {
            type: String
        },

        year: {
            type: Number
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);