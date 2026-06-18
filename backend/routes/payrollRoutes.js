const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', verifyToken, payrollController.getPayroll);
router.post('/', verifyToken, isAdmin, payrollController.createPayroll);
router.get('/download/:id', verifyToken, payrollController.downloadPaySlip);

module.exports = router;