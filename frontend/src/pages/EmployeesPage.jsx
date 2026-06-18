import React, { useEffect, useState, useContext } from 'react';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import { UserPlus, Trash2, Edit2 } from 'lucide-react';

const EmployeesPage = () => {
    const { user } = useContext(AuthContext);
    const [employees, setEmployees] = useState([]);
    const [depts, setDepts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    
    const [formData, setFormData] = useState({
        name: '', email: '', username: '', password: '', role: 'Employee', salary: 0,
        phone: '', address: '', country: '', state: '', city: '', dob: '', deptId: ''
    });

    const loadData = async () => {
        try {
            const [empRes, deptRes] = await Promise.all([API.get('/employees'), API.get('/departments')]);
            setEmployees(empRes.data.data || empRes.data || []);
            setDepts(deptRes.data.data || deptRes.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { loadData(); }, []);

    const openAddModal = () => {
        setIsEditMode(false);
        setFormData({
            name: '', email: '', username: '', password: '', role: 'Employee', salary: 0,
            phone: '', address: '', country: '', state: '', city: '', dob: '', deptId: ''
        });
        setIsModalOpen(true);
    };

    const openEditModal = (emp) => {
        setIsEditMode(true);
        setSelectedId(emp.id);
        setFormData({
            name: emp.name,
            email: emp.email,
            username: emp.username,
            password: '', // Leave blank unless changing
            role: emp.role,
            salary: emp.salary,
            phone: emp.phone || '',
            address: emp.address || '',
            country: emp.country || '',
            state: emp.state || '',
            city: emp.city || '',
            dob: emp.dob || '',
            deptId: emp.deptId || ''
        });
        setIsModalOpen(true);
    };

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                // If password input is empty, delete it from payload so it doesn't get updated
                const payload = { ...formData };
                if (!payload.password || payload.password.trim() === '') {
                    delete payload.password;
                }
                await API.put(`/employees/${selectedId}`, payload);
                alert("Employee profile updated!");
            } else {
                const registrationPrefix = `${new Date().getFullYear()}/EMP/000${employees.length + 1}`;
                await API.post('/employees/add', { ...formData, empIdStr: registrationPrefix });
                alert("Employee profile created!");
            }
            setIsModalOpen(false);
            loadData();
        } catch (err) {
            alert("Action failed.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Remove employee permanently?")) {
            await API.delete(`/employees/${id}`);
            loadData();
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 pl-64">
            <Sidebar />
            <main className="p-8 max-w-7xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900">Employees Directory</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Manage and record details for all company profiles.</p>
                    </div>
                    {user?.role === 'Admin' && (
                        <button onClick={openAddModal} className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 text-sm shadow hover:bg-blue-700 transition">
                            <UserPlus size={16} /> Add Employee
                        </button>
                    )}
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase">
                            <tr>
                                <th className="p-4">Emp ID</th>
                                <th className="p-4">Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Salary</th>
                                {user?.role === 'Admin' && <th className="p-4 text-center">Action</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {employees.map(emp => (
                                <tr key={emp.id} className="hover:bg-slate-50/50">
                                    <td className="p-4 text-xs font-bold text-blue-600">{emp.empIdStr}</td>
                                    <td className="p-4 font-bold text-gray-800">{emp.name}</td>
                                    <td className="p-4 text-sm text-gray-500">{emp.email}</td>
                                    <td className="p-4 text-sm">{emp.role}</td>
                                    <td className="p-4 font-bold text-sm">Rs. {emp.salary}</td>
                                    {user?.role === 'Admin' && (
                                        <td className="p-4 flex justify-center gap-1">
                                            <button onClick={() => openEditModal(emp)} className="text-blue-600 p-1.5 rounded-full hover:bg-blue-50 transition">
                                                <Edit2 size={16}/>
                                            </button>
                                            <button onClick={() => handleDelete(emp.id)} className="text-red-500 p-1.5 rounded-full hover:bg-red-50 transition">
                                                <Trash2 size={16}/>
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? "Edit Employee Profile" : "Add New Employee"}>
                <form onSubmit={handleCreateOrUpdate} className="space-y-4 max-h-[75vh] overflow-y-auto px-1">
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Full Name" value={formData.name} required className="border p-2.5 rounded-xl text-sm outline-none" onChange={e => setFormData({...formData, name: e.target.value})} />
                        <input type="email" placeholder="Email Address" value={formData.email} required className="border p-2.5 rounded-xl text-sm outline-none" onChange={e => setFormData({...formData, email: e.target.value})} />
                        <input type="text" placeholder="Username" value={formData.username} required className="border p-2.5 rounded-xl text-sm outline-none" onChange={e => setFormData({...formData, username: e.target.value})} />
                        <input type="password" placeholder={isEditMode ? "Password (Leave blank to keep old)" : "Password"} required={!isEditMode} className="border p-2.5 rounded-xl text-sm outline-none" onChange={e => setFormData({...formData, password: e.target.value})} />
                        <input type="text" placeholder="Phone/Tel" value={formData.phone} className="border p-2.5 rounded-xl text-sm outline-none" onChange={e => setFormData({...formData, phone: e.target.value})} />
                        <input type="date" placeholder="Date of Birth" value={formData.dob} className="border p-2.5 rounded-xl text-sm outline-none" onChange={e => setFormData({...formData, dob: e.target.value})} />
                        <input type="text" placeholder="Country" value={formData.country} className="border p-2.5 rounded-xl text-sm outline-none" onChange={e => setFormData({...formData, country: e.target.value})} />
                        <input type="text" placeholder="State" value={formData.state} className="border p-2.5 rounded-xl text-sm outline-none" onChange={e => setFormData({...formData, state: e.target.value})} />
                        <input type="text" placeholder="City" value={formData.city} className="border p-2.5 rounded-xl text-sm outline-none" onChange={e => setFormData({...formData, city: e.target.value})} />
                        <input type="number" placeholder="Salary" value={formData.salary} className="border p-2.5 rounded-xl text-sm outline-none" onChange={e => setFormData({...formData, salary: parseFloat(e.target.value) || 0})} />
                        <select className="border p-2.5 rounded-xl text-sm bg-white outline-none" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                            <option value="Employee">Employee</option>
                            <option value="Admin">Admin</option>
                        </select>
                        <select className="border p-2.5 rounded-xl text-sm bg-white outline-none" required value={formData.deptId} onChange={e => setFormData({...formData, deptId: e.target.value})}>
                            <option value="">Select Department</option>
                            {depts.map(d => <option key={d.id} value={d.id}>{d.dept_name}</option>)}
                        </select>
                    </div>
                    <textarea placeholder="Home Address" value={formData.address} className="w-full border p-2.5 rounded-xl text-sm h-16 outline-none" onChange={e => setFormData({...formData, address: e.target.value})}></textarea>
                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl">{isEditMode ? "Save Changes" : "Register Employee"}</button>
                </form>
            </Modal>
        </div>
    );
};

export default EmployeesPage;