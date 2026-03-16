import { User, FileText, Clock, Calendar, Download, Eye, Edit, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLeave } from '../../context/LeaveContext';

const CURRENT_USER = 'Dela Cruz, Juan';

const EmployeeSelfService = () => {
    const navigate = useNavigate();
    const { leaveRequests } = useLeave();

    const profile = {
        name: 'Juan Dela Cruz',
        id: 'EMP-001',
        position: 'Admin Officer',
        department: 'Administration',
        email: 'juan.delacruz@simplevia.com',
        phone: '+63 912 345 6789',
        hireDate: 'January 15, 2024',
        status: 'Active',
    };

    const recentAttendance = [
        { date: 'Feb 18, 2026', time: '07:55 AM - 05:05 PM', status: 'On Time' },
        { date: 'Feb 17, 2026', time: '08:10 AM - 05:00 PM', status: 'Late' },
        { date: 'Feb 16, 2026', time: '07:50 AM - 05:15 PM', status: 'On Time' },
    ];

    // Get current user's recent leaves from shared context
    const myLeaves = leaveRequests
        .filter(r => r.employee === CURRENT_USER)
        .slice(0, 2);

    const payslips = [
        { period: 'Feb 1-15, 2026', paidDate: 'Feb 15, 2026', amount: '₱28,500' },
        { period: 'Jan 16-31, 2026', paidDate: 'Jan 31, 2026', amount: '₱28,500' },
    ];

    const statusBadge: Record<string, string> = {
        Pending: 'badge-warning',
        Approved: 'badge-success',
        Rejected: 'badge-danger',
    };

    const attendanceBadgeColor: Record<string, string> = {
        'On Time': '#059669',
        'Late': '#dc2626',
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="page-header animate-fade-in-up">
                <h1>Employee Dashboard</h1>
                <p>Welcome back! Here is a quick overview of your work details.</p>
            </div>

            {/* Employee Banner */}
            <div className="rounded-2xl overflow-hidden animate-fade-in-up" style={{ background: 'linear-gradient(135deg, #059669, #10b981, #34d399)', animationDelay: '0.1s', opacity: 0 }}>
                <div className="p-6 flex items-center gap-5">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold border-2 border-white/30">
                        JD
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">{profile.name}</h2>
                        <p className="text-emerald-100 text-sm">{profile.position} • {profile.department}</p>
                        <span className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/20 text-white backdrop-blur-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-pulse" />Active Employee
                        </span>
                    </div>
                </div>
            </div>

            {/* Top Row: Profile Details + Recent Attendance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
                {/* Profile Details */}
                <div className="pro-card">
                    <div className="p-5">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-emerald-600" />
                                <h3 className="text-sm font-bold text-gray-800">Profile Details</h3>
                            </div>
                            <button className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                                <Edit className="w-3.5 h-3.5" /> Request Edit
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">Full Name</p>
                                <p className="text-sm font-semibold text-gray-800">{profile.name}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">Employee ID</p>
                                <p className="text-sm font-semibold text-gray-800">{profile.id}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">Position</p>
                                <p className="text-sm font-semibold text-gray-800">{profile.position}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">Department</p>
                                <p className="text-sm font-semibold text-gray-800">{profile.department}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">Status</p>
                                <p className="text-sm font-semibold text-gray-800">{profile.status}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">Hire Date</p>
                                <p className="text-sm font-semibold text-gray-800">{profile.hireDate}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">Email</p>
                                <p className="text-sm font-semibold text-gray-800">{profile.email}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">Phone</p>
                                <p className="text-sm font-semibold text-gray-800">{profile.phone}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Attendance */}
                <div className="pro-card">
                    <div className="p-5">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-emerald-600" />
                                <h3 className="text-sm font-bold text-gray-800">Recent Attendance</h3>
                            </div>
                            <button onClick={() => navigate('/dashboard/my-attendance')} className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                                View Log <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {recentAttendance.map((entry, i) => (
                                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">{entry.date}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{entry.time}</p>
                                    </div>
                                    <span className="text-xs font-bold" style={{ color: attendanceBadgeColor[entry.status] }}>
                                        {entry.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Leave History + Recent Payslips */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
                {/* Leave History */}
                <div className="pro-card">
                    <div className="p-5">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-emerald-600" />
                                <h3 className="text-sm font-bold text-gray-800">Leave History</h3>
                            </div>
                            <button onClick={() => navigate('/dashboard/my-leave')} className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                                Manage Leave <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {myLeaves.length > 0 ? myLeaves.map((leave) => (
                                <div key={leave.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">{leave.leaveType}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{leave.startDate} - {leave.endDate}</p>
                                    </div>
                                    <span className={`badge ${statusBadge[leave.status]}`}>
                                        <span className="badge-dot" />{leave.status}
                                    </span>
                                </div>
                            )) : (
                                <p className="text-sm text-gray-400 italic">No leave records found.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Payslips */}
                <div className="pro-card">
                    <div className="p-5">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-emerald-600" />
                                <h3 className="text-sm font-bold text-gray-800">Recent Payslips</h3>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {payslips.map((slip, i) => (
                                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">{slip.period}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">Paid: {slip.paidDate}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-emerald-600">{slip.amount}</span>
                                        <button className="btn-ghost btn-icon text-blue-500 hover:bg-blue-50" title="View"><Eye className="w-4 h-4" /></button>
                                        <button className="btn-ghost btn-icon text-gray-400 hover:bg-gray-100" title="Download"><Download className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeSelfService;