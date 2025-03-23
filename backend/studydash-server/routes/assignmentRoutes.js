const express = require("express");
const UserController = require("../controllers/assignmentsController");
const router = express.Router();
const getDbInstance = require("../config/supabaseConfig");

router.get("/", UserController.getAssignmentByUser);
router.post("/", UserController.createAssignment);

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, course_id, due_date, status } = req.body;

  console.log("🔄 Edit Request Received:");
  console.log("ID:", id);
  console.log("Payload:", { title, course_id, due_date, status });
  const supabase = await getDbInstance();

  const { data, error } = await supabase
    .from("assignments")
    .update({
      ...(title && { title }),
      ...(course_id && { course_id }),
      ...(due_date && { due_date }),
      ...(status && { status }),
    })
    .eq("id", id);

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json(data);
});

router.delete("/:id", async (req, res) => {
  const supabase = await getDbInstance();
  const { id } = req.params;

  const { error } = await supabase.from("assignments").delete().eq("id", id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: "Assignment deleted" });
});

module.exports = router;
