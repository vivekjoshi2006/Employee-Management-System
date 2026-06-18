const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');
const { generatePayrollPDF } = require('../utils/pdfGenerator');
const { success, error } = require('../utils/apiResponse');

exports.getPayroll = async (req, res) => {
    try {
        const logs = await Payroll.findAll({
            include: [{ model: Employee, attributes: ['name', 'empIdStr', 'role'] }]
        });
        return success(res, "Payroll records retrieved", logs);
    } catch (err) {
        return error(res, err.message);
    }
};

exports.createPayroll = async (req, res) => {
    try {
        const { empId, basicSalary, allowances, tax, month, year } = req.body;
        const netSalary = parseFloat(basicSalary) + parseFloat(allowances) - parseFloat(tax);

        const payroll = await Payroll.create({
            empId, basicSalary, allowances, tax, netSalary, month, year
        });
        return success(res, "Payroll record created", payroll, 201);
    } catch (err) {
        return error(res, err.message, 400);
    }
};

exports.updatePayroll = async (req, res) => {
    try {
        // FIXED: Now extracts and updates empId dynamically [4]
        const { empId, basicSalary, allowances, tax, month, year } = req.body;
        const netSalary = parseFloat(basicSalary) + parseFloat(allowances) - parseFloat(tax);

        await Payroll.update(
            { empId, basicSalary, allowances, tax, netSalary, month, year },
            { where: { id: req.params.id } }
        );
        return success(res, "Payroll record updated successfully");
    } catch (err) {
        return error(res, err.message, 400);
    }
};

exports.deletePayroll = async (req, res) => {
    try {
        await Payroll.destroy({ where: { id: req.params.id } });
        return success(res, "Payroll record deleted successfully");
    } catch (err) {
        return error(res, err.message);
    }
};

exports.downloadPaySlip = async (req, res) => {
    try {
        const payroll = await Payroll.findByPk(req.params.id, {
            include: [Employee]
        });
        if (!payroll) return error(res, "Payroll record not found", 404);

        const pdfDoc = generatePayrollPDF(payroll.Employee, payroll);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=slip_${payroll.Employee.name}_${payroll.month}.pdf`);
        pdfDoc.pipe(res);
    } catch (err) {
        return error(res, err.message);
    }
};