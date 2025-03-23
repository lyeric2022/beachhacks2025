const assignmentService = require('../services/assignmentsService');

exports.getAssignment = async (req, res) => {
    try {
        const users = "Hello"
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createAssignment = async (req, res) => {
    try {
        console.log(req.body)
        const user = await assignmentService.addAssignment(req.body)
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};