const express = require('express');
const bodyParser = require('body-parser');
const assignmentRoutes = require('./routes/assignmentRoutes');

const app = express();
const PORT = 7777;

app.use(bodyParser.json());

app.use('/api/assignments', assignmentRoutes);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));