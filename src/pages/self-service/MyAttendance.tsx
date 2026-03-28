import { useState, useEffect } from 'react';
import { Clock, Send, Play, Square, Download } from 'lucide-react';
import { useAttendance } from '../../context/AttendanceContext';
import { useAuth } from '../../context/AuthContext';
import { exportToPDF } from '../../lib/exportPdf';

const MyAttendance = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const { user } = useAuth();

    const {
        attendanceForm, setAttendanceForm,
        punchedIn, setPunchedIn,
        punchedOut, setPunchedOut,
        myAttendance,
        submitAttendanceLog,
        loading,
    } = useAttendance();

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const statusBadge: Record<string, string> = {
        Present: 'badge-success',
        Late: 'badge-warning',
        Absent: 'badge-danger',
    };

    const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Employee';

    const handleTimeIn = () => {
        const timeStr = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setAttendanceForm({ ...attendanceForm, timeIn: timeStr });
        setPunchedIn(true);
    };

    const handleTimeOut = () => {
        const timeStr = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setAttendanceForm({ ...attendanceForm, timeOut: timeStr });
        setPunchedOut(true);
    };

    const handleSubmitLog = async () => {
        if (!punchedIn || !user) {
            alert('Please record Time In first!');
            return;
        }

        await submitAttendanceLog({
            user_id: user.id,
            date: currentTime.toISOString().split('T')[0],
            time_in: attendanceForm.timeIn,
            time_out: attendanceForm.timeOut || '--:--',
            status: 'Present',
            hours: '8.0',
            overtime: attendanceForm.overtime !== '0' ? attendanceForm.overtime : '0',
            remarks: attendanceForm.remarks || '-',
            employee_name: displayName,
        });

        alert('Attendance log submitted successfully!');
        setAttendanceForm({ timeIn: '', timeOut: '', overtime: '0', remarks: '' });
        setPunchedIn(false);
        setPunchedOut(false);
    };

    const handleExportPDF = () => {
        exportToPDF({
            title: 'My Attendance Log',
            headers: ['Date', 'Time In', 'Time Out', 'Status', 'Hours'],
            rows: myAttendance.map((r: any) => [r.date, r.time_in, r.time_out, r.status, r.hours]),
            filename: 'my_attendance',
        });
    };

    return (
        <div className="space-y-6">
            <div className="page-header animate-fade-in-up">
                <h1>Attendance Log</h1>
                <p>Record your daily time in and time out with real-time tracking</p>
            </div>

            <div className="pro-card p-4 sm:p-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="flex flex-col gap-6">
                    <div className="space-y-4">
                        {/* Header row - stack on mobile */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900">Live Recording</h3>
                                    <p className="text-[11px] text-gray-400 font-medium">Capture actual time logs</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Current Time</p>
                                    <p className="text-xl sm:text-2xl font-black text-emerald-600 font-mono tracking-tighter whitespace-nowrap">
                                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </p>
                                </div>
                                {!punchedIn ? (
                                    <button onClick={handleTimeIn} className="btn bg-emerald-500 hover:bg-emerald-600 text-white border-none flex items-center gap-2 px-4 sm:px-6">
                                        <Play className="w-4 h-4 fill-current" /> Time In
                                    </button>
                                ) : !punchedOut ? (
                                    <button onClick={handleTimeOut} className="btn bg-rose-500 hover:bg-rose-600 text-white border-none flex items-center gap-2 px-4 sm:px-6">
                                        <Square className="w-4 h-4 fill-current" /> Time Out
                                    </button>
                                ) : (
                                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                                        Day Logged
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Time cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="flex flex-col p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                                <label className="text-[10px] font-bold text-emerald-600 mb-1 uppercase tracking-wider">Time In</label>
                                <span className={`text-xl font-black ${attendanceForm.timeIn ? 'text-emerald-700' : 'text-gray-300'} whitespace-nowrap`}>
                                    {attendanceForm.timeIn || '--:-- --'}
                                </span>
                            </div>
                            <div className="flex flex-col p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                                <label className="text-[10px] font-bold text-rose-500 mb-1 uppercase tracking-wider">Time Out</label>
                                <span className={`text-xl font-black ${attendanceForm.timeOut ? 'text-rose-600' : 'text-gray-300'} whitespace-nowrap`}>
                                    {attendanceForm.timeOut || '--:-- --'}
                                </span>
                            </div>
                            <div className="flex flex-col p-3 bg-white border border-amber-100 rounded-2xl">
                                <label className="text-[10px] font-bold text-amber-500 mb-1 uppercase tracking-wider">Overtime (Hrs)</label>
                                <input
                                    type="number" step="0.5" min="0"
                                    value={attendanceForm.overtime}
                                    onChange={(e) => setAttendanceForm({ ...attendanceForm, overtime: e.target.value })}
                                    className="text-lg font-black text-amber-600 bg-transparent outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Remarks */}
                    <div className="flex flex-col">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Remarks / Comments</label>
                        <textarea
                            value={attendanceForm.remarks}
                            onChange={(e) => setAttendanceForm({ ...attendanceForm, remarks: e.target.value })}
                            className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition-all resize-none min-h-[100px]"
                            placeholder="Add notes for today's shift..."
                        />
                    </div>

                    <div className="flex justify-end border-t border-gray-50 pt-4">
                        <button
                            onClick={handleSubmitLog}
                            disabled={!punchedIn}
                            className="btn btn-primary px-8 sm:px-10 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-4 h-4" /> Finalize Log
                        </button>
                    </div>
                </div>
            </div>

            {/* Recent Logs Table */}
            <div className="pro-card overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="p-4 border-b border-gray-50 bg-gray-100/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-800">Recent Logs {loading && '(Loading...)'}</h3>
                    {myAttendance.length > 0 && (
                        <button onClick={handleExportPDF} className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors bg-emerald-50 px-3 py-1.5 rounded-lg">
                            <Download className="w-3.5 h-3.5" /> Export PDF
                        </button>
                    )}
                </div>
                <div className="overflow-x-auto">
                    <table className="pro-table">
                        <thead>
                            <tr>
                                {['Date', 'Time In', 'Time Out', 'Status', 'Hours'].map(h => <th key={h}>{h}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {myAttendance.length > 0 ? (
                                myAttendance.map((r: any, i: number) => (
                                    <tr key={r.id || i}>
                                        <td>{r.date}</td>
                                        <td className="font-mono text-xs font-bold text-emerald-600 whitespace-nowrap">{r.time_in}</td>
                                        <td className="font-mono text-xs font-bold text-rose-500 whitespace-nowrap">{r.time_out}</td>
                                        <td><span className={`badge ${statusBadge[r.status]}`}><span className="badge-dot" />{r.status}</span></td>
                                        <td className="font-bold text-gray-700">{r.hours}h</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-sm text-gray-400 italic">
                                        No recent attendance logs found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MyAttendance;