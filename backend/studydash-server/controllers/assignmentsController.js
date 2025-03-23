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
        const user = "hello"
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};