const express = require('express');
const AssignmentsController = require('../controllers/assignmentsController');
const router = express.Router();

// router.get('/', UserController.getAssignmentByUser);
// router.post('/', UserController.createAssignment);
router.get('/upcoming', AssignmentsController.getUpcomingAssignments);
router.get('/courses/:id/grade', AssignmentsController.getCourseGrade);
router.get('/events/today', AssignmentsController.getTodayEvents);

module.exports = router;