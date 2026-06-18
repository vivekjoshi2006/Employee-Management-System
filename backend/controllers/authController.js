const Employee = require('../models/Employee');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { error } = require('../utils/apiResponse');

exports.login = async (req, res) => {
    const { email, password, requestedRole } = req.body;
    try {
        // 1. Locate the User Profile
        const user = await Employee.findOne({ where: { email } });
        if (!user) {
            return error(res, "Invalid email or password", 401);
        }

        // 2. Validate Password Match
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return error(res, "Invalid email or password", 401);
        }

        // 3. Verify Role Tab Mismatch [7]
        if (requestedRole && user.role !== requestedRole) {
            return error(res, `Access denied. You do not hold an active ${requestedRole} role profile.`, 403);
        }

        // 4. Generate Session Token
        const token = jwt.sign(
            { id: user.id, role: user.role, name: user.name },
            process.env.JWT_SECRET || 'super_secret_key',
            { expiresIn: '1d' }
        );

        // Flat JSON structure (Matches Login.jsx expectations)
        return res.json({
            success: true,
            message: "Authentication successful",
            token,
            user: { 
                id: user.id, 
                name: user.name, 
                role: user.role, 
                email: user.email 
            }
        });
    } catch (err) {
        return error(res, err.message, 500);
    }
};