import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import API from '../api/axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [roleMode, setRoleMode] = useState('Admin'); 
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false); 
    const [loading, setLoading] = useState(false);
    const { loginUser } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const savedEmail = localStorage.getItem('saved_email');
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await API.post('/auth/login', { email, password, requestedRole: roleMode });
            
            if (rememberMe) {
                localStorage.setItem('saved_email', email);
            } else {
                localStorage.removeItem('saved_email');
            }

            loginUser(res.data.user, res.data.token);
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.message || "Authentication failed. Please verify credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex h-screen items-center justify-center bg-gradient-to-tr from-slate-100 via-slate-50 to-blue-50/40 px-4 overflow-hidden select-none">
            
            {/* Background Decorative Glow Blobs */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Glassmorphic Login Card */}
            <div className="relative w-full max-w-md bg-white/90 backdrop-blur-xl p-10 rounded-[32px] shadow-[0_32px_64px_-16px_rgba(15,23,42,0.06)] border border-white">
                
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex bg-gradient-to-tr from-blue-50 to-indigo-50 text-blue-600 p-3 rounded-2xl border border-blue-100/50 mb-3.5 shadow-inner">
                        <ShieldCheck size={28} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                        EMS PORTAL
                    </h2>
                    <p className="text-[15px] text-blue-600 font-extrabold uppercase tracking-widest mt-2">
                        Enterprise Access Systems
                    </p>
                </div>

                {/* Styled Role Toggle Switcher */}
                <div className="relative grid grid-cols-2 p-1 bg-slate-100/80 rounded-2xl mb-8 border border-slate-200/50">
                    <button 
                        type="button" 
                        onClick={() => setRoleMode('Admin')}
                        className={`relative py-2.5 rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-300 ${
                            roleMode === 'Admin' 
                            ? 'bg-white text-blue-600 shadow-[0_4px_12px_rgba(37,99,235,0.08)]' 
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        Administrator
                    </button>
                    <button 
                        type="button" 
                        onClick={() => setRoleMode('Employee')}
                        className={`relative py-2.5 rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-300 ${
                            roleMode === 'Employee' 
                            ? 'bg-white text-blue-600 shadow-[0_4px_12px_rgba(37,99,235,0.08)]' 
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        Employee Portal
                    </button>
                </div>

                {/* Form Elements */}
                <form onSubmit={handleLogin} className="space-y-5">
                    
                    {/* Email Input */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                                <Mail size={16} />
                            </span>
                            <input 
                                type="email" 
                                value={email}
                                placeholder="name@company.com" 
                                className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-2xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm text-slate-800"
                                required 
                                onChange={e => setEmail(e.target.value)} 
                            />
                        </div>
                    </div>

                    {/* Password Input with Show/Hide Toggle */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                            Password
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                                <Lock size={16} />
                            </span>
                            <input 
                                type={showPassword ? "text" : "password"}
                                value={password}
                                placeholder="••••••••" 
                                className="w-full pl-11 pr-12 py-3 bg-slate-50/50 border border-slate-200/60 rounded-2xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm text-slate-800"
                                required 
                                onChange={e => setPassword(e.target.value)} 
                            />
                            {/* Toggle visibility icon */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 transition"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Meta Controls */}
                    <div className="flex items-center justify-between py-1 px-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={rememberMe}
                                className="rounded-lg border-slate-200 text-blue-600 focus:ring-blue-500/20 cursor-pointer h-4 w-4 transition" 
                                onChange={e => setRememberMe(e.target.checked)} 
                            />
                            <span className="text-xs text-slate-500 font-bold">Remember me</span>
                        </label>
                        <span className="text-xs text-blue-600 font-extrabold hover:underline cursor-pointer hover:text-blue-700 transition">
                            Forgot Password?
                        </span>
                    </div>

                    {/* Submit Access Trigger */}
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-2xl font-black text-sm tracking-wider uppercase hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-600/10 hover:shadow-blue-600/20 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none mt-2"
                    >
                        {loading ? "Authenticating..." : "Access Dashboard"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;