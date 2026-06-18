const Leave = require('../models/Leave');
const Employee = require('../models/Employee');
const { success, error } = require('../utils/apiResponse');

exports.applyLeave = async (req, res) => {
    try {
        const leave = await Leave.create({
            ...req.body,
            empId: req.user.id
        });
        return success(res, "Leave application submitted", leave, 201);
    } catch (err) {
        return error(res, err.message, 400);
    }
};

exports.getLeaves = async (req, res) => {
    try {
        const query = req.user.role === 'Admin' ? {} : { where: { empId: req.user.id } };
        const leaves = await Leave.findAll({
            ...query,
            include: [{ model: Employee, attributes: ['name', 'empIdStr'] }]
        });
        return success(res, "Leaves retrieved", leaves);
    } catch (err) {
        return error(res, err.message);
    }
};

exports.updateStatus = async (req, res) => {
    try {
        await Leave.update(
            { status: req.body.status },
            { where: { id: req.params.id } }
        );
        return success(res, "Application status updated successfully");
    } catch (err) {
        return error(res, err.message, 400);
    }
};

exports.updateLeave = async (req, res) => {
    try {
        const leave = await Leave.findByPk(req.params.id);
        if (!leave) return error(res, "Leave record not found", 404);

        // Security check: Only admins or the owner can edit, and only if pending
        if (req.user.role !== 'Admin' && leave.empId !== req.user.id) {
            return error(res, "Access denied.", 403);
        }
        if (req.user.role !== 'Admin' && leave.status !== 'Pending') {
            return error(res, "Only pending leave requests can be modified.", 400);
        }

        await Leave.update(req.body, { where: { id: req.params.id } });
        return success(res, "Leave request updated successfully");
    } catch (err) {
        return error(res, err.message, 400);
    }
};

exports.deleteLeave = async (req, res) => {
    try {
        const leave = await Leave.findByPk(req.params.id);
        if (!leave) return error(res, "Leave record not found", 404);

        if (req.user.role !== 'Admin' && leave.empId !== req.user.id) {
            return error(res, "Access denied.", 403);
        }

        await Leave.destroy({ where: { id: req.params.id } });
        return success(res, "Leave record deleted successfully");
    } catch (err) {
        return error(res, err.message);
    }
};