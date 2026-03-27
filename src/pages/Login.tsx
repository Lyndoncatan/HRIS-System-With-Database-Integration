import { useState, type FC, type FormEvent } from 'react';
import { User, Lock, Eye, EyeOff, ArrowRight, Shield, Mail } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, type UserRole } from '../context/AuthContext';

import logo from '../assets/logo.svg';

const Login: FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loginMode, setLoginMode] = useState<UserRole>('user');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();
    const { setRole, signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            let result;
            if (isSignUp) {
                result = await signUpWithEmail(email, password);
            } else {
                result = await signInWithEmail(email, password);
            }

            if (result.error) {
                setError(result.error);
                setIsLoading(false);
                return;
            }

            setRole(loginMode);

            if (isSignUp) {
                setError(null);
                setIsLoading(false);
                alert('Account created! Please check your email to confirm, then sign in.');
                setIsSignUp(false);
                return;
            }

            // Successful login
            setTimeout(() => {
                navigate('/dashboard');
            }, 600);
        } catch {
            setError('An unexpected error occurred. Please try again.');
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError(null);
        setRole(loginMode);
        const result = await signInWithGoogle();
        if (result.error) {
            setError(result.error);
        }
        // Google OAuth will redirect the browser, so no navigate() needed
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
                            <h2 className="text-2xl font-bold text-orange-400 mb-1">
                                {isSignUp ? 'Create Account' : 'Welcome Back'}
                            </h2>
                            <p className="text-emerald-200/60 text-sm">
                                {isSignUp ? 'Sign up to get started' : 'Sign in to continue to your dashboard'}
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-400/30 text-red-200 text-sm">
                                {error}
                            </div>
                        )}

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
                            {/* Email */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-emerald-200/70 uppercase tracking-wider">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-300/50" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/15 rounded-xl text-white placeholder-emerald-300/30 focus:outline-none focus:border-emerald-400/50 focus:bg-white/15 focus:ring-1 focus:ring-emerald-400/20 transition-all text-sm"
                                        placeholder="Enter your email"
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
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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
                            {!isSignUp && (
                                <div className="flex items-center justify-between pt-1">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="w-3.5 h-3.5 rounded border-white/30 bg-white/10 text-emerald-500 focus:ring-emerald-400/30" />
                                        <span className="text-xs text-emerald-200/60">Remember me</span>
                                    </label>
                                    <Link to="/forgot-password" className="text-xs font-medium text-emerald-300/70 hover:text-emerald-200 transition-colors">
                                        Forgot Password?
                                    </Link>
                                </div>
                            )}

                            {/* Login / Sign Up Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3.5 text-sm font-bold rounded-xl text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-transparent shadow-lg shadow-emerald-900/30 transform transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        {isSignUp ? 'Create Account' : 'Sign In'}
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-3 my-5">
                            <div className="flex-1 h-px bg-white/15" />
                            <span className="text-xs text-emerald-300/40 uppercase tracking-wider">or</span>
                            <div className="flex-1 h-px bg-white/15" />
                        </div>

                        {/* Google Sign-In */}
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full py-3 text-sm font-semibold rounded-xl text-white bg-white/10 border border-white/15 hover:bg-white/20 transition-all flex items-center justify-center gap-3"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </button>

                        {/* Toggle Sign Up / Sign In */}
                        <p className="text-center text-sm text-emerald-200/60 mt-5">
                            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                            <button
                                type="button"
                                onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
                                className="text-orange-400 font-semibold hover:text-orange-300 transition-colors"
                            >
                                {isSignUp ? 'Sign In' : 'Sign Up'}
                            </button>
                        </p>

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
