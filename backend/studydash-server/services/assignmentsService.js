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

module.exports = {
  getAllAssignmentsByUser,
  getAssignmentById,
  addAssignment,
  updateAssignment,
  deleteAssignment,
};
