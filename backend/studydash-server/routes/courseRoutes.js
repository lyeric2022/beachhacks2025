const express = require("express");
const router = express.Router();
const getDbInstance = require("../config/supabaseConfig");

router.get("/", async (req, res) => {
  const supabase = await getDbInstance();
  const { data, error } = await supabase.from("courses").select("id, title");

  if (error) {
    console.error("Failed to fetch courses", error);
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

module.exports = router;
