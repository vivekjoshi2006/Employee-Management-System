const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const LeaveType = sequelize.define('LeaveType', {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    days: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 10 },
    status: { type: DataTypes.STRING, defaultValue: 'Active' }
});

module.exports = LeaveType;