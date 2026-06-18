const Department = require('../models/Department');
const { success, error } = require('../utils/apiResponse');

exports.getDepartments = async (req, res) => {
    try {
        const depts = await Department.findAll();
        return success(res, "Departments retrieved", depts);
    } catch (err) {
        return error(res, err.message);
    }
};

exports.createDepartment = async (req, res) => {
    try {
        const dept = await Department.create(req.body);
        return success(res, "Department created", dept, 201);
    } catch (err) {
        return error(res, err.message, 400);
    }
};

exports.updateDepartment = async (req, res) => {
    try {
        await Department.update(req.body, { where: { id: req.params.id } });
        return success(res, "Department updated successfully");
    } catch (err) {
        return error(res, err.message, 400);
    }
};

exports.deleteDepartment = async (req, res) => {
    try {
        await Department.destroy({ where: { id: req.params.id } });
        return success(res, "Department deleted successfully");
    } catch (err) {
        return error(res, err.message);
    }
};