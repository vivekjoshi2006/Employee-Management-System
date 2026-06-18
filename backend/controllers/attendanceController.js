const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');
const { Op } = require('sequelize');
const { success, error } = require('../utils/apiResponse');

exports.punchAttendance = async (req, res) => {
    const todayStr = new Date().toISOString().split('T')[0];
    try {
        let record = await Attendance.findOne({ where: { empId: req.user.id, date: todayStr } });
        const timeStr = new Date().toLocaleTimeString('en-US', { hour12: true });

        if (!record) {
            // Check-in
            record = await Attendance.create({
                date: todayStr,
                checkIn: timeStr,
                status: 'Present',
                empId: req.user.id
            });
            return success(res, "Punch-In registered", record, 201);
        } else {
            // Check-out
            record.checkOut = timeStr;
            await record.save();
            return success(res, "Punch-Out registered", record);
        }
    } catch (err) {
        return error(res, err.message);
    }
};

exports.getAttendanceLogs = async (req, res) => {
    try {
        const { startDate, endDate, employeeId } = req.query;
        let whereClause = {};

        if (req.user.role !== 'Admin') {
            whereClause.empId = req.user.id;
        } else if (employeeId) {
            whereClause.empId = employeeId;
        }

        if (startDate && endDate) {
            whereClause.date = { [Op.between]: [startDate, endDate] };
        }

        const logs = await Attendance.findAll({
            where: whereClause,
            include: [{ model: Employee, attributes: ['name', 'empIdStr'] }],
            order: [['date', 'DESC']]
        });

        return success(res, "Attendance logs retrieved", logs);
    } catch (err) {
        return error(res, err.message);
    }
};