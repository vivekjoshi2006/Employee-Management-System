const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, attendanceController.getAttendanceLogs);
router.post('/punch', verifyToken, attendanceController.punchAttendance);

module.exports = router;