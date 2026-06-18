import React, { useEffect, useState, useContext } from 'react';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { Clock, Search, CheckCircle } from 'lucide-react';

const AttendancePage = () => {
    const { user } = useContext(AuthContext);
    const [logs, setLogs] = useState([]);
    const [employees, setEmployees] = useState([]);
    
    // Search Filters
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedEmp, setSelectedEmp] = useState('');

    const fetchLogs = async () => {
        try {
            const params = {};
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;
            if (selectedEmp) params.employeeId = selectedEmp;

            const res = await API.get('/attendance', { params });
            setLogs(res.data.data || res.data || []);
        } catch (err) {
            console.error("Error retrieving attendance records:", err);
        }
    };

    const fetchEmployees = async () => {
        if (user?.role === 'Admin') {
            try {
                const res = await API.get('/employees');
                setEmployees(res.data.data || res.data || []);
            } catch (err) {
                console.error("Error retrieving employee catalog:", err);
            }
        }
    };

    useEffect(() => {
        fetchLogs();
        fetchEmployees();
    }, []);

    const handlePunch = async () => {
        try {
            await API.post('/attendance/punch');
            alert("Your attendance register punch transaction succeeded.");
            fetchLogs();
        } catch (err) {
            alert("Attendance register punch action failed.");
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchLogs();
    };

    return (
        <div className="min-h-screen bg-slate-50/50 pl-64">
            <Sidebar />
            <main className="p-8 max-w-7xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900">Attendance Log</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Punch, query, and review check-in timeframes.</p>
                    </div>
                    {user?.role === 'Employee' && (
                        <button 
                            onClick={handlePunch}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm shadow transition"
                        >
                            <Clock size={16} /> Punch Attendance
                        </button>
                    )}
                </div>

                {/* Query Search Panel */}
                <form onSubmit={handleSearch} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500">From Date</label>
                        <input type="date" className="w-full border rounded-xl p-2 text-sm outline-none" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500">To Date</label>
                        <input type="date" className="w-full border rounded-xl p-2 text-sm outline-none" value={endDate} onChange={e => setEndDate(e.target.value)} />
                    </div>
                    {user?.role === 'Admin' ? (
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500">Staff Member</label>
                            <select className="w-full border rounded-xl p-2 bg-white text-sm outline-none" value={selectedEmp} onChange={e => setSelectedEmp(e.target.value)}>
                                <option value="">All Employees</option>
                                {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                            </select>
                        </div>
                    ) : (
                        <div className="text-sm text-gray-400 pb-2">Individual Profile Active</div>
                    )}
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl text-sm flex items-center justify-center gap-2 transition">
                        <Search size={16} /> Apply Filters
                    </button>
                </form>

                {/* Table Layout */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase">
                            <tr>
                                <th className="p-4">Emp ID</th>
                                <th className="p-4">Name</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Punch In</th>
                                <th className="p-4">Punch Out</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-sm text-gray-400 font-medium">No recorded shifts match search criteria.</td>
                                </tr>
                            ) : (
                                logs.map(l => (
                                    <tr key={l.id} className="hover:bg-slate-50/50">
                                        <td className="p-4 text-xs font-bold text-blue-600">{l.Employee?.empIdStr || 'EM-xx'}</td>
                                        <td className="p-4 font-bold text-gray-800">{l.Employee?.name || 'Unknown'}</td>
                                        <td className="p-4 text-sm text-gray-500">{l.date}</td>
                                        <td className="p-4 text-sm font-semibold text-green-600">{l.checkIn || '--'}</td>
                                        <td className="p-4 text-sm font-semibold text-orange-600">{l.checkOut || '--'}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700`}>
                                                {l.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default AttendancePage;