import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { insertAttendance, fetchMyAttendance, fetchAllAttendance } from '../lib/database';

export interface AttendanceLog {
    id: number;
    user_id: string;
    date: string;
    time_in: string;
    time_out: string;
    status: string;
    hours: string;
    overtime: string;
    remarks: string;
    employee_name: string;
    created_at?: string;
}

interface AttendanceForm {
    timeIn: string;
    timeOut: string;
    overtime: string;
    remarks: string;
}

interface AttendanceContextType {
    attendanceForm: AttendanceForm;
    setAttendanceForm: React.Dispatch<React.SetStateAction<AttendanceForm>>;
    punchedIn: boolean;
    setPunchedIn: React.Dispatch<React.SetStateAction<boolean>>;
    punchedOut: boolean;
    setPunchedOut: React.Dispatch<React.SetStateAction<boolean>>;
    myAttendance: AttendanceLog[];
    allRecords: AttendanceLog[];
    submitAttendanceLog: (log: Omit<AttendanceLog, 'id' | 'created_at'>) => Promise<void>;
    refreshAttendance: () => Promise<void>;
    loading: boolean;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const AttendanceProvider = ({ children }: { children: ReactNode }) => {
    const { user, role } = useAuth();
    const [attendanceForm, setAttendanceForm] = useState<AttendanceForm>({ timeIn: '', timeOut: '', overtime: '0', remarks: '' });
    const [punchedIn, setPunchedIn] = useState(false);
    const [punchedOut, setPunchedOut] = useState(false);
    const [myAttendance, setMyAttendance] = useState<AttendanceLog[]>([]);
    const [allRecords, setAllRecords] = useState<AttendanceLog[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch attendance from Supabase
    const refreshAttendance = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            // Fetch user's own logs
            const { data: myData } = await fetchMyAttendance(user.id);
            setMyAttendance(myData as AttendanceLog[]);

            // If admin, also fetch all records
            if (role === 'admin') {
                const { data: allData } = await fetchAllAttendance();
                setAllRecords(allData as AttendanceLog[]);
            }
        } catch (err) {
            console.error('Error fetching attendance:', err);
        }
        setLoading(false);
    }, [user, role]);

    // Load on mount and when user changes
    useEffect(() => {
        refreshAttendance();
    }, [refreshAttendance]);

    // Submit a new log to Supabase
    const submitAttendanceLog = async (log: Omit<AttendanceLog, 'id' | 'created_at'>) => {
        try {
            const { error } = await insertAttendance(log);
            if (error) {
                console.error('Error inserting attendance:', error);
                alert('Failed to submit attendance log: ' + error.message);
                return;
            }
            // Refresh data from DB
            await refreshAttendance();
        } catch (err) {
            console.error('Unexpected error:', err);
            alert('Failed to submit attendance log. Please try again.');
        }
    };

    return (
        <AttendanceContext.Provider value={{
            attendanceForm, setAttendanceForm,
            punchedIn, setPunchedIn,
            punchedOut, setPunchedOut,
            myAttendance, allRecords,
            submitAttendanceLog,
            refreshAttendance,
            loading,
        }}>
            {children}
        </AttendanceContext.Provider>
    );
};

export const useAttendance = () => {
    const context = useContext(AttendanceContext);
    if (context === undefined) {
        throw new Error('useAttendance must be used within an AttendanceProvider');
    }
    return context;
};