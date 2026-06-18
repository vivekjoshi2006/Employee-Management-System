const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Leave = sequelize.define('Leave', {
    leaveType: { type: DataTypes.STRING, allowNull: false }, 
    startDate: { type: DataTypes.DATEONLY, allowNull: false },
    endDate: { type: DataTypes.DATEONLY, allowNull: false },
    reason: { type: DataTypes.TEXT },
    status: { type: DataTypes.STRING, defaultValue: 'Pending' }
});

module.exports = Leave;