const express = require('express');
const AssignmentsController = require('../controllers/assignmentsController');
const taskUtils = require('./taskUtils');
const router = express.Router();

// router.get('/', UserController.getAssignmentByUser);
// router.post('/', UserController.createAssignment);
router.get('/upcoming', AssignmentsController.getUpcomingAssignments);
router.get('/courses/:id/grade', AssignmentsController.getCourseGrade);
router.get('/events/today', AssignmentsController.getTodayEvents);
router.get('/agenda', AssignmentsController.getDailyAgenda);
router.get('/events/by-date', AssignmentsController.getEventsByDate);

module.exports = router;