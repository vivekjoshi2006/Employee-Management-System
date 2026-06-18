const express = require('express');
const router = express.Router();
const empController = require('../controllers/empController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', verifyToken, empController.getEmployees);
router.post('/add', verifyToken, isAdmin, empController.createEmployee);
router.delete('/:id', verifyToken, isAdmin, empController.deleteEmployee);

module.exports = router;