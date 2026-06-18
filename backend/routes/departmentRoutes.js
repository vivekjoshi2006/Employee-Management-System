const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', verifyToken, departmentController.getDepartments);
router.post('/', verifyToken, isAdmin, departmentController.createDepartment);

module.exports = router;