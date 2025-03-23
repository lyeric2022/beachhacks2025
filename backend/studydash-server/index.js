
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const assignmentRoutes = require("./routes/assignmentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const sessionRoutes = require("./routes/sessionRoute");

const app = express();
app.use(cors({
    origin: '*'
}));
const PORT = 7777;

app.use(bodyParser.json());

app.use("/api/assignments", assignmentRoutes);

app.use("/api/courses", courseRoutes);

app.use("/api/session", sessionRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
