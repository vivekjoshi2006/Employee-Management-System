const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Attendance = sequelize.define('Attendance', {
    date: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
    checkIn: { type: DataTypes.STRING },
    checkOut: { type: DataTypes.STRING },
    status: { type: DataTypes.STRING, defaultValue: 'Present' }
});

module.exports = Attendance;