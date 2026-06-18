import React, { useEffect, useState, useContext } from 'react';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const DepartmentsPage = () => {
    const { user } = useContext(AuthContext);
    const [depts, setDepts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [status, setStatus] = useState('Active');

    const fetchDepts = async () => {
        try {
            const res = await API.get('/departments');
            setDepts(res.data.data || res.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { fetchDepts(); }, []);

    const openAddModal = () => {
        setIsEditMode(false);
        setName('');
        setDesc('');
        setStatus('Active');
        setIsModalOpen(true);
    };

    const openEditModal = (dept) => {
        setIsEditMode(true);
        setSelectedId(dept.id);
        setName(dept.dept_name);
        setDesc(dept.description);
        setStatus(dept.status);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await API.put(`/departments/${selectedId}`, { dept_name: name, description: desc, status });
                alert("Department updated successfully!");
            } else {
                await API.post('/departments', { dept_name: name, description: desc, status });
                alert("Department created successfully!");
            }
            setIsModalOpen(false);
            fetchDepts();
        } catch (err) {
            alert("Action failed.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Permanently delete this department?")) {
            try {
                await API.delete(`/departments/${id}`);
                fetchDepts();
            } catch (err) {
                alert("Deletion failed.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 pl-64">
            <Sidebar />
            <main className="p-8 max-w-7xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900">Departments</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Manage operational business departments.</p>
                    </div>
                    {user?.role === 'Admin' && (
                        <button 
                            onClick={openAddModal}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm shadow transition"
                        >
                            <Plus size={16} /> Add Department
                        </button>
                    )}
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase">
                            <tr>
                                <th className="p-4">Department Name</th>
                                <th className="p-4">Description</th>
                                <th className="p-4">Status</th>
                                {user?.role === 'Admin' && <th className="p-4 text-center">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {depts.map(d => (
                                <tr key={d.id} className="hover:bg-slate-50/50">
                                    <td className="p-4 font-bold text-gray-800">{d.dept_name}</td>
                                    <td className="p-4 text-sm text-gray-500">{d.description || '--'}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                            d.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                        }`}>
                                            {d.status}
                                        </span>
                                    </td>
                                    {user?.role === 'Admin' && (
                                        <td className="p-4 flex justify-center gap-2">
                                            <button onClick={() => openEditModal(d)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-full transition"><Edit2 size={15}/></button>
                                            <button onClick={() => handleDelete(d.id)} className="text-red-600 hover:bg-red-50 p-1.5 rounded-full transition"><Trash2 size={15}/></button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? "Edit Department" : "Add New Department"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500">Department Name</label>
                        <input type="text" value={name} required className="w-full border rounded-xl p-2.5 text-sm outline-none focus:border-blue-500" onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500">Description</label>
                        <textarea value={desc} className="w-full border rounded-xl p-2.5 text-sm outline-none focus:border-blue-500 h-24" onChange={e => setDesc(e.target.value)}></textarea>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500">Status</label>
                        <select value={status} className="w-full border rounded-xl p-2.5 bg-white text-sm outline-none" onChange={e => setStatus(e.target.value)}>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl transition">{isEditMode ? "Save Changes" : "Submit"}</button>
                </form>
            </Modal>
        </div>
    );
};

export default DepartmentsPage;