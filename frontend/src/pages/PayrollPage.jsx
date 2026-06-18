import React, { useEffect, useState, useContext } from 'react';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import { FileDown, Plus, Edit2, Trash2 } from 'lucide-react';

const PayrollPage = () => {
    const { user } = useContext(AuthContext);
    const [payroll, setPayroll] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    
    const [formData, setFormData] = useState({
        empId: '', basicSalary: '', allowances: '0', tax: '0', month: 'January', year: new Date().getFullYear()
    });

    const loadData = async () => {
        try {
            const [payrollRes, empRes] = await Promise.all([
                API.get('/payroll'),
                API.get('/employees')
            ]);
            setPayroll(payrollRes.data.data || payrollRes.data || []);
            setEmployees(empRes.data.data || empRes.data || []);
        } catch (err) {
            console.error("Error loading payroll dataset:", err);
        }
    };

    useEffect(() => { loadData(); }, []);

    const openAddModal = () => {
        setIsEditMode(false);
        setFormData({ empId: '', basicSalary: '', allowances: '0', tax: '0', month: 'January', year: new Date().getFullYear() });
        setIsModalOpen(true);
    };

    const openEditModal = (p) => {
        setIsEditMode(true);
        setSelectedId(p.id);
        setFormData({
            empId: p.empId,
            basicSalary: p.basicSalary.toString(),
            allowances: p.allowances.toString(),
            tax: p.tax.toString(),
            month: p.month,
            year: p.year
        });
        setIsModalOpen(true);
    };

    const handleCreateOrUpdatePayroll = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await API.put(`/payroll/${selectedId}`, formData);
                alert("Payroll record updated successfully!");
            } else {
                await API.post('/payroll', formData);
                alert("Payroll record compiled successfully!");
            }
            setIsModalOpen(false);
            loadData();
        } catch (err) {
            alert("Operation failed.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this payroll record?")) {
            try {
                await API.delete(`/payroll/${id}`);
                loadData();
            } catch (err) {
                alert("Deletion failed.");
            }
        }
    };

    const handleDownloadSlip = async (payrollId, filename) => {
        try {
            const response = await API.get(`/payroll/download/${payrollId}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${filename}_payslip.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert("Error downloading payroll document.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 pl-64">
            <Sidebar />
            <main className="p-8 max-w-7xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900">Payroll Ledger</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Manage and audit basic salary payouts and allowances.</p>
                    </div>
                    {user?.role === 'Admin' && (
                        <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 text-sm shadow transition">
                            <Plus size={16} /> Add Payroll
                        </button>
                    )}
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase">
                            <tr>
                                <th className="p-4">Employee</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Month/Year</th>
                                <th className="p-4">Basic Salary</th>
                                <th className="p-4">Allowances</th>
                                <th className="p-4">Tax Deducted</th>
                                <th className="p-4">Net Salary</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {payroll.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="p-8 text-center text-sm text-gray-400 font-medium">
                                        No compiled payroll records located.
                                    </td>
                                </tr>
                            ) : (
                                payroll.map(p => (
                                    <tr key={p.id} className="hover:bg-slate-50/50">
                                        <td className="p-4 font-bold text-gray-800">{p.Employee?.name || 'Unknown'}</td>
                                        <td className="p-4 text-sm text-gray-500">{p.Employee?.role || '--'}</td>
                                        <td className="p-4 text-sm text-gray-600">{p.month} {p.year}</td>
                                        <td className="p-4 text-sm font-semibold">Rs. {p.basicSalary.toFixed(2)}</td>
                                        <td className="p-4 text-sm font-semibold text-green-600">+Rs. {p.allowances.toFixed(2)}</td>
                                        <td className="p-4 text-sm font-semibold text-red-500">-Rs. {p.tax.toFixed(2)}</td>
                                        <td className="p-4 font-black text-slate-800 text-sm">Rs. {p.netSalary.toFixed(2)}</td>
                                        <td className="p-4">
                                            <div className="flex justify-center gap-1.5">
                                                <button 
                                                    onClick={() => handleDownloadSlip(p.id, p.Employee?.name || 'Employee')}
                                                    className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-full transition inline-flex items-center"
                                                >
                                                    <FileDown size={16} />
                                                </button>
                                                {user?.role === 'Admin' && (
                                                    <>
                                                        <button onClick={() => openEditModal(p)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-full transition inline-flex items-center"><Edit2 size={15}/></button>
                                                        <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-full transition inline-flex items-center"><Trash2 size={15}/></button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? "Edit Payroll Record" : "Compile Payroll Profile"}>
                <form onSubmit={handleCreateOrUpdatePayroll} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500">Target Employee</label>
                        {/* FIXED: Removed disabled={isEditMode} to make it fully selectable */}
                        <select className="w-full border rounded-xl p-2.5 bg-white text-sm outline-none" required value={formData.empId} onChange={e => setFormData({...formData, empId: e.target.value})}>
                            <option value="">Select Staff Member</option>
                            {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.role})</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500">Basic Salary (Rs.)</label>
                            <input type="number" required className="w-full border rounded-xl p-2.5 text-sm outline-none focus:border-blue-500" value={formData.basicSalary} onChange={e => setFormData({...formData, basicSalary: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500">Allowances (Rs.)</label>
                            <input type="number" required className="w-full border rounded-xl p-2.5 text-sm outline-none focus:border-blue-500" value={formData.allowances} onChange={e => setFormData({...formData, allowances: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500">Tax Deduct (Rs.)</label>
                            <input type="number" required className="w-full border rounded-xl p-2.5 text-sm outline-none focus:border-blue-500" value={formData.tax} onChange={e => setFormData({...formData, tax: e.target.value})} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500">Month</label>
                            <select className="w-full border rounded-xl p-2.5 bg-white text-sm outline-none" value={formData.month} onChange={e => setFormData({...formData, month: e.target.value})}>
                                {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500">Year</label>
                            <input type="number" required className="w-full border rounded-xl p-2.5 text-sm outline-none focus:border-blue-500" value={formData.year} onChange={e => setFormData({...formData, year: parseInt(e.target.value) || new Date().getFullYear()})} />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl hover:bg-blue-700 transition">{isEditMode ? "Save Changes" : "Compile & Post"}</button>
                </form>
            </Modal>
        </div>
    );
};

export default PayrollPage;