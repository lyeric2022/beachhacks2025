const getDbInstance = require('../config/supabaseConfig')

const getAllAssignmentsByUser = async (userId) => {
    const supabase = await getDbInstance()
    const { data, error } = await supabase
        .from("assignments") 
        .select("*") 
        .eq("user_id", userId)

    console.log(data)
}

const getAllAssignmentsByCourse = async () => {
    const supabase = await getDbInstance()
    const { data, error } = await supabase
        .from("assignments") 
        .select("*") 
        .eq("user_id", userId)

    
}

const getAssignmentById = async (id) => { }

const addAssignment = async (assignment) => {
    const supabase = await getDbInstance()
    console.log("adding assignment")
    const { data, error } = await supabase.from("assignments").insert({
        created_at: assignment.created_at,
        course_id: assignment.course_id,
        title: assignment.title,
        status: assignment.status,
        user_id: assignment.user_id,
        due_date: assignment.due_date
    })

    console.log(error)
    console.log(data)
}

const updateAssignment = async (id, updatedData) => { }

const deleteAssignment = async (id) => { }

const getUpcomingAssignments = async (userId) => {
    const supabase = await getDbInstance()
    const now = new Date().toISOString()
    console.log("upcoming assignments")
    console.log(now)
    console.log(userId)
    const { data, error } = await supabase
        .from("assignments")
        .select("*")
        .eq("user_id", userId)
        .gte("due_date", now)
        .order("due_date", { ascending: true })

        //
        // console.log(data)

    if (error) {
        console.error("Error fetching upcoming assignments:", error)
        return []
    }

    console.log(data.map(assignment => ({
        ...assignment,
        assignment_type: [assignment.assignment_type || 'homework']
    })))

    return data.map(assignment => ({
        ...assignment,
        assignment_type: [assignment.assignment_type || 'homework']
    }))
}

const getCourseGrade = async (courseId, userId) => {
    const supabase = await getDbInstance()
    const { data, error } = await supabase
        .from("courses")
        .select("current_grade")
        .eq("id", courseId)
        .eq("user_id", userId)
        .single()

    if (error) {
        console.error("Error fetching course grade:", error)
        return { grade: 85 } // Default grade if not found
    }

    return { grade: data.current_grade }
}

const getTodayEvents = async (userId) => {
    const supabase = await getDbInstance()
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("user_id", userId)
        .gte("start", today.toISOString())
        .lt("start", tomorrow.toISOString())
        .order("start", { ascending: true })

    if (error) {
        console.error("Error fetching today's events:", error)
        return []
    }

    return data
}

module.exports = {
    getAllAssignmentsByUser,
    getAssignmentById,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    getUpcomingAssignments,
    getCourseGrade,
    getTodayEvents
}