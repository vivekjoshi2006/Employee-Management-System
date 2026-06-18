import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, Building, CalendarDays, Users, 
  Wallet, Clock, LogOut, ShieldAlert, UserCheck 
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItemClass = ({ isActive }) => `
    flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 select-none
    ${isActive 
      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10' 
      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
    }
  `;

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed top-0 bottom-0 left-0 z-30 shadow-sm">
      {/* Brand logo container */}
      <div className="p-6 border-b border-gray-50 flex items-center gap-2">
        <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-xl text-white">
          <UserCheck size={20} />
        </div>
        <h1 className="text-xl font-black text-gray-950 tracking-tight">
          EMS<span className="text-blue-600"> PRO</span>
        </h1>
      </div>

      {/* User meta widget */}
      <div className="px-6 py-5 border-b border-gray-50/50">
        <div className="flex items-center gap-3 bg-gray-50 pl-3 pr-4 py-2.5 rounded-2xl border border-gray-100">
          <div className="w-10 h-10 bg-blue-100 text-blue-700 flex items-center justify-center font-bold rounded-xl text-sm shadow-inner uppercase">
            {user?.name ? user.name.slice(0, 2) : 'EM'}
          </div>
          <div className="leading-tight overflow-hidden">
            <h4 className="text-sm font-extrabold text-gray-800 truncate">{user?.name}</h4>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Scrolling Link List */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <NavLink to="/dashboard" className={navItemClass}>
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>

        {user?.role === 'Admin' ? (
          <>
            <NavLink to="/departments" className={navItemClass}>
              <Building size={18} /> Departments
            </NavLink>
            <NavLink to="/leaves" className={navItemClass}>
              <CalendarDays size={18} /> Leave Requests
            </NavLink>
            <NavLink to="/employees" className={navItemClass}>
              <Users size={18} /> Employees
            </NavLink>
            <NavLink to="/payroll" className={navItemClass}>
              <Wallet size={18} /> Payroll Management
            </NavLink>
            <NavLink to="/attendance" className={navItemClass}>
              <Clock size={18} /> Attendance Records
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/leaves" className={navItemClass}>
              <CalendarDays size={18} /> Apply for Leaves
            </NavLink>
            <NavLink to="/attendance" className={navItemClass}>
              <Clock size={18} /> Punch Attendance
            </NavLink>
          </>
        )}
      </nav>

      {/* Bottom control widget */}
      <div className="p-4 border-t border-gray-50">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition duration-150"
        >
          <LogOut size={18} /> Log Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;