const mongoose = require("mongoose");

const workspaceSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true
        },

        description: {
            type: String,
            trim: true
        },

        department: {
            type: String
        },

        year: {
            type: Number
        },

        faculty: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        students: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Workspace", workspaceSchema);