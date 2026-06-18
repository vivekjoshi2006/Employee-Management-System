const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Department = sequelize.define('Department', {
    dept_name: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.TEXT },
    status: { type: DataTypes.STRING, defaultValue: 'Active' }
});

module.exports = Department;