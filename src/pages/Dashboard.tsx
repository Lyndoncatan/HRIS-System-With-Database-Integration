import { useState } from 'react';
import { Users, UserCheck, UserX, UserPlus, TrendingUp, Clock, FileText, PhilippinePeso, ArrowUpRight, CalendarDays, Star, Briefcase, CheckCircle2, Calendar, Megaphone, Gift, BookOpen } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

/* ─────────────── USER DASHBOARD ─────────────── */
const UserDashboard = () => {
    const navigate = useNavigate();
    const [time] = useState(new Date());

    const statCards = [
        { label: 'Leaves Available', value: '12.5 Days', sub: '8 Vacation, 4.5 Sick', icon: Calendar, gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' },
        { label: 'Current Shift', value: '09:00 AM - 06:00 PM', sub: 'Regular Schedule', icon: Clock, gradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)' },
        { label: 'Next Payday', value: 'Feb 15, 2026', sub: '5 days remaining', icon: PhilippinePeso, gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)' },
        { label: 'Performance Rating', value: '4.6 / 5.0', sub: 'Top 10% in Department', icon: Star, gradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)' },
    ];

    const quickActions = [
        { label: 'Time In/Out', icon: Clock, path: '/dashboard/my-attendance', color: '#059669' },
        { label: 'File a Leave', icon: FileText, path: '/dashboard/my-leave', color: '#2563eb' },
        { label: 'View Payslip', icon: PhilippinePeso, path: '/dashboard/my-payslips', color: '#d97706' },
    ];

    const announcements = [
        { date: 'Feb 14, 2026', title: 'Townhall Meeting', desc: 'Join Us For The Q1 Townhall Meeting This Friday At 3 PM In The Main Conference Room.' },
        { date: 'Jan 25, 2026', title: 'Tax Updates For 2026', desc: 'Please Review The Newly Updated Tax Brackets Sent By The Finance Department.' },
        { date: 'Jan 15, 2026', title: 'Welcome New Hires', desc: 'Say Hello To Our 5 New Software Engineers Who Joined This Month!' },
    ];

    const upcomingEvents = [
        { icon: '🎉', title: 'Company Anniversary Gala', sub: 'Grand Plaza Hotel, 6PM', color: '#dc2626' },
        { icon: '📅', title: 'Quarterly Department Sync', sub: 'Zoom (Virtual), 10AM', color: '#2563eb' },
        { icon: '🧘', title: 'Wellness Friday (Yoga & Smoothies)', sub: 'Main Office Lounge, 3PM', color: '#d97706' },
    ];

    const perks = [
        { icon: '🏥', title: 'Premium Health HMO', desc: 'Access Your Healthcard Details And Dependents Coverage Limits.', color: '#059669' },
        { icon: '🌐', title: 'WFH Connectivity Allowance', desc: 'Learn How To Claim Your Monthly ₱50 Internet Subsidy.', color: '#2563eb' },
        { icon: '📚', title: 'Learning & Development', desc: 'Up To ₱500/Year For Courses And Certifications To Advance Your Career.', color: '#dc2626' },
    ];

    const greeting = () => {
        const h = time.getHours();
        if (h < 12) return 'Good Morning';
        if (h < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <div className="space-y-6 pb-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 rounded-2xl p-6 text-white animate-fade-in-up relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
                <div className="relative z-10">
                    <h1 className="text-2xl font-bold">Welcome back, Rafael! 👋</h1>
                    <p className="text-sm text-emerald-100/80 mt-1">It's a great day to do great work. You have 1 new notification.</p>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card, i) => (
                    <div key={card.label} className="pro-card !p-0 overflow-hidden animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}>
                        <div className="p-4 flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white" style={{ background: card.gradient }}>
                                <card.icon className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{card.label}</p>
                                <p className="text-base font-bold text-gray-800 mt-0.5">{card.value}</p>
                                <p className="text-[11px] text-gray-400 mt-0.5">{card.sub}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions + Announcements */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 space-y-6">
                    {/* Quick Actions */}
                    <div className="grid grid-cols-3 gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
                        {quickActions.map((action) => (
                            <button
                                key={action.label}
                                onClick={() => navigate(action.path)}
                                className="pro-card !p-4 flex items-center gap-3 hover:shadow-lg hover:-translate-y-0.5 transition-all group cursor-pointer"
                            >
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110" style={{ backgroundColor: action.color + '15' }}>
                                    <action.icon className="w-5 h-5" style={{ color: action.color }} />
                                </div>
                                <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900">{action.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* My Tasks & Approvals */}
                    <div className="pro-card p-5 animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
                        <h3 className="text-base font-bold text-gray-800 mb-1">My Tasks & Approvals</h3>
                        <p className="text-xs text-gray-400 mb-4">Currently Have No Pending Tasks Or Items Requiring Your Attention.</p>
                        <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                            <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                            <span className="text-sm font-bold text-gray-700">All Caught Up!</span>
                        </div>
                    </div>
                </div>

                {/* Announcements */}
                <div className="lg:col-span-2 pro-card p-5 animate-fade-in-up" style={{ animationDelay: '0.35s', opacity: 0 }}>
                    <div className="flex items-center gap-2 mb-4">
                        <Megaphone className="w-4 h-4 text-emerald-600" />
                        <h3 className="text-base font-bold text-gray-800">Announcements</h3>
                    </div>
                    <div className="space-y-4">
                        {announcements.map((a, i) => (
                            <div key={i} className="border-l-2 border-emerald-400 pl-3 py-1">
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{a.date}</p>
                                <p className="text-sm font-bold text-gray-800 mt-0.5">{a.title}</p>
                                <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{a.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Upcoming Events + Perks & Benefits */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Events */}
                <div className="pro-card p-5 animate-fade-in-up" style={{ animationDelay: '0.5s', opacity: 0 }}>
                    <h3 className="text-base font-bold text-gray-800 mb-4">Upcoming Events</h3>
                    <div className="space-y-3">
                        {upcomingEvents.map((event, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50/80 hover:bg-gray-100/80 transition-colors cursor-pointer">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 bg-white shadow-sm">
                                    {event.icon}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-800">{event.title}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{event.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Perks & Benefits */}
                <div className="pro-card p-5 animate-fade-in-up" style={{ animationDelay: '0.55s', opacity: 0 }}>
                    <h3 className="text-base font-bold text-gray-800 mb-4">Your Perks & Benefits</h3>
                    <div className="space-y-3">
                        {perks.map((perk, i) => (
                            <div key={i} className="flex items-start gap-4 p-3 rounded-xl bg-gray-50/80 hover:bg-gray-100/80 transition-colors cursor-pointer">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 bg-white shadow-sm">
                                    {perk.icon}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-800">{perk.title}</p>
                                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{perk.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ─────────────── ADMIN DASHBOARD ─────────────── */
const AdminDashboard = () => {
    const [time, setTime] = useState(new Date());

    useState(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    });

    const statCards = [
        { title: 'Total Employees', value: 245, icon: Users, gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', change: '+5.2%' },
        { title: 'Active Employees', value: 235, icon: UserCheck, gradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', change: '+2.1%' },
        { title: 'On Leave', value: 3, icon: UserX, gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)', change: '-1' },
        { title: 'New Hires', value: 18, icon: UserPlus, gradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)', change: '+12' },
    ];

    const attendanceData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            { label: 'Present', data: [220, 225, 230, 228, 232, 235, 230, 228, 233, 231, 229, 235], backgroundColor: '#059669', borderRadius: 6, borderSkipped: false as const },
            { label: 'Late', data: [15, 12, 8, 10, 7, 5, 9, 11, 6, 8, 10, 5], backgroundColor: '#f59e0b', borderRadius: 6, borderSkipped: false as const },
            { label: 'Absent', data: [10, 8, 7, 7, 6, 5, 6, 6, 6, 6, 6, 5], backgroundColor: '#ef4444', borderRadius: 6, borderSkipped: false as const },
        ],
    };

    const attendanceOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'top' as const, labels: { usePointStyle: true, pointStyle: 'circle' as const, padding: 20, font: { size: 12, family: 'Inter', weight: 500 as const } } } },
        scales: {
            x: { grid: { display: false }, ticks: { font: { size: 11, family: 'Inter' }, color: '#94a3b8' } },
            y: { grid: { color: '#f1f5f9' }, ticks: { font: { size: 11, family: 'Inter' }, color: '#94a3b8' }, border: { display: false } },
        },
    };

    const employmentData = {
        labels: ['Regular', 'Probationary', 'Contract'],
        datasets: [{ data: [185, 35, 25], backgroundColor: ['#059669', '#f59e0b', '#3b82f6'], borderWidth: 0, cutout: '70%', spacing: 3 }],
    };

    const employmentOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' as const, labels: { usePointStyle: true, pointStyle: 'circle' as const, padding: 16, font: { size: 12, family: 'Inter', weight: 500 as const } } } },
    };

    const activities = [
        { icon: UserPlus, text: 'New employee Maria Santos was onboarded', time: '2 hours ago', color: '#059669' },
        { icon: Clock, text: 'Attendance report generated for January', time: '4 hours ago', color: '#3b82f6' },
        { icon: FileText, text: 'Leave request approved for Juan Dela Cruz', time: '5 hours ago', color: '#f59e0b' },
        { icon: TrendingUp, text: 'Payroll processing completed for January', time: '1 day ago', color: '#059669' },
        { icon: Users, text: '3 employees completed probationary period', time: '2 days ago', color: '#3b82f6' },
    ];

    const financialBreakdown = [
        { label: 'Basic Salary', amount: '₱6,200,000', percent: 73, color: '#059669' },
        { label: 'Overtime Pay', amount: '₱850,000', percent: 10, color: '#3b82f6' },
        { label: 'Allowances', amount: '₱650,000', percent: 8, color: '#f59e0b' },
        { label: 'Benefits', amount: '₱500,000', percent: 6, color: '#2563eb' },
        { label: 'Deductions', amount: '-₱1,700,000', percent: 20, color: '#ef4444' },
    ];

    const greeting = () => {
        const h = time.getHours();
        if (h < 12) return 'Good Morning';
        if (h < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <div className="space-y-6 pb-6">
            <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 rounded-2xl p-6 text-white animate-fade-in-up relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-1">
                        <CalendarDays className="w-4 h-4 text-emerald-200/80" />
                        <span className="text-xs text-emerald-200/80 font-medium">
                            {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold">{greeting()}, Admin! 👋</h1>
                    <p className="text-sm text-emerald-100/70 mt-1">Here's what's happening with your workforce today.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {statCards.map((card, i) => (
                    <div key={card.title} className="stat-card animate-fade-in-up cursor-pointer group" style={{ background: card.gradient, animationDelay: `${i * 0.1}s`, opacity: 0 }}>
                        <div className="flex items-start justify-between relative z-10">
                            <div>
                                <p className="stat-label">{card.title}</p>
                                <p className="stat-value mt-1">{card.value}</p>
                                <div className="flex items-center gap-1 mt-2">
                                    <ArrowUpRight className="w-3 h-3" />
                                    <span className="text-xs font-semibold opacity-90">{card.change}</span>
                                </div>
                            </div>
                            <div className="stat-icon"><card.icon className="w-5 h-5" /></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 pro-card p-6 animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="text-base font-bold text-gray-800">Attendance Summary</h3>
                            <p className="text-xs text-gray-400 mt-0.5">Monthly attendance overview for 2026</p>
                        </div>
                    </div>
                    <div style={{ height: 320 }}><Bar data={attendanceData} options={attendanceOptions} /></div>
                </div>
                <div className="pro-card p-6 animate-fade-in-up" style={{ animationDelay: '0.5s', opacity: 0 }}>
                    <div className="mb-4">
                        <h3 className="text-base font-bold text-gray-800">Employment Status</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Distribution by type</p>
                    </div>
                    <div style={{ height: 260 }}><Doughnut data={employmentData} options={employmentOptions} /></div>
                    <div className="mt-4 space-y-2">
                        {[{ label: 'Regular', value: 185, color: '#059669' }, { label: 'Probationary', value: 35, color: '#f59e0b' }, { label: 'Contract', value: 25, color: '#3b82f6' }].map((item) => (
                            <div key={item.label} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                                    <span className="text-gray-500">{item.label}</span>
                                </div>
                                <span className="font-semibold text-gray-700">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 pro-card p-6 animate-fade-in-up" style={{ animationDelay: '0.6s', opacity: 0 }}>
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="text-base font-bold text-gray-800">Recent Activities</h3>
                            <p className="text-xs text-gray-400 mt-0.5">Latest events in the system</p>
                        </div>
                    </div>
                    <div className="space-y-1">
                        {activities.map((activity, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50/80 transition-colors group cursor-pointer">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110" style={{ backgroundColor: activity.color + '12' }}>
                                    <activity.icon className="w-4 h-4" style={{ color: activity.color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-700 font-medium">{activity.text}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="pro-card p-6 animate-fade-in-up" style={{ animationDelay: '0.7s', opacity: 0 }}>
                    <div className="mb-5">
                        <h3 className="text-base font-bold text-gray-800">Financial Summary</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Monthly Payroll Overview</p>
                    </div>
                    <div className="mb-5 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                        <div className="flex items-center gap-2 mb-1">
                            <PhilippinePeso className="w-4 h-4 text-emerald-600" />
                            <span className="text-xs text-gray-500 font-medium">Total Payroll</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">₱8,500,000</p>
                    </div>
                    <div className="space-y-4">
                        {financialBreakdown.map((item) => (
                            <div key={item.label}>
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-xs text-gray-500 font-medium">{item.label}</span>
                                    <span className={`text-xs font-bold ${item.amount.startsWith('-') ? 'text-red-500' : 'text-gray-700'}`}>{item.amount}</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-bar-fill" style={{ width: `${item.percent}%`, background: item.color }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ─────────────── MAIN DASHBOARD (ROLE-BASED) ─────────────── */
const Dashboard = () => {
    const { role } = useAuth();
    return role === 'admin' ? <AdminDashboard /> : <UserDashboard />;
};

export default Dashboard;