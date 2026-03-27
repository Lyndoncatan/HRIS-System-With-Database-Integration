import { Bell, Search, ChevronRight, Check, Trash2, Menu } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLeave } from '../../context/LeaveContext';

const routeLabels: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/dashboard/personal-records': 'Employee Management',
    '/dashboard/attendance': 'Attendance Log',
    '/dashboard/my-attendance': 'Attendance Log',
    '/dashboard/leave': 'Leave Management',
    '/dashboard/my-leave': 'My Leaves',
    '/dashboard/payroll': 'Payroll',
    '/dashboard/compliance': 'Government Compliance',
    '/dashboard/self-service': 'Employee Self-Service',
    '/dashboard/assets': 'Asset Management',
    '/dashboard/clearance': 'Clearance',
    '/dashboard/hris': 'HRIS System',
    '/dashboard/settings': 'Admin Settings',
    '/dashboard/company-news': 'Company News',
    '/dashboard/my-payslips': 'My Pay Slips',
    '/dashboard/my-performance': 'My Performance',
    '/dashboard/company-directory': 'Company Directory',
    '/dashboard/help-support': 'Help & Support',
};

interface TopBarProps {
    onMenuClick?: () => void;
}

const TopBar = ({ onMenuClick }: TopBarProps) => {
    const [time, setTime] = useState(new Date());
    const location = useLocation();
    const { role, user } = useAuth();

    // Extract user info from Supabase
    const userMeta = user?.user_metadata;
    const avatarUrl = userMeta?.avatar_url || userMeta?.picture || null;
    const displayName = userMeta?.full_name || userMeta?.name || user?.email?.split('@')[0] || (role === 'admin' ? 'Admin' : 'Employee');
    const userEmail = user?.email || '';

    const { notifications: leaveNotifications, markNotificationRead, clearNotifications } = useLeave();
    const [showNotifications, setShowNotifications] = useState(false);
    const [systemNotifications, setSystemNotifications] = useState([
        { id: 1, title: 'New Leave Request', message: 'Juan Dela Cruz submitted a leave request.', time: '2 mins ago', read: false, type: 'leave', path: '/dashboard/leave' },
        { id: 2, title: 'Payroll Processed', message: 'Payroll for Feb 1-15 has been successfully processed.', time: '1 hour ago', read: false, type: 'payroll', path: '/dashboard/payroll' },
        { id: 3, title: 'System Update', message: 'System maintenance at 12:00 AM.', time: '5 hours ago', read: true, type: 'system', path: '/dashboard/settings' },
        { id: 4, title: 'Compliance Update', message: 'New Government Reporting requirements added.', time: '1 day ago', read: false, type: 'system', path: '/dashboard/compliance' },
    ]);

    const navigate = useNavigate();
    const notifRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);

        const handleStorageChange = () => {
            const newNotif = localStorage.getItem('attendance_notification');
            if (newNotif) {
                const parsed = JSON.parse(newNotif);
                setSystemNotifications(prev => {
                    if (prev.find(n => n.id === parsed.id)) return prev;
                    return [{ ...parsed, read: false, path: role === 'admin' ? '/dashboard/attendance' : '/dashboard/my-attendance' }, ...prev];
                });
                localStorage.removeItem('attendance_notification');
            }
        };

        window.addEventListener('storage', handleStorageChange);
        const checkInterval = setInterval(handleStorageChange, 2000);

        return () => {
            clearInterval(timer);
            clearInterval(checkInterval);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [role]);

    // Close notifications when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // FIXED: Dynamic path based on user role
    const leaveNotifsMapped = leaveNotifications.map(n => ({
        id: n.id + 100000,
        title: n.type === 'success' ? 'Leave Approved' : n.type === 'danger' ? 'Leave Denied' : 'Leave Update',
        message: n.message,
        time: n.timestamp,
        read: n.read,
        type: 'leave' as string,
        path: role === 'admin' ? '/dashboard/leave' : '/dashboard/my-leave', // <-- Admin goes to /leave, Employee goes to /my-leave
        isLeaveNotif: true,
        originalId: n.id,
    }));

    const allNotifications = [...leaveNotifsMapped, ...systemNotifications].sort((a, b) => {
        if (!a.read && b.read) return -1;
        if (a.read && !b.read) return 1;
        return 0;
    });

    const unreadCount = allNotifications.filter(n => !n.read).length;

    const markAllAsRead = () => {
        setSystemNotifications(prev => prev.map(n => ({ ...n, read: true })));
        clearNotifications();
    };

    const markAsRead = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const leaveNotif = leaveNotifsMapped.find(n => n.id === id);
        if (leaveNotif) {
            markNotificationRead(leaveNotif.originalId);
        } else {
            setSystemNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        }
    };

    const deleteNotification = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const leaveNotif = leaveNotifsMapped.find(n => n.id === id);
        if (leaveNotif) {
            markNotificationRead(leaveNotif.originalId);
        } else {
            setSystemNotifications(prev => prev.filter(n => n.id !== id));
        }
    };

    const handleNotificationClick = (path: string, id: number) => {
        const leaveNotif = leaveNotifsMapped.find(n => n.id === id);
        if (leaveNotif) {
            markNotificationRead(leaveNotif.originalId);
        } else {
            setSystemNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        }
        setShowNotifications(false);
        navigate(path);
    };

    const formatTime = (d: Date) => {
        return d.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (d: Date) => {
        return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    };

    const currentPage = routeLabels[location.pathname] || 'Page';

    return (
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100">
            {/* Left: Mobile Menu Toggle + Breadcrumb */}
            <div className="flex items-center gap-2 sm:gap-3">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-1.5 -ml-1.5 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 text-sm overflow-hidden whitespace-nowrap">
                    <span className="text-gray-400 font-medium hidden sm:block">HRIS</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 hidden sm:block" />
                    <span className="font-semibold text-gray-800 truncate max-w-[150px] xs:max-w-xs">{currentPage}</span>
                </div>
            </div>

            {/* Center: Search + Active badge */}
            <div className="flex items-center gap-4">
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-56 pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-50 transition-all"
                    />
                </div>
                <div className="hidden lg:flex bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse" />
                    245 Active Employees
                </div>
            </div>

            {/* Right: Clock + Notifications + Profile */}
            <div className="flex items-center gap-2 sm:gap-4">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-gray-800 leading-tight">{formatTime(time)}</p>
                    <p className="text-[11px] text-gray-400 leading-tight">{formatDate(time)}</p>
                </div>

                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`relative p-2 rounded-xl transition-colors group ${showNotifications ? 'bg-emerald-50 text-emerald-600' : 'hover:bg-gray-100 text-gray-500'}`}
                    >
                        <Bell className={`h-5 w-5 transition-colors ${showNotifications ? 'text-emerald-600' : 'group-hover:text-gray-700'}`} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
                        )}
                    </button>

                    {/* Notifications Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 sm:-right-2 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-in fade-in slide-in-from-top-4">
                            <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                                <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button onClick={markAllAsRead} className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                                        Mark all as read
                                    </button>
                                )}
                            </div>
                            <div className="max-h-[320px] overflow-y-auto no-scrollbar">
                                {allNotifications.length > 0 ? (
                                    allNotifications.map((n) => (
                                        <div
                                            key={n.id}
                                            onClick={() => handleNotificationClick(n.path || '/dashboard', n.id)}
                                            className={`p-4 border-b border-gray-50 flex gap-3 hover:bg-gray-50 transition-colors cursor-pointer relative group ${!n.read ? 'bg-emerald-50/30' : ''}`}
                                        >
                                            {!n.read && (
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
                                            )}
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${n.type === 'leave' ? 'bg-blue-100 text-blue-600' :
                                                n.type === 'payroll' ? 'bg-emerald-100 text-emerald-600' :
                                                    n.type === 'attendance' ? 'bg-rose-100 text-rose-600' :
                                                        'bg-amber-100 text-amber-600'
                                                }`}>
                                                <Bell className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className={`text-xs font-bold truncate ${n.read ? 'text-gray-700' : 'text-gray-900'}`}>{n.title}</p>
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {!n.read && (
                                                            <button
                                                                onClick={(e) => markAsRead(n.id, e)}
                                                                className="p-1 hover:bg-emerald-100 rounded text-emerald-600"
                                                                title="Mark as read"
                                                            >
                                                                <Check className="w-3 h-3" />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={(e) => deleteNotification(n.id, e)}
                                                            className="p-1 hover:bg-rose-100 rounded text-rose-500"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">{n.message}</p>
                                                <p className="text-[10px] text-gray-400 mt-1.5 font-medium">{n.time}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center">
                                        <p className="text-gray-400 text-xs">No notifications yet</p>
                                    </div>
                                )}
                            </div>
                            <div className="p-3 bg-gray-50/50 text-center border-t border-gray-50">
                                <button className="text-xs font-bold text-gray-500 hover:text-gray-700 transition-colors">
                                    View all notifications
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-gray-200">
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt={displayName}
                            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-cover shadow-sm"
                            referrerPolicy="no-referrer"
                        />
                    ) : (
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                            {displayName.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="hidden lg:block">
                        <p className="text-xs font-semibold text-gray-800 truncate max-w-[140px]">
                            {displayName}
                        </p>
                        <p className="text-[10px] text-gray-400 truncate max-w-[140px]">
                            {userEmail || (role === 'admin' ? 'HR Administrator' : 'Employee')}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopBar;