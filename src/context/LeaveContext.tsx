import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { insertLeaveRequest, fetchMyLeaves, fetchAllLeaves, updateLeaveStatus, deleteLeaveRequest } from '../lib/database';

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
    id: number;
    user_id: string;
    employee_name: string;
    department: string;
    leave_type: string;
    start_date: string;
    end_date: string;
    days: number;
    status: LeaveStatus;
    reason: string;
    approved_by?: string;
    created_at?: string;
}

export interface LeaveNotification {
    id: number;
    message: string;
    type: 'success' | 'danger' | 'info';
    timestamp: string;
    read: boolean;
}

interface LeaveContextType {
    leaveRequests: LeaveRequest[];
    notifications: LeaveNotification[];
    submitLeave: (req: { leave_type: string; start_date: string; end_date: string; days: number; reason: string }) => Promise<void>;
    approveRequest: (id: number) => Promise<void>;
    rejectRequest: (id: number) => Promise<void>;
    deleteRequest: (id: number) => Promise<void>;
    markNotificationRead: (id: number) => void;
    clearNotifications: () => void;
    refreshLeaves: () => Promise<void>;
    loading: boolean;
}

const LeaveContext = createContext<LeaveContextType | undefined>(undefined);

export const LeaveProvider = ({ children }: { children: ReactNode }) => {
    const { user, role } = useAuth();
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
    const [notifications, setNotifications] = useState<LeaveNotification[]>([]);
    const [loading, setLoading] = useState(false);

    const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Employee';

    // Fetch leaves from Supabase
    const refreshLeaves = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            if (role === 'admin') {
                const { data } = await fetchAllLeaves();
                setLeaveRequests(data as LeaveRequest[]);
            } else {
                const { data } = await fetchMyLeaves(user.id);
                setLeaveRequests(data as LeaveRequest[]);
            }
        } catch (err) {
            console.error('Error fetching leaves:', err);
        }
        setLoading(false);
    }, [user, role]);

    useEffect(() => {
        refreshLeaves();
    }, [refreshLeaves]);

    // Employee submits a new leave request
    const submitLeave = async (req: { leave_type: string; start_date: string; end_date: string; days: number; reason: string }) => {
        if (!user) return;
        const { error } = await insertLeaveRequest({
            user_id: user.id,
            employee_name: displayName,
            department: 'SimpleVia',
            leave_type: req.leave_type,
            start_date: req.start_date,
            end_date: req.end_date,
            days: req.days,
            status: 'Pending',
            reason: req.reason,
        });
        if (error) {
            console.error('Error submitting leave:', error);
            alert('Failed to submit leave request.');
            return;
        }
        await refreshLeaves();
    };

    // Admin approves
    const approveRequest = async (id: number) => {
        const req = leaveRequests.find(r => r.id === id);
        const { error } = await updateLeaveStatus(id, 'Approved', displayName);
        if (error) {
            console.error('Error approving:', error);
            return;
        }
        if (req) {
            const notification: LeaveNotification = {
                id: Date.now(),
                message: `Leave request for ${req.employee_name} (${req.leave_type}) has been Approved.`,
                type: 'success',
                timestamp: new Date().toLocaleString(),
                read: false,
            };
            setNotifications(prev => [notification, ...prev]);
        }
        await refreshLeaves();
    };

    // Admin rejects
    const rejectRequest = async (id: number) => {
        const req = leaveRequests.find(r => r.id === id);
        const { error } = await updateLeaveStatus(id, 'Rejected', displayName);
        if (error) {
            console.error('Error rejecting:', error);
            return;
        }
        if (req) {
            const notification: LeaveNotification = {
                id: Date.now(),
                message: `Leave request for ${req.employee_name} (${req.leave_type}) has been Denied.`,
                type: 'danger',
                timestamp: new Date().toLocaleString(),
                read: false,
            };
            setNotifications(prev => [notification, ...prev]);
        }
        await refreshLeaves();
    };

    // Admin deletes
    const deleteReq = async (id: number) => {
        const { error } = await deleteLeaveRequest(id);
        if (error) {
            console.error('Error deleting:', error);
            return;
        }
        await refreshLeaves();
    };

    const markNotificationRead = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const clearNotifications = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    return (
        <LeaveContext.Provider value={{
            leaveRequests,
            notifications,
            submitLeave,
            approveRequest,
            rejectRequest,
            deleteRequest: deleteReq,
            markNotificationRead,
            clearNotifications,
            refreshLeaves,
            loading,
        }}>
            {children}
        </LeaveContext.Provider>
    );
};

export const useLeave = () => {
    const ctx = useContext(LeaveContext);
    if (!ctx) throw new Error('useLeave must be used within LeaveProvider');
    return ctx;
};
