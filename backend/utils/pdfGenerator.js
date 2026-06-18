const PDFDocument = require('pdfkit');

exports.generatePayrollPDF = (employee, payroll) => {
    const doc = new PDFDocument({ margin: 50 });

    doc.rect(20, 20, 572, 752).strokeColor('#e2e8f0').lineWidth(2).stroke();

    doc.fillColor('#1e3a8a').fontSize(24).font('Helvetica-Bold').text('EMS PRO', { align: 'center' });
    doc.fillColor('#475569').fontSize(10).font('Helvetica').text('Corporate HQ - Payroll Division', { align: 'center' });
    doc.moveDown();

    doc.strokeColor('#cbd5e1').lineWidth(1).moveTo(40, 100).lineTo(550, 100).stroke();
    doc.moveDown(2);

    doc.fillColor('#0f172a').fontSize(14).font('Helvetica-Bold').text('MONTHLY SALARY SLIP', { align: 'center' });
    doc.moveDown();

    doc.fontSize(10).font('Helvetica');
    const labelX = 60;
    const valueX = 180;
    let currentY = 160;

    const drawRow = (label, value, isBold = false) => {
        doc.font(isBold ? 'Helvetica-Bold' : 'Helvetica').fillColor(isBold ? '#0f172a' : '#475569').text(label, labelX, currentY);
        doc.font(isBold ? 'Helvetica-Bold' : 'Helvetica').fillColor('#0f172a').text(value, valueX, currentY);
        currentY += 20;
    };

    drawRow('Employee ID:', employee.empIdStr);
    drawRow('Employee Name:', employee.name);
    drawRow('Email:', employee.email);
    drawRow('System Role:', employee.role);
    drawRow('Payroll Period:', `${payroll.month} ${payroll.year}`);

    currentY += 15;
    doc.strokeColor('#e2e8f0').moveTo(40, currentY).lineTo(550, currentY).stroke();
    currentY += 20;

    drawRow('Basic Salary:', `Rs. ${payroll.basicSalary.toFixed(2)}`);
    drawRow('Allowances:', `Rs. ${payroll.allowances.toFixed(2)}`);
    drawRow('Tax Deductions:', `-Rs. ${payroll.tax.toFixed(2)}`);

    currentY += 15;
    doc.strokeColor('#0f172a').lineWidth(1.5).moveTo(40, currentY).lineTo(550, currentY).stroke();
    currentY += 20;

    drawRow('Net Payable Salary:', `Rs. ${payroll.netSalary.toFixed(2)}`, true);

    currentY += 80;
    doc.strokeColor('#cbd5e1').lineWidth(1).moveTo(400, currentY).lineTo(520, currentY).stroke();
    doc.fontSize(8).fillColor('#64748b').text('Authorized Signature', 410, currentY + 5);

    doc.end();
    return doc;
};