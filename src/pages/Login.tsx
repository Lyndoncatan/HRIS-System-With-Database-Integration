import { useState, type FC, type FormEvent } from 'react';
import { User, Lock, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, type UserRole } from '../context/AuthContext';

import logo from '../assets/logo.svg';

const Login: FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loginMode, setLoginMode] = useState<UserRole>('user');
    const navigate = useNavigate();
    const { setRole, setIsLoggedIn } = useAuth();

    const handleLogin = (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setRole(loginMode);
        setIsLoggedIn(true);
        setTimeout(() => {
            navigate('/dashboard');
        }, 600);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
            {/* Steady green background */}
            <div
                className="absolute inset-0"
                style={{ background: '#059669' }}
            />

            <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-12 z-10">
                {/* Left Side - Branding */}
                <div className="flex-1 flex flex-col items-center text-center">
                    <div className="mb-8 relative">
                        <div className="absolute inset-0 bg-white/10 rounded-full blur-2xl scale-150" />
                        <img src={logo} alt="SimpleVia Logo" className="w-48 h-48 drop-shadow-2xl relative" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-5xl font-black text-white tracking-wider drop-shadow-lg">
                            SIMPLEVIA
                        </h1>
                        <p className="text-lg text-emerald-200/80 font-light tracking-[0.3em] uppercase">
                            Technologies, Inc
                        </p>
                        <p className="text-sm text-emerald-300/50 mt-4 max-w-xs mx-auto">
                            Human Resource Information System
                        </p>
                    </div>
                </div>

                {/* Right Side - Login Card */}
                <div className="flex-1 w-full max-w-md">
                    <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-orange-400 mb-1">Welcome Back</h2>
                            <p className="text-emerald-200/60 text-sm">Sign in to continue to your dashboard</p>
                        </div>

                        {/* Login Mode Tabs */}
                        <div className="flex rounded-xl bg-white/10 p-1 mb-6">
                            <button
                                type="button"
                                onClick={() => setLoginMode('user')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${loginMode === 'user'
                                    ? 'bg-white text-emerald-700 shadow-md'
                                    : 'text-white/70 hover:text-white'
                                    }`}
                            >
                                <User className="w-4 h-4" />
                                User Login
                            </button>
                            <button
                                type="button"
                                onClick={() => setLoginMode('admin')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${loginMode === 'admin'
                                    ? 'bg-white text-emerald-700 shadow-md'
                                    : 'text-white/70 hover:text-white'
                                    }`}
                            >
                                <Shield className="w-4 h-4" />
                                Admin Login
                            </button>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-5">
                            {/* Username */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-emerald-200/70 uppercase tracking-wider">
                                    Username
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-300/50" />
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/15 rounded-xl text-white placeholder-emerald-300/30 focus:outline-none focus:border-emerald-400/50 focus:bg-white/15 focus:ring-1 focus:ring-emerald-400/20 transition-all text-sm"
                                        placeholder="Enter your username"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-emerald-200/70 uppercase tracking-wider">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-300/50" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="w-full pl-11 pr-12 py-3 bg-white/10 border border-white/15 rounded-xl text-white placeholder-emerald-300/30 focus:outline-none focus:border-emerald-400/50 focus:bg-white/15 focus:ring-1 focus:ring-emerald-400/20 transition-all text-sm"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-white/10 transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-emerald-300/50" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-emerald-300/50" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Remember + Forgot */}
                            <div className="flex items-center justify-between pt-1">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="w-3.5 h-3.5 rounded border-white/30 bg-white/10 text-emerald-500 focus:ring-emerald-400/30" />
                                    <span className="text-xs text-emerald-200/60">Remember me</span>
                                </label>
                                <Link to="/forgot-password" className="text-xs font-medium text-emerald-300/70 hover:text-emerald-200 transition-colors">
                                    Forgot Password?
                                </Link>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3.5 text-sm font-bold rounded-xl text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-transparent shadow-lg shadow-emerald-900/30 transform transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Footer */}
                        <p className="text-center text-[10px] text-emerald-300/30 mt-6">
                            Powered by SimpleVia Technologies, Inc. © 2026
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
