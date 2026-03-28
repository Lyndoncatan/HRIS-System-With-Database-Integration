import { supabase } from './supabase';

// ─── ATTENDANCE ───

export interface AttendanceRow {
  id?: number;
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

/** Insert a new attendance log */
export async function insertAttendance(log: Omit<AttendanceRow, 'id' | 'created_at'>) {
  const { data, error } = await supabase.from('attendance_logs').insert(log).select().single();
  return { data, error };
}

/** Fetch current user's attendance logs */
export async function fetchMyAttendance(userId: string) {
  const { data, error } = await supabase
    .from('attendance_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data: data ?? [], error };
}

/** Fetch ALL attendance logs (admin) */
export async function fetchAllAttendance() {
  const { data, error } = await supabase
    .from('attendance_logs')
    .select('*')
    .order('created_at', { ascending: false });
  return { data: data ?? [], error };
}

// ─── LEAVE REQUESTS ───

export interface LeaveRow {
  id?: number;
  user_id: string;
  employee_name: string;
  department: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  days: number;
  status: string;
  reason: string;
  approved_by?: string;
  created_at?: string;
}

/** Insert a new leave request */
export async function insertLeaveRequest(req: Omit<LeaveRow, 'id' | 'created_at'>) {
  const { data, error } = await supabase.from('leave_requests').insert(req).select().single();
  return { data, error };
}

/** Fetch current user's leave requests */
export async function fetchMyLeaves(userId: string) {
  const { data, error } = await supabase
    .from('leave_requests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data: data ?? [], error };
}

/** Fetch ALL leave requests (admin) */
export async function fetchAllLeaves() {
  const { data, error } = await supabase
    .from('leave_requests')
    .select('*')
    .order('created_at', { ascending: false });
  return { data: data ?? [], error };
}

/** Update leave request status (admin approve/reject) */
export async function updateLeaveStatus(id: number, status: 'Approved' | 'Rejected', approvedBy: string) {
  const { error } = await supabase
    .from('leave_requests')
    .update({ status, approved_by: approvedBy })
    .eq('id', id);
  return { error };
}

/** Delete a leave request (admin) */
export async function deleteLeaveRequest(id: number) {
  const { error } = await supabase.from('leave_requests').delete().eq('id', id);
  return { error };
}

// ─── PROFILES ───

export interface ProfileRow {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: string;
  employee_id: string | null;
  department: string;
  status: string;
  created_at: string;
}

/** Fetch all user profiles (admin) */
export async function fetchAllProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  return { data: data ?? [], error };
}

/** Fetch a single profile */
export async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
}

/** Update profile (admin can update role, status, etc.) */
export async function updateProfile(userId: string, updates: Partial<ProfileRow>) {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  return { error };
}
