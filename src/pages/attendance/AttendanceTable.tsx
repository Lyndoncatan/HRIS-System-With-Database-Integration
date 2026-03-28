import { useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Clock, Upload, X, Plus, Check, Edit, Trash2, Search, Download } from 'lucide-react';
import { useAttendance } from '../../context/AttendanceContext';
import { exportToPDF } from '../../lib/exportPdf';

type Tab = 'dtr' | 'overtime' | 'setup';

const AttendanceTable = () => {
    const { allRecords, loading, refreshAttendance } = useAttendance();
    const [activeTab, setActiveTab] = useState<Tab>('dtr');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showOvertimeModal, setShowOvertimeModal] = useState(false);
    const [showAddShiftModal, setShowAddShiftModal] = useState(false);
    const [showEditShiftModal, setShowEditShiftModal] = useState(false);
    const [editingShift, setEditingShift] = useState<any>(null);
    const [shiftForm, setShiftForm] = useState({ name: '', timeIn: '08:00', timeOut: '17:00', grace: '15', status: 'Active' });

    // Search states for Employee Selection
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

    // Form state for Request Overtime Modal
    const [overtimeForm, setOvertimeForm] = useState({ date: '', startTime: '', endTime: '', reason: '' });

    // States for editing Attendance Records
    const [showEditRecordModal, setShowEditRecordModal] = useState(false);
    const [editRecordForm, setEditRecordForm] = useState<any>(null);

    const tabs = [
        { id: 'dtr' as Tab, label: 'Daily Time Record', icon: Clock },
        { id: 'overtime' as Tab, label: 'Overtime', icon: AlertTriangle },
        { id: 'setup' as Tab, label: 'DTR Setup', icon: CheckCircle },
    ];

    const statCards = [
        { label: 'Present', value: 220, icon: CheckCircle, gradient: 'linear-gradient(135deg, #059669, #10b981)' },
        { label: 'Late', value: 12, icon: AlertTriangle, gradient: 'linear-gradient(135deg, #d97706, #f59e0b)' },
        { label: 'Absent', value: 8, icon: XCircle, gradient: 'linear-gradient(135deg, #dc2626, #ef4444)' },
        { label: 'Total Hours', value: '1,760', icon: Clock, gradient: 'linear-gradient(135deg, #2563eb, #3b82f6)' }, // Changed to standard blue
    ];

    // 1. DTR Records: from shared AttendanceContext (persisted in Supabase)
    const dtrRecords = allRecords;

    const uniqueEmployees = Array.from(new Set(dtrRecords.map((r: any) => r.employee_name).filter(Boolean))).sort();
    const filteredEmployees = uniqueEmployees.filter((emp: string) =>
        emp.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // TIME CONVERSION HELPERS
    const convertTo24Hour = (timeStr: string) => {
        if (!timeStr) return '';
        if (!timeStr.includes('M')) return timeStr; // Return as is if already 24h format
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');
        if (hours === '12') hours = '00';
        if (modifier === 'PM') hours = (parseInt(hours, 10) + 12).toString();
        return `${hours.padStart(2, '0')}:${minutes}`;
    };

    const convertTo12Hour = (timeStr: string) => {
        if (!timeStr) return '';
        if (timeStr.includes('M')) return timeStr; // Return as is if already 12h format
        let [hours, minutes] = timeStr.split(':');
        let h = parseInt(hours, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return `${h.toString().padStart(2, '0')}:${minutes} ${ampm}`;
    };

    const handleEditRecordClick = (record: any) => {
        // Prepare data with 24-hour time so <input type="time"> can read it
        setEditRecordForm({ 
            ...record,
            timeIn: convertTo24Hour(record.timeIn),
            timeOut: convertTo24Hour(record.timeOut)
        });
        setShowEditRecordModal(true);
    };

    const handleSaveRecordEdit = () => {
        // TODO: Update record in Supabase
        setShowEditRecordModal(false);
        refreshAttendance();
    };

    const handleDeleteRecord = (record: any) => {
        if (!window.confirm(`Are you sure you want to delete the attendance record for ${record.employee_name}?`)) return;
        // TODO: Delete from Supabase
        refreshAttendance();
    };

    const handleExportPDF = () => {
        exportToPDF({
            title: 'Attendance Records',
            headers: ['Name', 'Date', 'Time In', 'Time Out', 'Status', 'Hours', 'Overtime'],
            rows: dtrRecords.map((r: any) => [r.employee_name, r.date, r.time_in, r.time_out, r.status, r.hours, r.overtime]),
            filename: 'attendance_records',
        });
    };

    // 2. Overtime Requests: State with mock data
    const [overtimeRequests, setOvertimeRequests] = useState([
        { id: 1, date: '2026-02-24', employee: 'Dela Cruz, Juan', duration: '2 hours', reason: 'Project deadline', status: 'Pending' },
        { id: 2, date: '2026-02-23', employee: 'Garcia, Ana', duration: '3 hours', reason: 'Client deliverable', status: 'Approved' },
        { id: 3, date: '2026-02-22', employee: 'Santos, Maria', duration: '1.5 hours', reason: 'System maintenance', status: 'Rejected' },
        { id: 4, date: '2026-02-21', employee: 'Fernandez, Rosa', duration: '2 hours', reason: 'Report compilation', status: 'Pending' },
    ]);

    const calculateDuration = (start: string, end: string) => {
        if (!start || !end) return '0 hours';
        const [sh, sm] = start.split(':').map(Number);
        const [eh, em] = end.split(':').map(Number);
        let diffMinutes = (eh * 60 + em) - (sh * 60 + sm);
        if (diffMinutes < 0) diffMinutes += 24 * 60;

        const hours = (diffMinutes / 60).toFixed(1);
        return `${hours.replace('.0', '')} hours`;
    };

    const handleSubmitOvertimeRequest = () => {
        if (!selectedEmployee || !overtimeForm.date || !overtimeForm.startTime || !overtimeForm.endTime || !overtimeForm.reason) {
            alert('Please fill out all fields and select an employee.');
            return;
        }

        const newRequest = {
            id: Date.now(),
            date: overtimeForm.date,
            employee: selectedEmployee,
            duration: calculateDuration(overtimeForm.startTime, overtimeForm.endTime),
            reason: overtimeForm.reason,
            status: 'Pending'
        };

        setOvertimeRequests([newRequest, ...overtimeRequests]);
        setShowOvertimeModal(false);
        setSelectedEmployee(null);
        setSearchTerm('');
        setOvertimeForm({ date: '', startTime: '', endTime: '', reason: '' });
    };

    const handleOvertimeAction = (id: number, newStatus: string) => {
        if (window.confirm(`Are you sure you want to mark this request as ${newStatus}?`)) {
            setOvertimeRequests(overtimeRequests.map((req: any) =>
                req.id === id ? { ...req, status: newStatus } : req
            ));
        }
    };

    const handleDeleteOvertime = (id: number) => {
        if (window.confirm(`Are you sure you want to delete this overtime request?`)) {
            setOvertimeRequests(overtimeRequests.filter((req: any) => req.id !== id));
        }
    };

    // 3. Shift Setup: State with mock data
    const [shifts, setShifts] = useState([
        { id: 1, name: 'Regular Shift', timeIn: '08:00 AM', timeOut: '05:00 PM', grace: '15 min', employees: 180, status: 'Active' },
        { id: 2, name: 'Early Shift', timeIn: '06:00 AM', timeOut: '03:00 PM', grace: '10 min', employees: 35, status: 'Active' },
        { id: 3, name: 'Night Shift', timeIn: '10:00 PM', timeOut: '07:00 AM', grace: '15 min', employees: 20, status: 'Active' },
        { id: 4, name: 'Flexi Time', timeIn: '09:00 AM', timeOut: '06:00 PM', grace: '30 min', employees: 10, status: 'Inactive' },
    ]);

    const statusBadge: Record<string, string> = {
        Present: 'badge-success',
        Late: 'badge-warning',
        Absent: 'badge-danger',
        Pending: 'badge-warning',
        Approved: 'badge-success',
        Rejected: 'badge-danger',
        Active: 'badge-success',
        Inactive: 'badge-neutral',
    };

    const lateStats = [
        { label: 'Total Late Employees', value: 12 },
        { label: 'Total Late Minutes', value: '145 min' },
        { label: 'Avg Late Duration', value: '12 min' },
    ];

    const calendarDays = Array.from({ length: 28 }, (_, i) => i + 1);
    const today = new Date().getDate();

    const openEditShift = (shift: any) => {
        setEditingShift(shift);
        setShiftForm({
            name: shift.name,
            timeIn: convertTo24Hour(shift.timeIn),
            timeOut: convertTo24Hour(shift.timeOut),
            grace: String(shift.grace).replace(' min', ''),
            status: shift.status
        });
        setShowEditShiftModal(true);
    };

    const handleAddShift = () => {
        if (!shiftForm.name) {
            alert("Please provide a shift name.");
            return;
        }
        const newShift = {
            id: Date.now(),
            name: shiftForm.name,
            timeIn: convertTo12Hour(shiftForm.timeIn),
            timeOut: convertTo12Hour(shiftForm.timeOut),
            grace: shiftForm.grace + ' min',
            employees: 0,
            status: shiftForm.status
        };

        setShifts([...shifts, newShift]);
        setShowAddShiftModal(false);
        setShiftForm({ name: '', timeIn: '08:00', timeOut: '17:00', grace: '15', status: 'Active' });
    };

    const handleEditShift = () => {
        if (!editingShift) return;
        setShifts(shifts.map(s => s.id === editingShift.id ? {
            ...s,
            name: shiftForm.name,
            timeIn: convertTo12Hour(shiftForm.timeIn),
            timeOut: convertTo12Hour(shiftForm.timeOut),
            grace: shiftForm.grace + ' min',
            status: shiftForm.status
        } : s));

        setShowEditShiftModal(false);
        setEditingShift(null);
    };

    const handleDeleteShift = (id: number) => {
        if (window.confirm(`Are you sure you want to delete this shift?`)) {
            setShifts(shifts.filter(s => s.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="page-header animate-fade-in-up">
                <h1>Time & Attendance</h1>
                <p>Monitor daily attendance, overtime, and shift schedules</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card, i) => (
                    <div key={card.label} className="stat-card animate-fade-in-up" style={{ background: card.gradient, animationDelay: `${i * 0.1}s`, opacity: 0 }}>
                        <div className="flex items-center justify-between relative z-10">
                            <div>
                                <p className="stat-label">{card.label}</p>
                                <p className="stat-value">{card.value}</p>
                            </div>
                            <div className="stat-icon">
                                <card.icon className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs + Content */}
            <div className="pro-card animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
                {/* Tab Bar */}
                <div className="px-6 pt-4">
                    <div className="pro-tabs">
                        {tabs.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={`pro-tab flex items-center gap-2 ${activeTab === tab.id ? 'active' : ''}`}>
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6">
                    {/* Daily Time Record Tab */}
                    {activeTab === 'dtr' && (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                <h3 className="text-base font-bold text-gray-800">Attendance Records {loading && '(Loading...)'}</h3>
                                <div className="flex gap-2">
                                    <button onClick={handleExportPDF} className="btn btn-secondary flex items-center gap-2">
                                        <Download className="w-4 h-4" /> Export PDF
                                    </button>
                                    <button onClick={() => setShowUploadModal(true)} className="btn btn-primary">
                                        <Upload className="w-4 h-4" /> Upload DTR
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto rounded-xl border border-gray-100">
                                <table className="pro-table">
                                    <thead>
                                        <tr>
                                            {['Employee ID', 'Name', 'Time In', 'Time Out', 'Status', 'Late', 'Overtime', 'Actions'].map(h => (
                                                <th key={h}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dtrRecords.map((r: any, i: number) => (
                                            <tr key={r.id || i}>
                                                <td className="font-mono text-xs">{r.id}</td>
                                                <td className="!font-medium !text-gray-800">{r.employee_name}</td>
                                                <td className="whitespace-nowrap">{r.time_in}</td>
                                                <td className="whitespace-nowrap">{r.time_out}</td>
                                                <td><span className={`badge ${statusBadge[r.status]}`}><span className="badge-dot" />{r.status}</span></td>
                                                <td>{r.hours || '-'}</td>
                                                <td>{r.overtime || '-'}</td>
                                                <td>
                                                    <div className="flex gap-1 justify-center">
                                                        <button onClick={() => handleEditRecordClick(r)} className="btn-ghost btn-icon text-blue-500 hover:bg-blue-50" title="Edit">
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleDeleteRecord(r)} className="btn-ghost btn-icon text-rose-500 hover:bg-rose-50" title="Delete">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                                <div className="lg:col-span-2">
                                    <h4 className="text-sm font-bold text-gray-700 mb-3">Late & Undertime Summary</h4>
                                    <div className="grid grid-cols-3 gap-4">
                                        {lateStats.map(s => (
                                            <div key={s.label} className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                                                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                                                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-700 mb-3">February 2026</h4>
                                    <div className="grid grid-cols-7 gap-1 text-center bg-gray-50 rounded-xl p-3 border border-gray-100">
                                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                            <div key={i} className="text-[10px] text-gray-400 font-semibold py-1">{d}</div>
                                        ))}
                                        {calendarDays.map(d => (
                                            <div key={d} className={`text-xs py-1.5 rounded-lg cursor-pointer transition-colors ${d === today ? 'bg-emerald-500 text-white font-bold shadow-sm' : 'text-gray-600 hover:bg-emerald-50'}`}>{d}</div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Overtime Tab */}
                    {activeTab === 'overtime' && (
                        <div className="space-y-5">
                            <div className="flex justify-between items-center">
                                <h3 className="text-base font-bold text-gray-800">Overtime Requests</h3>
                                <button onClick={() => setShowOvertimeModal(true)} className="btn btn-primary">
                                    <Plus className="w-4 h-4" /> Request Overtime
                                </button>
                            </div>
                            <div className="overflow-x-auto rounded-xl border border-gray-100">
                                <table className="pro-table">
                                    <thead>
                                        <tr>
                                            {['Date', 'Employee', 'Duration', 'Reason', 'Status', 'Action'].map(h => (
                                                <th key={h}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {overtimeRequests.map((r: any, i: number) => (
                                            <tr key={i}>
                                                <td>{r.date}</td>
                                                <td className="!font-medium !text-gray-800">{r.employee}</td>
                                                <td>{r.duration}</td>
                                                <td>{r.reason}</td>
                                                <td><span className={`badge ${statusBadge[r.status]}`}><span className="badge-dot" />{r.status}</span></td>
                                                <td>
                                                    <div className="flex gap-1">
                                                        {r.status === 'Pending' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleOvertimeAction(r.id, 'Approved')}
                                                                    className="btn-ghost btn-icon text-emerald-600 hover:bg-emerald-50"
                                                                    title="Approve">
                                                                    <Check className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleOvertimeAction(r.id, 'Rejected')}
                                                                    className="btn-ghost btn-icon text-amber-500 hover:bg-amber-50"
                                                                    title="Reject">
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        )}
                                                        <button
                                                            onClick={() => handleDeleteOvertime(r.id)}
                                                            className="btn-ghost btn-icon text-rose-500 hover:bg-rose-50"
                                                            title="Delete">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* DTR Setup Tab */}
                    {activeTab === 'setup' && (
                        <div className="space-y-5">
                            <div className="flex justify-between items-center">
                                <h3 className="text-base font-bold text-gray-800">Shift Schedules</h3>
                                <button onClick={() => { setShiftForm({ name: '', timeIn: '08:00', timeOut: '17:00', grace: '15', status: 'Active' }); setShowAddShiftModal(true); }} className="btn btn-primary">
                                    <Plus className="w-4 h-4" /> Add Shift
                                </button>
                            </div>
                            <div className="overflow-x-auto rounded-xl border border-gray-100">
                                <table className="pro-table">
                                    <thead>
                                        <tr>
                                            {['Shift Name', 'Time In', 'Time Out', 'Grace Period', 'Assigned', 'Status', 'Actions'].map(h => (
                                                <th key={h}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {shifts.map(s => (
                                            <tr key={s.id}>
                                                <td className="!font-medium !text-gray-800">{s.name}</td>
                                                <td>{s.timeIn}</td>
                                                <td>{s.timeOut}</td>
                                                <td>{s.grace}</td>
                                                <td>{s.employees}</td>
                                                <td><span className={`badge ${statusBadge[s.status]}`}><span className="badge-dot" />{s.status}</span></td>
                                                <td>
                                                    <div className="flex gap-1">
                                                        <button onClick={() => openEditShift(s)} className="btn-ghost btn-icon text-emerald-600 hover:bg-emerald-50" title="Edit">
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleDeleteShift(s.id)} className="btn-ghost btn-icon text-rose-500 hover:bg-rose-50" title="Delete">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Record Modal */}
            {showEditRecordModal && editRecordForm && (
                <div className="pro-modal-overlay">
                    <div className="pro-modal max-w-md" onClick={e => e.stopPropagation()}>
                        <div className="pro-modal-header">
                            <h3>Edit Attendance Record</h3>
                            <button onClick={() => setShowEditRecordModal(false)} className="btn-ghost btn-icon"><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <div className="pro-modal-body space-y-4">
                            <div>
                                <label className="pro-label">Employee</label>
                                {/* FIX: use editRecordForm.employee instead of editRecordForm.name */}
                                <input type="text" value={editRecordForm.employee_name || ''} disabled className="pro-input bg-gray-50 text-gray-500 cursor-not-allowed" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="pro-label">Time In</label>
                                    <input
                                        type="time"
                                        value={editRecordForm.timeIn}
                                        onChange={e => setEditRecordForm({ ...editRecordForm, timeIn: e.target.value })}
                                        className="pro-input"
                                    />
                                </div>
                                <div>
                                    <label className="pro-label">Time Out</label>
                                    <input
                                        type="time"
                                        value={editRecordForm.timeOut}
                                        onChange={e => setEditRecordForm({ ...editRecordForm, timeOut: e.target.value })}
                                        className="pro-input"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="pro-label">Status</label>
                                <select
                                    value={editRecordForm.status}
                                    onChange={e => setEditRecordForm({ ...editRecordForm, status: e.target.value })}
                                    className="pro-select"
                                >
                                    <option value="Present">Present</option>
                                    <option value="Late">Late</option>
                                    <option value="Absent">Absent</option>
                                </select>
                            </div>
                            <div>
                                <label className="pro-label">Remarks</label>
                                <textarea
                                    value={editRecordForm.remarks === '-' ? '' : editRecordForm.remarks}
                                    onChange={e => setEditRecordForm({ ...editRecordForm, remarks: e.target.value })}
                                    className="pro-input resize-none"
                                    rows={3}
                                    placeholder="Add or edit notes..."
                                />
                            </div>
                        </div>
                        <div className="pro-modal-footer">
                            <button onClick={() => setShowEditRecordModal(false)} className="btn btn-secondary">Cancel</button>
                            <button onClick={handleSaveRecordEdit} className="btn btn-primary">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload DTR Modal */}
            {showUploadModal && (
                <div className="pro-modal-overlay">
                    <div className="pro-modal max-w-md" onClick={e => e.stopPropagation()}>
                        <div className="pro-modal-header">
                            <h3>Upload Daily Time Record</h3>
                            <button onClick={() => setShowUploadModal(false)} className="btn-ghost btn-icon"><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <div className="pro-modal-body space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="pro-label">Date From</label><input type="date" className="pro-input" /></div>
                                <div><label className="pro-label">Date To</label><input type="date" className="pro-input" /></div>
                            </div>
                            <div>
                                <label className="pro-label">Entry Type</label>
                                <div className="flex gap-4 mt-1">
                                    <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="entry" defaultChecked className="accent-emerald-600" /> Biometric</label>
                                    <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" name="entry" className="accent-emerald-600" /> Manual Entry</label>
                                </div>
                            </div>
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-emerald-400 transition-colors cursor-pointer group">
                                <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2 group-hover:text-emerald-500 transition-colors" />
                                <p className="text-sm text-gray-600">Drag and drop file here or <span className="text-emerald-600 font-semibold">browse</span></p>
                                <p className="text-xs text-gray-400 mt-1">Supports CSV, XLSX</p>
                            </div>
                        </div>
                        <div className="pro-modal-footer">
                            <button onClick={() => setShowUploadModal(false)} className="btn btn-secondary">Cancel</button>
                            <button onClick={() => setShowUploadModal(false)} className="btn btn-primary">Upload</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Request Overtime Modal */}
            {showOvertimeModal && (
                <div className="pro-modal-overlay">
                    <div className="pro-modal max-w-md" onClick={e => e.stopPropagation()}>
                        <div className="pro-modal-header">
                            <h3>Request Overtime</h3>
                            <button onClick={() => { setShowOvertimeModal(false); setSelectedEmployee(null); setSearchTerm(''); }} className="btn-ghost btn-icon">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        <div className="pro-modal-body space-y-4">
                            <div>
                                <label className="pro-label">Select Employee</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="pro-input !pl-10"
                                        placeholder="Search employee name..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setSelectedEmployee(null);
                                        }}
                                    />
                                    {searchTerm && !selectedEmployee && (
                                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                                            {filteredEmployees.length > 0 ? (
                                                filteredEmployees.map((emp) => (
                                                    <div
                                                        key={emp}
                                                        className="px-4 py-2 hover:bg-emerald-50 cursor-pointer text-sm text-gray-700 flex items-center justify-between"
                                                        onClick={() => {
                                                            setSelectedEmployee(emp);
                                                            setSearchTerm(emp);
                                                        }}
                                                    >
                                                        {emp}
                                                        <Plus className="w-3 h-3 text-gray-300" />
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="px-4 py-2 text-sm text-gray-400 italic">No employees found</div>
                                            )}
                                        </div>
                                    )}
                                    {selectedEmployee && (
                                        <div className="mt-2 flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-emerald-100 animate-in fade-in slide-in-from-top-1">
                                            <CheckCircle className="w-3.5 h-3.5" />
                                            Selected: {selectedEmployee}
                                            <button onClick={() => { setSelectedEmployee(null); setSearchTerm(''); }} className="ml-auto hover:text-emerald-900">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="pro-label">Date</label>
                                <input
                                    type="date"
                                    className="pro-input"
                                    value={overtimeForm.date}
                                    onChange={(e) => setOvertimeForm({ ...overtimeForm, date: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="pro-label">Start Time</label>
                                    <input
                                        type="time"
                                        className="pro-input"
                                        value={overtimeForm.startTime}
                                        onChange={(e) => setOvertimeForm({ ...overtimeForm, startTime: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="pro-label">End Time</label>
                                    <input
                                        type="time"
                                        className="pro-input"
                                        value={overtimeForm.endTime}
                                        onChange={(e) => setOvertimeForm({ ...overtimeForm, endTime: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="pro-label">Reason</label>
                                <textarea
                                    rows={3}
                                    className="pro-input resize-none"
                                    placeholder="Describe reason for overtime..."
                                    value={overtimeForm.reason}
                                    onChange={(e) => setOvertimeForm({ ...overtimeForm, reason: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="pro-modal-footer">
                            <button onClick={() => { setShowOvertimeModal(false); setSelectedEmployee(null); setSearchTerm(''); }} className="btn btn-secondary">Cancel</button>
                            <button
                                onClick={handleSubmitOvertimeRequest}
                                className="btn btn-primary"
                                disabled={!selectedEmployee}
                            >
                                Submit Request
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Shift Modal */}
            {showAddShiftModal && (
                <div className="pro-modal-overlay">
                    <div className="pro-modal max-w-md" onClick={e => e.stopPropagation()}>
                        <div className="pro-modal-header">
                            <h3>Add Shift</h3>
                            <button onClick={() => setShowAddShiftModal(false)} className="btn-ghost btn-icon"><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <div className="pro-modal-body space-y-4">
                            <div>
                                <label className="pro-label">Shift Name</label>
                                <input type="text" value={shiftForm.name} onChange={e => setShiftForm({ ...shiftForm, name: e.target.value })} className="pro-input" placeholder="e.g. Morning Shift" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="pro-label">Time In</label>
                                    <input type="time" value={shiftForm.timeIn} onChange={e => setShiftForm({ ...shiftForm, timeIn: e.target.value })} className="pro-input" />
                                </div>
                                <div>
                                    <label className="pro-label">Time Out</label>
                                    <input type="time" value={shiftForm.timeOut} onChange={e => setShiftForm({ ...shiftForm, timeOut: e.target.value })} className="pro-input" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="pro-label">Grace Period (min)</label>
                                    <input type="number" value={shiftForm.grace} onChange={e => setShiftForm({ ...shiftForm, grace: e.target.value })} className="pro-input" />
                                </div>
                                <div>
                                    <label className="pro-label">Status</label>
                                    <select value={shiftForm.status} onChange={e => setShiftForm({ ...shiftForm, status: e.target.value })} className="pro-select">
                                        <option>Active</option>
                                        <option>Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="pro-modal-footer">
                            <button onClick={() => setShowAddShiftModal(false)} className="btn btn-secondary">Cancel</button>
                            <button onClick={handleAddShift} className="btn btn-primary">Add Shift</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Shift Modal */}
            {showEditShiftModal && (
                <div className="pro-modal-overlay">
                    <div className="pro-modal max-w-md" onClick={e => e.stopPropagation()}>
                        <div className="pro-modal-header">
                            <h3>Edit Shift</h3>
                            <button onClick={() => setShowEditShiftModal(false)} className="btn-ghost btn-icon"><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <div className="pro-modal-body space-y-4">
                            <div>
                                <label className="pro-label">Shift Name</label>
                                <input type="text" value={shiftForm.name} onChange={e => setShiftForm({ ...shiftForm, name: e.target.value })} className="pro-input" placeholder="e.g. Morning Shift" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="pro-label">Time In</label>
                                    <input type="time" value={shiftForm.timeIn} onChange={e => setShiftForm({ ...shiftForm, timeIn: e.target.value })} className="pro-input" />
                                </div>
                                <div>
                                    <label className="pro-label">Time Out</label>
                                    <input type="time" value={shiftForm.timeOut} onChange={e => setShiftForm({ ...shiftForm, timeOut: e.target.value })} className="pro-input" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="pro-label">Grace Period (min)</label>
                                    <input type="number" value={shiftForm.grace} onChange={e => setShiftForm({ ...shiftForm, grace: e.target.value })} className="pro-input" />
                                </div>
                                <div>
                                    <label className="pro-label">Status</label>
                                    <select value={shiftForm.status} onChange={e => setShiftForm({ ...shiftForm, status: e.target.value })} className="pro-select">
                                        <option>Active</option>
                                        <option>Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="pro-modal-footer">
                            <button onClick={() => setShowEditShiftModal(false)} className="btn btn-secondary">Cancel</button>
                            <button onClick={handleEditShift} className="btn btn-primary">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttendanceTable;