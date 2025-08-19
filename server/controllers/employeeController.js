const Employee = require("../models/Employee");

async function getAllEmployees(req, res) {
    try {
        const employees = await Employee.find().select("-password -refreshToken");
        if(!employees) {
            return res.status(204).json({ message: "No employees were found" });
        }

        res.status(200).json(employees);
    }
    catch(err) {
        console.error("Error fetching Employees: ", err.message);
        res.status(500).json({ error: "Server error", error: err });
    }
}

module.exports = { getAllEmployees };