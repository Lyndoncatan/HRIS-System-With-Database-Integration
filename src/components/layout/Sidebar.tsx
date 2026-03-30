
import {
    Home, Users, Clock, FileText, PhilippinePeso, Shield,
    Package, Settings, ChevronLeft, ChevronRight, LogOut,
    Newspaper, BarChart3, Building2, HelpCircle, X
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.svg';

interface SidebarProps {
    isMobileOpen?: boolean;
    onClose?: () => void;
    collapsed?: boolean;
    onToggleCollapse?: () => void;
}

const Sidebar = ({ isMobileOpen, onClose, collapsed = false, onToggleCollapse }: SidebarProps) => {
    const { role, logout, user } = useAuth();

    // Extract user info from Supabase
    const userMeta = user?.user_metadata;
    const avatarUrl = userMeta?.avatar_url || userMeta?.picture || null;
    const displayName = userMeta?.full_name || userMeta?.name || user?.email?.split('@')[0] || (role === 'admin' ? 'Admin' : 'Employee');
    const userEmail = user?.email || '';

    const handleLogout = async () => {
        await logout();
    };

    const mainNav = [{ icon: Home, label: 'Dashboard', path: '/dashboard' }];

    const hrNav = [
        { icon: Users, label: 'Employee Management', path: '/dashboard/personal-records' },
        { icon: Clock, label: 'Attendance Log', path: '/dashboard/attendance' },
        { icon: FileText, label: 'Leave Management', path: '/dashboard/leave' },
        { icon: PhilippinePeso, label: 'Payroll', path: '/dashboard/payroll' },
        { icon: Shield, label: 'Government Compliance', path: '/dashboard/compliance' },
    ];

    const userNav = [
        { icon: Newspaper, label: 'Company News', path: '/dashboard/company-news' },
        { icon: Clock, label: 'Attendance Log', path: '/dashboard/my-attendance' },
        { icon: FileText, label: 'My Leaves', path: '/dashboard/my-leave' },
        { icon: PhilippinePeso, label: 'My Pay Slips', path: '/dashboard/my-payslips' },
        { icon: BarChart3, label: 'My Performance', path: '/dashboard/my-performance' },
        { icon: Building2, label: 'Company Directory', path: '/dashboard/company-directory' },
        { icon: HelpCircle, label: 'Help & Support', path: '/dashboard/help-support' },
    ];

    const moduleNav = [{ icon: Package, label: 'Asset Management', path: '/dashboard/assets' }];
    const systemNav = [{ icon: Settings, label: 'Admin Settings', path: '/dashboard/settings' }];

    const NavSection = ({ title, items }: { title: string; items: any[] }) => (
        <div className="mb-2">
            {!collapsed && (
                <p className="px-4 mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-emerald-300/50">
                    {title}
                </p>
            )}
            {items.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => window.innerWidth < 1024 && onClose?.()}
                    className={({ isActive }) =>
                        `group flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${isActive
                            ? 'bg-white/15 text-white shadow-lg shadow-black/10'
                            : 'text-emerald-100/70 hover:bg-white/8 hover:text-white'
                        } ${collapsed ? 'justify-center px-0' : ''}`
                    }
                >
                    {({ isActive }) => (
                        <>
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-emerald-400 rounded-r-full" />
                            )}
                            <item.icon className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${isActive ? 'text-emerald-400' : 'text-emerald-200/60 group-hover:text-emerald-300'}`} />
                            {!collapsed && <span className="truncate">{item.label}</span>}
                        </>
                    )}
                </NavLink>
            ))}
        </div>
    );

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            <div
                className={`h-screen flex flex-col fixed left-0 top-0 z-50 transition-all duration-300 
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
                ${collapsed ? 'w-[72px]' : 'w-[260px]'}`}
                style={{ background: 'linear-gradient(180deg, #064e3b 0%, #065f46 40%, #047857 100%)' }}
            >
                <div className={`px-4 pt-5 pb-4 border-b border-white/10 flex items-center justify-between ${collapsed ? 'px-3' : ''}`}>
                    <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
                        <div className="w-10 h-10 rounded-xl bg-white/10 p-1.5 flex-shrink-0">
                            <img src={logo} alt="Logo" className="w-full h-full" />
                        </div>
                        {!collapsed && (
                            <div className="animate-fade-in">
                                <p className="text-white text-sm font-bold leading-tight tracking-wide">SimpleVia</p>
                                <p className="text-emerald-300/60 text-[10px] leading-tight">HRIS Platform</p>
                            </div>
                        )}
                    </div>
                    {/* Mobile Close Button */}
                    <button onClick={onClose} className="lg:hidden text-white/70 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 py-4 overflow-y-auto space-y-1 no-scrollbar">
                    <NavSection title="Main" items={mainNav} />
                    {role === 'admin' ? (
                        <>
                            <NavSection title="Human Resources" items={hrNav} />
                            <NavSection title="Modules" items={moduleNav} />
                            <NavSection title="System" items={systemNav} />
                        </>
                    ) : (
                        <NavSection title="My Pages" items={userNav} />
                    )}
                </nav>

                <div className="border-t border-white/10 p-3 space-y-2">
                    {/* User Profile */}
                    {!collapsed && (
                        <div className="flex items-center gap-3 px-2 py-2">
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt={displayName}
                                    className="w-9 h-9 rounded-xl object-cover flex-shrink-0"
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                    {displayName.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="min-w-0">
                                <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 ${role === 'admin' ? 'bg-amber-400/20 text-amber-300' : 'bg-emerald-400/20 text-emerald-300'}`}>
                                    {role === 'admin' ? 'Administrator' : 'Employee'}
                                </span>
                                <p className="text-white text-xs font-semibold truncate">{displayName}</p>
                                <p className="text-emerald-300/50 text-[10px] truncate">{userEmail}</p>
                            </div>
                        </div>
                    )}
                    {collapsed && (
                        <div className="flex justify-center py-1">
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt={displayName}
                                    className="w-8 h-8 rounded-xl object-cover"
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-white text-xs font-bold">
                                    {displayName.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        onClick={onToggleCollapse}
                        className="hidden lg:flex w-full items-center justify-center gap-2 px-3 py-2 rounded-xl text-emerald-200/60 hover:bg-white/8 hover:text-white transition-all text-xs font-medium"
                    >
                        {collapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /><span>Collapse</span></>}
                    </button>

                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-rose-500/30 text-white hover:bg-rose-500/20 transition-all text-sm font-semibold ${collapsed ? 'justify-center px-0' : 'px-4'}`}
                    >
                        <LogOut className="w-[18px] h-[18px] text-rose-400" />
                        {!collapsed && <span>Log Out</span>}
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;