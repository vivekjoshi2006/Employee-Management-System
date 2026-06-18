const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./config/db');

// Import all models
const Department = require('./models/Department');
const LeaveType = require('./models/LeaveType');
const Employee = require('./models/Employee');
const Leave = require('./models/Leave');
const Attendance = require('./models/Attendance');
const Payroll = require('./models/Payroll');

// Centralized Model Associations
Employee.belongsTo(Department, { foreignKey: 'deptId', onDelete: 'SET NULL' });
Department.hasMany(Employee, { foreignKey: 'deptId' });

Leave.belongsTo(Employee, { foreignKey: 'empId', onDelete: 'CASCADE' });
Employee.hasMany(Leave, { foreignKey: 'empId' });

Attendance.belongsTo(Employee, { foreignKey: 'empId', onDelete: 'CASCADE' });
Employee.hasMany(Attendance, { foreignKey: 'empId' });

Payroll.belongsTo(Employee, { foreignKey: 'empId', onDelete: 'CASCADE' });
Employee.hasMany(Payroll, { foreignKey: 'empId' });

// Import routes
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const payrollRoutes = require('./routes/payrollRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// SAFE IDEMPOTENT AUTO-SEEDER
const runAutoSeeder = async () => {
    try {
        // Safe find or create for Department
        const [dept] = await Department.findOrCreate({
            where: { dept_name: 'IT Department' },
            defaults: {
                description: 'Information Technology Support & Systems',
                status: 'Active'
            }
        });

        console.log("🌱 Running automated cloud seeder...");

        // Admin Account Setup
        await Employee.findOrCreate({
            where: { email: 'vj@ems.com' },
            defaults: {
                empIdStr: '2026/EMP/0001',
                name: 'VIVEK JOSHI',
                username: 'VIVEK JOSHI',
                password: '12', 
                role: 'Admin',
                salary: 95000,
                deptId: dept.id
            }
        });

        // Regular Employee Account Setup
        await Employee.findOrCreate({
            where: { email: 'emp@ems.com' },
            defaults: {
                empIdStr: '2026/EMP/0002',
                name: 'EMP',
                username: 'EMP',
                password: '12', 
                role: 'Employee',
                salary: 55000,
                deptId: dept.id
            }
        });

        console.log("🌱 Cloud seeder completed. Default credentials checked and updated.");
    } catch (err) {
        console.error("❌ Cloud seeder failed:", err);
    }
};

// Database readiness middleware with failure-reset logic
let isDbReady = false;
let dbInitPromise = null;

const initDb = async () => {
    await sequelize.sync();
    await runAutoSeeder(); 
    isDbReady = true;
};

app.use(async (req, res, next) => {
    if (!isDbReady) {
        if (!dbInitPromise) {
            dbInitPromise = initDb().catch(err => {
                dbInitPromise = null; 
                throw err;
            });
        }
        try {
            await dbInitPromise; 
        } catch (err) {
            console.error("❌ Database initialization failed on request:", err);
            return res.status(500).json({ success: false, message: "Database initialization failed: " + err.message });
        }
    }
    next();
});

// Dual-path routing
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/employees', employeeRoutes);
app.use('/employees', employeeRoutes);

app.use('/api/departments', departmentRoutes);
app.use('/departments', departmentRoutes);

app.use('/api/leaves', leaveRoutes);
app.use('/leaves', leaveRoutes);

app.use('/api/attendance', attendanceRoutes);
app.use('/attendance', attendanceRoutes);

app.use('/api/payroll', payrollRoutes);
app.use('/payroll', payrollRoutes);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`🚀 Server listening on http://localhost:${PORT}`);
    });
}

module.exports = app;