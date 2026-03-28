import { useState } from 'react';
import { Clock, CheckCircle, XCircle, AlertTriangle, X, Calendar, Edit, Trash2, CheckSquare, Ban, Download } from 'lucide-react';
import { useLeave } from '../../context/LeaveContext';
import type { LeaveRequest } from '../../context/LeaveContext';
import { exportToPDF } from '../../lib/exportPdf';

type Tab = 'request' | 'history';

const LeaveManagement = () => {
    const {
        leaveRequests,
        approveRequest,
        rejectRequest,
        deleteRequest,
        loading,
    } = useLeave();

    const [activeTab, setActiveTab] = useState<Tab>('request');

    // Review modal state
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewRequest, setReviewRequest] = useState<LeaveRequest | null>(null);

    // Dynamic stat counts
    const pendingCount = leaveRequests.filter(r => r.status === 'Pending').length;
    const approvedCount = leaveRequests.filter(r => r.status === 'Approved').length;
    const rejectedCount = leaveRequests.filter(r => r.status === 'Rejected').length;

    const tabs = [
        { id: 'request' as Tab, label: 'Leave Requests', icon: Calendar },
        { id: 'history' as Tab, label: 'Leave History', icon: Clock },
    ];

    const statCards = [
        { label: 'Pending', value: pendingCount, icon: Clock, gradient: 'linear-gradient(135deg, #d97706, #f59e0b)' },
        { label: 'Approved', value: approvedCount, icon: CheckCircle, gradient: 'linear-gradient(135deg, #059669, #10b981)' },
        { label: 'Rejected', value: rejectedCount, icon: XCircle, gradient: 'linear-gradient(135deg, #dc2626, #ef4444)' },
        { label: 'Total Requests', value: leaveRequests.length, icon: AlertTriangle, gradient: 'linear-gradient(135deg, #2563eb, #3b82f6)' },
    ];

    const statusBadge: Record<string, string> = {
        Pending: 'badge-warning',
        Approved: 'badge-success',
        Rejected: 'badge-danger',
    };

    const handleDeleteRequest = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this leave request?")) {
            await deleteRequest(id);
        }
    };

    const handleOpenReview = (request: LeaveRequest) => {
        setReviewRequest(request);
        setShowReviewModal(true);
    };

    const handleApprove = async () => {
        if (!reviewRequest) return;
        await approveRequest(reviewRequest.id);
        setShowReviewModal(false);
        setReviewRequest(null);
    };

    const handleReject = async () => {
        if (!reviewRequest) return;
        await rejectRequest(reviewRequest.id);
        setShowReviewModal(false);
        setReviewRequest(null);
    };

    const handleExportPDF = () => {
        exportToPDF({
            title: 'Leave Requests Report',
            headers: ['Employee', 'Leave Type', 'Start', 'End', 'Days', 'Status', 'Reason'],
            rows: leaveRequests.map(r => [r.employee_name, r.leave_type, r.start_date, r.end_date, r.days, r.status, r.reason || '-']),
            filename: 'leave_requests',
        });
    };

    // History = approved/rejected
    const historyRequests = leaveRequests.filter(r => r.status === 'Approved' || r.status === 'Rejected');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 animate-fade-in-up">
                <div className="page-header" style={{ marginBottom: 0 }}>
                    <h1>Leave Management</h1>
                    <p>Review and manage employee leave requests</p>
                </div>
                <button onClick={handleExportPDF} className="btn btn-secondary flex items-center gap-2">
                    <Download className="w-4 h-4" /> Export PDF
                </button>
            </div>

            {loading && <p className="text-sm text-gray-400">Loading data from database...</p>}

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

            {/* Tabs Card */}
            <div className="pro-card animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
                <div className="px-4 sm:px-6 pt-4">
                    <div className="pro-tabs">
                        {tabs.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={`pro-tab flex items-center gap-2 ${activeTab === tab.id ? 'active' : ''}`}>
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                                {tab.id === 'request' && pendingCount > 0 && (
                                    <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-700 rounded-full">
                                        {pendingCount}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-4 sm:p-6">
                    {/* Leave Request Tab */}
                    {activeTab === 'request' && (
                        <div className="overflow-x-auto rounded-xl border border-gray-100">
                            <table className="pro-table">
                                <thead>
                                    <tr>
                                        {['Employee', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Status', 'Actions'].map(h => (
                                            <th key={h}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaveRequests.map((r) => (
                                        <tr key={r.id}>
                                            <td className="!font-medium !text-gray-800">{r.employee_name}</td>
                                            <td>{r.leave_type}</td>
                                            <td className="whitespace-nowrap">{r.start_date}</td>
                                            <td className="whitespace-nowrap">{r.end_date}</td>
                                            <td className="!font-semibold">{r.days}</td>
                                            <td><span className={`badge ${statusBadge[r.status]}`}><span className="badge-dot" />{r.status}</span></td>
                                            <td>
                                                <div className="flex gap-1">
                                                    {r.status === 'Pending' ? (
                                                        <button onClick={() => handleOpenReview(r)} className="btn-ghost btn-icon text-blue-500 hover:bg-blue-50" title="Review Request">
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                    ) : (
                                                        <button disabled className="btn-ghost btn-icon text-gray-300 cursor-not-allowed" title="Already reviewed">
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button onClick={() => handleDeleteRequest(r.id)} className="btn-ghost btn-icon text-rose-500 hover:bg-rose-50" title="Delete">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {leaveRequests.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="text-center py-6 text-gray-500 italic">No leave requests found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Leave History Tab */}
                    {activeTab === 'history' && (
                        <div className="overflow-x-auto rounded-xl border border-gray-100">
                            <table className="pro-table">
                                <thead>
                                    <tr>
                                        {['Employee', 'Leave Type', 'Start', 'End', 'Days', 'Status', 'Approved By'].map(h => (
                                            <th key={h}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {historyRequests.length > 0 ? (
                                        historyRequests.map((r) => (
                                            <tr key={r.id}>
                                                <td className="!font-medium !text-gray-800">{r.employee_name}</td>
                                                <td>{r.leave_type}</td>
                                                <td className="whitespace-nowrap">{r.start_date}</td>
                                                <td className="whitespace-nowrap">{r.end_date}</td>
                                                <td className="!font-semibold">{r.days}</td>
                                                <td><span className={`badge ${statusBadge[r.status]}`}><span className="badge-dot" />{r.status}</span></td>
                                                <td>{r.approved_by || '-'}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="text-center py-6 text-gray-400 italic">No finalized leave records yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Review Request Modal */}
            {showReviewModal && reviewRequest && (
                <div className="pro-modal-overlay">
                    <div className="pro-modal max-w-md mx-4" onClick={e => e.stopPropagation()}>
                        <div className="pro-modal-header border-b border-gray-100 pb-4">
                            <h3>Review Leave Request</h3>
                            <button onClick={() => setShowReviewModal(false)} className="btn-ghost btn-icon"><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <div className="pro-modal-body space-y-4 pt-4">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <h4 className="text-sm font-bold text-gray-800 mb-1">{reviewRequest.employee_name}</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-medium">Leave Type:</span>
                                        <span className="font-semibold text-gray-800">{reviewRequest.leave_type}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-medium">Duration:</span>
                                        <span className="font-semibold text-gray-800">{reviewRequest.start_date} to {reviewRequest.end_date} ({reviewRequest.days} days)</span>
                                    </div>
                                    <div className="flex flex-col mt-2 pt-2 border-t border-gray-200">
                                        <span className="text-gray-500 font-medium mb-1">Reason:</span>
                                        <span className="text-gray-700 italic text-xs bg-white p-2 rounded border border-gray-100">{reviewRequest.reason || 'No reason provided.'}</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400">Choose an action below to finalize this leave request.</p>
                        </div>
                        <div className="pro-modal-footer">
                            <button onClick={() => setShowReviewModal(false)} className="btn btn-secondary">Cancel</button>
                            <button onClick={handleReject} className="btn flex items-center gap-1.5 text-white font-semibold px-4 py-2 rounded-xl transition-all" style={{ background: 'linear-gradient(135deg, #dc2626, #ef4444)' }}>
                                <Ban className="w-4 h-4" /> Deny
                            </button>
                            <button onClick={handleApprove} className="btn flex items-center gap-1.5 text-white font-semibold px-4 py-2 rounded-xl transition-all" style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}>
                                <CheckSquare className="w-4 h-4" /> Approve
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaveManagement;