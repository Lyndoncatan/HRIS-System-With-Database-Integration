import { Calendar, Clock, Download, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { useLeave } from '../../context/LeaveContext';
import { exportToPDF } from '../../lib/exportPdf';

interface ActivityEntry {
    id: number;
    user: string;
    action: string;
    details: string;
    time: string;
    type: 'attendance' | 'leave' | 'system';
}

const ActivityLog = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isTodayFilterActive, setIsTodayFilterActive] = useState(false);
    const { allRecords } = useAttendance();
    const { leaveRequests } = useLeave();

    const getTodayString = () => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };
    const todayStr = getTodayString();

    // Build activity log from real Supabase data
    const [logs, setLogs] = useState<ActivityEntry[]>([]);

    useEffect(() => {
        const attendanceLogs: ActivityEntry[] = allRecords.map((r: any, i: number) => ({
            id: r.id || i + 1000,
            user: r.employee_name || 'Unknown',
            action: 'Time In/Out',
            details: `${r.time_in} — ${r.time_out || 'N/A'} | Status: ${r.status}`,
            time: r.created_at ? new Date(r.created_at).toLocaleString() : r.date || '',
            type: 'attendance' as const,
        }));

        const leaveLogs: ActivityEntry[] = leaveRequests.map((r: any, i: number) => ({
            id: r.id || i + 5000,
            user: r.employee_name || 'Unknown',
            action: r.status === 'Pending' ? 'Leave Applied' : r.status === 'Approved' ? 'Leave Approved' : 'Leave Rejected',
            details: `${r.leave_type}: ${r.start_date} to ${r.end_date} (${r.days} days)`,
            time: r.created_at ? new Date(r.created_at).toLocaleString() : r.start_date || '',
            type: 'leave' as const,
        }));

        // Sort by time (most recent first)
        const combined = [...attendanceLogs, ...leaveLogs].sort((a, b) => {
            return new Date(b.time).getTime() - new Date(a.time).getTime();
        });

        setLogs(combined);
    }, [allRecords, leaveRequests]);

    const getBadgeStyle = (action: string) => {
        if (action.includes('Rejected')) return 'badge-danger';
        if (action.includes('Approved')) return 'badge-success';
        if (action.includes('Applied')) return 'badge-warning';
        if (action.includes('Time')) return 'bg-blue-50 text-blue-700 border border-blue-100';
        return 'badge-neutral';
    };

    const filteredLogs = logs.filter(log => {
        const searchMatch =
            log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.details.toLowerCase().includes(searchTerm.toLowerCase());

        const dateMatch = isTodayFilterActive ? log.time.includes(todayStr) || log.time.includes(new Date().toLocaleDateString()) : true;

        return searchMatch && dateMatch;
    });

    const handleExport = () => {
        exportToPDF({
            title: 'Activity Log',
            headers: ['Time', 'User', 'Action', 'Details'],
            rows: filteredLogs.map(l => [l.time, l.user, l.action, l.details]),
            filename: 'activity_log',
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-xl font-bold text-gray-800">Activity Logs</h2>
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search logs..."
                            className="pro-input !pl-9 !py-1.5 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>

                    <button
                        onClick={() => setIsTodayFilterActive(!isTodayFilterActive)}
                        className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg text-sm shadow-sm transition-colors ${
                            isTodayFilterActive
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <Calendar size={16} className={isTodayFilterActive ? 'text-emerald-500' : 'text-gray-400'} />
                        <span className="font-medium">{isTodayFilterActive ? 'Today Only' : 'All Time'}</span>
                    </button>

                    <button onClick={handleExport} className="btn btn-secondary py-1.5 flex items-center gap-2">
                        <Download size={16} /> Export
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="pro-table min-w-full">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>User</th>
                            <th>Action</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.length > 0 ? (
                            filteredLogs.map((log) => (
                                <tr key={`${log.type}-${log.id}`}>
                                    <td className="whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Clock size={14} className="text-gray-400" />
                                            {log.time}
                                        </div>
                                    </td>
                                    <td className="!font-medium !text-gray-900">{log.user}</td>
                                    <td>
                                        <span className={`badge ${getBadgeStyle(log.action)}`}>
                                            <span className="badge-dot" />{log.action}
                                        </span>
                                    </td>
                                    <td className="text-gray-500">{log.details}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center py-8 text-gray-500 italic">
                                    {logs.length === 0 ? 'No employee actions yet. Activities will appear here when employees time in/out or apply for leave.' : 'No activity logs match your search criteria.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ActivityLog;