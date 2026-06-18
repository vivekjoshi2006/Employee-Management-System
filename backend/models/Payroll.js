const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Payroll = sequelize.define('Payroll', {
    basicSalary: { type: DataTypes.FLOAT, allowNull: false },
    allowances: { type: DataTypes.FLOAT, defaultValue: 0 },
    tax: { type: DataTypes.FLOAT, defaultValue: 0 },
    netSalary: { type: DataTypes.FLOAT, allowNull: false },
    month: { type: DataTypes.STRING, allowNull: false },
    year: { type: DataTypes.INTEGER, allowNull: false }
});

module.exports = Payroll;