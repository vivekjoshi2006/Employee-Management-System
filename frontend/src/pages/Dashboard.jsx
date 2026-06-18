import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { 
    Users, Building, CalendarCheck, FileClock, 
    ChevronRight, ArrowUpRight, Plus, Activity, Wallet, ShieldAlert
} from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState({ emps: 0, depts: 0, leavesPending: 0, leavesApproved: 0 });
    const [recentLeaves, setRecentLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    // Dynamic current date formatting
    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [empRes, deptRes, leaveRes] = await Promise.all([
                    API.get('/employees'),
                    API.get('/departments'),
                    API.get('/leaves')
                ]);

                const empData = empRes.data.data || empRes.data || [];
                const deptData = deptRes.data.data || deptRes.data || [];
                const leaveData = leaveRes.data.data || leaveRes.data || [];

                setStats({
                    emps: empData.length,
                    depts: deptData.length,
                    leavesPending: leaveData.filter(l => l.status === 'Pending').length,
                    leavesApproved: leaveData.filter(l => l.status === 'Approved').length,
                });

                // Grab the 4 most recent leave requests to show in feed
                setRecentLeaves(leaveData.slice(0, 4));
            } catch (err) {
                console.error("Dashboard metric resolution failed:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50/60 pl-64 transition-all">
            <Sidebar />
            
            <main className="p-8 max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                            Welcome Back, {user?.name || 'User'}!
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-xs font-bold text-green-600 uppercase tracking-wider">System Online</span>
                        </div>
                    </div>
                    {/* Compact Date Display */}
                    <div className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Date</p>
                        <p className="text-sm font-extrabold text-slate-700 mt-0.5">{currentDate}</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center p-24 text-sm text-slate-400 font-bold tracking-wider">
                        Synchronizing enterprise console metrics...
                    </div>
                ) : (
                    <>
                        {/* Metrics Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            
                            {/* Staff Card */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-100/80 flex items-center justify-between shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                                <div>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Staff</p>
                                    <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.emps}</h3>
                                </div>
                                <div className="bg-blue-50 text-blue-600 p-3.5 rounded-xl"><Users size={24}/></div>
                            </div>

                            {/* Departments Card */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-100/80 flex items-center justify-between shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                                <div>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Departments</p>
                                    <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.depts}</h3>
                                </div>
                                <div className="bg-slate-50 text-slate-600 p-3.5 rounded-xl"><Building size={24}/></div>
                            </div>

                            {/* Pending Leaves Card */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-100/80 flex items-center justify-between shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                                <div>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Pending Leaves</p>
                                    <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.leavesPending}</h3>
                                </div>
                                <div className="bg-yellow-50 text-yellow-600 p-3.5 rounded-xl"><FileClock size={24}/></div>
                            </div>

                            {/* Approved Leaves Card */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-100/80 flex items-center justify-between shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                                <div>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Approved Leaves</p>
                                    <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.leavesApproved}</h3>
                                </div>
                                <div className="bg-green-50 text-green-600 p-3.5 rounded-xl"><CalendarCheck size={24}/></div>
                            </div>

                        </div>

                        {/* Interactive Main Body Split Area */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            
                            {/* Left Side: Recent Leaves Feed Table */}
                            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
                                <div>
                                    <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                                        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                                            <Activity size={18} className="text-blue-600" /> Recent Leave Activity
                                        </h3>
                                        <button 
                                            onClick={() => navigate('/leaves')}
                                            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline transition"
                                        >
                                            View All <ChevronRight size={14} />
                                        </button>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50/50 uppercase text-[10px] font-black tracking-wider text-slate-400 border-b border-slate-100">
                                                <tr>
                                                    {user?.role === 'Admin' && <th className="p-4">Employee</th>}
                                                    <th className="p-4">Type</th>
                                                    <th className="p-4">Duration</th>
                                                    <th className="p-4">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {recentLeaves.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={user?.role === 'Admin' ? 4 : 3} className="p-8 text-center text-sm text-slate-400 font-medium">
                                                            No recent leave requests found.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    recentLeaves.map(l => (
                                                        <tr key={l.id} className="hover:bg-slate-50/30 text-sm">
                                                            {user?.role === 'Admin' && (
                                                                <td className="p-4 font-bold text-slate-800">
                                                                    {l.Employee?.name || 'Employee'}
                                                                </td>
                                                            )}
                                                            <td className="p-4 font-semibold text-slate-600">{l.leaveType}</td>
                                                            <td className="p-4 text-xs text-slate-500">{l.startDate} to {l.endDate}</td>
                                                            <td className="p-4">
                                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                                    l.status === 'Approved' ? 'bg-green-50 text-green-700' : 
                                                                    l.status === 'Rejected' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'
                                                                }`}>
                                                                    {l.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Quick Action Administration Links */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                                <div>
                                    <h3 className="text-base font-extrabold text-slate-900 mb-5 flex items-center gap-2">
                                        Admin Actions
                                    </h3>
                                    
                                    <div className="space-y-3">
                                        <button 
                                            onClick={() => navigate('/employees')}
                                            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition text-left group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition"><Users size={16} /></span>
                                                <div className="leading-tight">
                                                    <h4 className="text-sm font-bold text-slate-800">Manage Staff</h4>
                                                    <p className="text-[10px] text-slate-400 mt-0.5">Register new employees</p>
                                                </div>
                                            </div>
                                            <ArrowUpRight size={16} className="text-slate-300 group-hover:text-blue-500 transition" />
                                        </button>

                                        <button 
                                            onClick={() => navigate('/payroll')}
                                            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-emerald-100 hover:bg-emerald-50/30 transition text-left group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-100 transition"><Wallet size={16} /></span>
                                                <div className="leading-tight">
                                                    <h4 className="text-sm font-bold text-slate-800">Post Payroll</h4>
                                                    <p className="text-[10px] text-slate-400 mt-0.5">Compile monthly pay slips</p>
                                                </div>
                                            </div>
                                            <ArrowUpRight size={16} className="text-slate-300 group-hover:text-emerald-500 transition" />
                                        </button>

                                        <button 
                                            onClick={() => navigate('/departments')}
                                            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition text-left group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="p-2 bg-slate-100 text-slate-600 rounded-lg group-hover:bg-slate-200 transition"><Building size={16} /></span>
                                                <div className="leading-tight">
                                                    <h4 className="text-sm font-bold text-slate-800">Setup Departments</h4>
                                                    <p className="text-[10px] text-slate-400 mt-0.5">Add operational teams</p>
                                                </div>
                                            </div>
                                            <ArrowUpRight size={16} className="text-slate-300 group-hover:text-slate-600 transition" />
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-6 pt-5 border-t border-slate-50 flex items-center justify-between text-xs font-semibold text-slate-400 leading-none select-none">
                                    <div className="flex items-center gap-1.5"><Plus size={14} className="text-blue-500" /> Auto-Sync Active</div>
                                </div>
                            </div>

                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default Dashboard;