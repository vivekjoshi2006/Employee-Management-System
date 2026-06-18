const Employee = require('../models/Employee');
const Department = require('../models/Department');
const bcrypt = require('bcryptjs');
const { success, error } = require('../utils/apiResponse');

exports.getEmployees = async (req, res) => {
    try {
        const emps = await Employee.findAll({
            attributes: { exclude: ['password'] },
            include: [{ model: Department, attributes: ['dept_name'] }]
        });
        return success(res, "Employees retrieved", emps);
    } catch (err) {
        return error(res, err.message);
    }
};

exports.createEmployee = async (req, res) => {
    try {
        const newEmp = await Employee.create(req.body);
        return success(res, "Employee file created", newEmp, 201);
    } catch (err) {
        return error(res, err.message, 400);
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const { password, ...updateData } = req.body;

        // Hash the password if it is being updated
        if (password && password.trim() !== '') {
            updateData.password = await bcrypt.hash(password, 10);
        }

        await Employee.update(updateData, { where: { id: req.params.id } });
        return success(res, "Employee profile updated successfully");
    } catch (err) {
        return error(res, err.message, 400);
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        await Employee.destroy({ where: { id: req.params.id } });
        return success(res, "Employee successfully removed");
    } catch (err) {
        return error(res, err.message);
    }
};