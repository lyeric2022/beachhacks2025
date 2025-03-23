const express = require('express');
const UserController = require('../controllers/assignmentsController');
const router = express.Router();

router.get('/', UserController.getAssignment);
router.post('/', UserController.createAssignment);

module.exports = router;