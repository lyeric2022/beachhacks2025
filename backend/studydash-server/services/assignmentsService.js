const getDbInstance = require("../config/supabaseConfig");

const getAllAssignmentsByUser = async (userId) => {
  const supabase = await getDbInstance();

  const { data, error } = await supabase
    .from("assignments")
    .select(
      `
        id,
        title,
        due_date,
        status,
        user_id,
        courses (
          id,
          title
        )
      `
    )
    .eq("user_id", userId);

  if (error) {
    console.error("Supabase join error:", error);
    return [];
  }
  console.log(data);

  // Flatten the course name
  return data.map((assignment) => ({
    ...assignment,
    course_name: assignment.courses?.name || "Unknown Course",
  }));
};

const getAllAssignmentsByCourse = async () => {
  const supabase = await getDbInstance();
  const { data, error } = await supabase
    .from("assignments")
    .select("*")
    .eq("user_id", userId);
};

const getAssignmentById = async (id) => {};

const addAssignment = async (assignment) => {
  const supabase = await getDbInstance();
  console.log("adding assignment");
  const { data, error } = await supabase.from("assignments").insert({
    created_at: assignment.created_at,
    course_id: assignment.course_id,
    title: assignment.title,
    status: assignment.status,
    user_id: assignment.user_id,
    due_date: assignment.due_date,
  });

  console.log(error);
  console.log(data);
};

const updateAssignment = async (id, updatedData) => {};

const deleteAssignment = async (id) => {};

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

const getEventsByDate = async (userId, date) => {
    const supabase = await getDbInstance();
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("user_id", userId)
        .gte("start", startOfDay.toISOString())
        .lt("start", endOfDay.toISOString())
        .order("start", { ascending: true });

    if (error) {
        console.error("Error fetching events by date:", error);
        return [];
    }

    return data;
};

module.exports = {

    getAllAssignmentsByUser,
    getAssignmentById,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    getUpcomingAssignments,
    getCourseGrade,
    getTodayEvents,
    getEventsByDate
}

