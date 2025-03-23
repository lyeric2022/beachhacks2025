const express = require("express");
const router = express.Router();
const getDbInstance = require("../config/supabaseConfig");

router.post("/", async (req, res) => {
  const { assignment_id, user_id } = req.body;

  if (!assignment_id || !user_id) {
    return res.status(400).json({ error: "Missing assignment_id or user_id" });
  }

  const supabase = await getDbInstance();

  const { data, error } = await supabase
    .from("sessions")
    .insert([
      {
        assignment_id,
        user_id,
        start_time: new Date().toISOString(),
        is_active: true,
        status: "Running",
      },
    ])
    .select(); // 🔁 Ensures Supabase returns inserted rows

  if (error) {
    console.error("❌ Failed to insert session:", error);
    return res.status(500).json({ error: error.message });
  }

  if (!data || data.length === 0) {
    return res.status(500).json({ error: "No session was created." });
  }

  res.json(data[0]);
});

router.get("/active", async (req, res) => {
  const { assignment_id, user_id } = req.query;

  if (!assignment_id || !user_id) {
    return res.status(400).json({ error: "Missing assignment_id or user_id" });
  }

  const supabase = await getDbInstance();

  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("assignment_id", assignment_id)
    .eq("user_id", user_id)
    .eq("is_active", true)
    .limit(1);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ sessionExists: data.length > 0 });
});

router.get("/", async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: "Missing user_id" });
  }

  try {
    const supabase = await getDbInstance();

    const { data, error } = await supabase
      .from("sessions")
      .select(
        `id, assignment_id, start_time, end_time, is_active, status, assignments (title, courses (title))`
      )
      .eq("user_id", user_id)
      .order("start_time", { ascending: false });

    if (error) {
      console.error("Failed to fetch sessions", error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error("Unexpected error", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
