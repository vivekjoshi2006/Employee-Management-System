import React, { useEffect, useState, useContext } from 'react';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import { Check, X, Plus, Edit2, Trash2 } from 'lucide-react';

const LeavesPage = () => {
    const { user } = useContext(AuthContext);
    const [leaves, setLeaves] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    // Form States
    const [empName, setEmpName] = useState(''); // Stores employee name for admin read-only view
    const [leaveType, setLeaveType] = useState('Sick Leave');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [status, setStatus] = useState('Pending');

    const fetchLeaves = async () => {
        try {
            const res = await API.get('/leaves');
            setLeaves(res.data.data || res.data || []);
        } catch (err) {
            console.error("Error retrieving leaves:", err);
        }
    };

    useEffect(() => { fetchLeaves(); }, []);

    const openApplyModal = () => {
        setIsEditMode(false);
        setEmpName('');
        setLeaveType('Sick Leave');
        setStartDate('');
        setEndDate('');
        setReason('');
        setStatus('Pending');
        setIsModalOpen(true);
    };

    const openEditModal = (leave) => {
        setIsEditMode(true);
        setSelectedId(leave.id);
        setEmpName(leave.Employee?.name || 'Unassigned');
        setLeaveType(leave.leaveType);
        setStartDate(leave.startDate);
        setEndDate(leave.endDate);
        setReason(leave.reason || '');
        setStatus(leave.status);
        setIsModalOpen(true);
    };

    const handleApplyOrUpdate = async (e) => {
        e.preventDefault();
        try {
            let payload;

            // Admin only updates the status; Employee updates the request details [7]
            if (user?.role === 'Admin') {
                payload = { status };
            } else {
                payload = { leaveType, startDate, endDate, reason };
            }

            if (isEditMode) {
                await API.put(`/leaves/${selectedId}`, payload);
                alert("Leave request updated successfully!");
            } else {
                await API.post('/leaves/apply', payload);
                alert("Leave application submitted!");
            }
            setIsModalOpen(false);
            fetchLeaves();
        } catch (err) {
            alert(err.response?.data?.message || "Operation failed.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Permanently delete this leave record?")) {
            try {
                await API.delete(`/leaves/${id}`);
                fetchLeaves();
            } catch (err) {
                alert("Deletion failed.");
            }
        }
    };

    const handleAction = async (id, statusValue) => {
        try {
            await API.put(`/leaves/update/${id}`, { status: statusValue });
            fetchLeaves();
        } catch (err) {
            alert("Leave update action failed.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 pl-64">
            <Sidebar />
            <main className="p-8 max-w-7xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900">Leaves</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Manage and track time-off bookings.</p>
                    </div>
                    {user?.role === 'Employee' && (
                        <button onClick={openApplyModal} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 text-sm shadow transition">
                            <Plus size={16} /> Apply for Leave
                        </button>
                    )}
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase">
                            <tr>
                                {user?.role === 'Admin' && <th className="p-4">Staff Member</th>}
                                <th className="p-4">Type</th>
                                <th className="p-4">Duration</th>
                                <th className="p-4">Reason</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {leaves.length === 0 ? (
                                <tr>
                                    <td colSpan={user?.role === 'Admin' ? 6 : 5} className="p-8 text-center text-sm text-gray-400 font-medium">
                                        No leave records found.
                                    </td>
                                </tr>
                            ) : (
                                leaves.map(l => (
                                    <tr key={l.id} className="hover:bg-slate-50/50">
                                        {user?.role === 'Admin' && (
                                            <td className="p-4 font-semibold text-gray-800">
                                                {l.Employee?.name || 'Unassigned'}
                                            </td>
                                        )}
                                        <td className="p-4 font-bold text-slate-700">{l.leaveType}</td>
                                        <td className="p-4 text-sm text-gray-500">{l.startDate} to {l.endDate}</td>
                                        <td className="p-4 text-sm text-gray-500">{l.reason || '--'}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${l.status === 'Approved' ? 'bg-green-50 text-green-700' :
                                                    l.status === 'Rejected' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'
                                                }`}>
                                                {l.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-center gap-1.5">
                                                {/* Edit and Delete operations */}
                                                {(user?.role === 'Admin' || l.status === 'Pending') && (
                                                    <button onClick={() => openEditModal(l)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-full transition">
                                                        <Edit2 size={15} />
                                                    </button>
                                                )}
                                                <button onClick={() => handleDelete(l.id)} className="text-red-600 hover:bg-red-50 p-1.5 rounded-full transition">
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? (user?.role === 'Admin' ? "Review Leave Request" : "Edit Leave Request") : "Apply for Leave"}>
                <form onSubmit={handleApplyOrUpdate} className="space-y-4">

                    {isEditMode && user?.role === 'Admin' ? (
                        /* ADMIN EDIT VIEW: Read-Only parameters + Status modifier dropdown [7] */
                        <div className="space-y-4">
                            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 text-sm space-y-2 text-slate-700">
                                <p className="flex justify-between"><span className="font-semibold text-slate-500">Staff Member:</span> <span className="font-bold text-slate-900">{empName}</span></p>
                                <p className="flex justify-between"><span className="font-semibold text-slate-500">Leave Type:</span> <span className="font-bold text-slate-900">{leaveType}</span></p>
                                <p className="flex justify-between"><span className="font-semibold text-slate-500">Duration:</span> <span className="font-bold text-slate-900">{startDate} to {endDate}</span></p>
                                <div className="pt-2 border-t border-slate-100">
                                    <span className="font-semibold text-slate-500 block mb-1">Reason for Application:</span>
                                    <p className="bg-white p-2.5 rounded-xl border border-slate-100 text-xs italic text-slate-600">{reason || "No descriptive reason provided."}</p>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500">Review Decision</label>
                                <select className="w-full border rounded-xl p-2.5 bg-white text-sm outline-none focus:border-blue-500" value={status} onChange={e => setStatus(e.target.value)}>
                                    <option value="Pending">Pending</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>
                        </div>
                    ) : (
                        /* EMPLOYEE VIEW: Fully editable inputs to submit or modify requests */
                        <>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500">Leave Type</label>
                                <select className="w-full border rounded-xl p-2.5 bg-white text-sm outline-none focus:border-blue-500" value={leaveType} onChange={e => setLeaveType(e.target.value)}>
                                    <option value="Sick Leave">Sick Leave</option>
                                    <option value="Vacation">Vacation</option>
                                    <option value="bereavement">bereavement</option>
                                    <option value="Paternity Leave">Paternity Leave</option>
                                    <option value="Casual Leave">Casual Leave</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500">From Date</label>
                                    <input type="date" required value={startDate} className="w-full border rounded-xl p-2.5 text-sm outline-none focus:border-blue-500" onChange={e => setStartDate(e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500">To Date</label>
                                    <input type="date" required value={endDate} className="w-full border rounded-xl p-2.5 text-sm outline-none focus:border-blue-500" onChange={e => setEndDate(e.target.value)} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500">Reason</label>
                                <textarea required value={reason} className="w-full border rounded-xl p-2.5 text-sm h-20 outline-none focus:border-blue-500" onChange={e => setReason(e.target.value)}></textarea>
                            </div>
                        </>
                    )}

                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl hover:bg-blue-700 transition">
                        {isEditMode ? "Save Changes" : "Submit Application"}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default LeavesPage;