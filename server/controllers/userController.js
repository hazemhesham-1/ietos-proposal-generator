const Employee = require("../models/Employee");

async function getAuthenticatedUser(req, res) {
    try {
        const userId = req.user.id;

        const user = await Employee.findById(userId).select("-password");
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    }
    catch(err) {
        console.error("Error fetching user data: ", err.message);
        res.status(500).json({ error: "Server error" });
    }
}

module.exports = { getAuthenticatedUser };