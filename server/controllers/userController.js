const User = require("../models/User");

const getFacultyList = async (req, res) => {
    try {
        const { department } = req.query;

        const filter = { role: "faculty" };
        if (department) filter.department = department;

        const faculty = await User.find(filter).select("name email department");

        res.status(200).json({ faculty });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getFacultyList };