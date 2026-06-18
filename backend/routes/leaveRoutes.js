const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', verifyToken, leaveController.getLeaves);
router.post('/apply', verifyToken, leaveController.applyLeave);
router.put('/update/:id', verifyToken, isAdmin, leaveController.updateStatus);

module.exports = router;