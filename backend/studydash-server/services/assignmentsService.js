const getDbInstance = require('../config/supabaseConfig')

const getAllAssignments = async () => {}

const getAssignmentById = async (id) => {}

const addAssignment = async (assignmentData) => {
    const supabase = await getDbInstance()
}

const updateAssignment = async (id, updatedData) => {}

const deleteAssignment = async (id) => {}

module.exports = {
    getAllAssignments,
    getAssignmentById,
    addAssignment,
    updateAssignment,
    deleteAssignment
}