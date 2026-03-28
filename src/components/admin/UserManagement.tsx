import { Search, Shield, Download, Edit, Ban, MoreVertical, X, Check, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { fetchAllProfiles, updateProfile } from '../../lib/database';
import type { ProfileRow } from '../../lib/database';
import { exportToPDF } from '../../lib/exportPdf';

const UserManagement = () => {
    const [activeMenu, setActiveMenu] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<ProfileRow[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [showEditModal, setShowEditModal] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        full_name: '',
        email: '',
        role: 'employee',
        status: 'Active',
        department: 'SimpleVia',
    });

    // Load profiles from Supabase
    const loadProfiles = async () => {
        setLoading(true);
        const { data, error } = await fetchAllProfiles();
        if (error) {
            console.error('Error fetching profiles:', error);
        } else {
            setUsers(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadProfiles();
    }, []);

    // Handle clicking outside the 3-dots menu
    useEffect(() => {
        const handleClickOutside = () => setActiveMenu(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const toggleMenu = (e: React.MouseEvent, idx: number) => {
        e.stopPropagation();
        setActiveMenu(activeMenu === idx ? null : idx);
    };

    // --- Action Handlers ---

    const handleEditClick = (user: ProfileRow) => {
        setFormData({
            id: user.id,
            full_name: user.full_name || '',
            email: user.email || '',
            role: user.role || 'employee',
            status: user.status || 'Active',
            department: user.department || 'SimpleVia',
        });
        setShowEditModal(true);
        setActiveMenu(null);
    };

    const handleSaveEdit = async () => {
        await updateProfile(formData.id, {
            full_name: formData.full_name,
            role: formData.role,
            status: formData.status,
            department: formData.department,
        } as any);
        setShowEditModal(false);
        await loadProfiles();
    };

    const handleBlock = async (userId: string) => {
        if (window.confirm("Are you sure you want to block this user?")) {
            await updateProfile(userId, { status: 'Blocked' } as any);
            await loadProfiles();
        }
        setActiveMenu(null);
    };

    const handleUnblock = async (userId: string) => {
        if (window.confirm("Are you sure you want to unblock this user?")) {
            await updateProfile(userId, { status: 'Active' } as any);
            await loadProfiles();
        }
        setActiveMenu(null);
    };

    const handleExportPDF = () => {
        exportToPDF({
            title: 'User Management Report',
            headers: ['Name', 'Email', 'Role', 'Status', 'Department'],
            rows: users.map(u => [u.full_name || '-', u.email || '-', u.role, u.status, u.department || 'SimpleVia']),
            filename: 'user_management',
        });
    };

    // Helper for matching status badges
    const getStatusBadge = (status: string) => {
        if (status === 'Active') return 'badge-success';
        if (status === 'Blocked') return 'badge-danger';
        return 'badge-neutral';
    };

    const getRoleBadge = (role: string) => {
        if (role === 'admin') return 'text-amber-600';
        return 'text-gray-500';
    };

    // --- Search Filter Logic ---
    const filteredUsers = users.filter(user => {
        if (!searchTerm) return true;
        const lowerSearch = searchTerm.toLowerCase();
        return (
            (user.full_name || '').toLowerCase().includes(lowerSearch) ||
            (user.email || '').toLowerCase().includes(lowerSearch) ||
            (user.role || '').toLowerCase().includes(lowerSearch) ||
            (user.status || '').toLowerCase().includes(lowerSearch)
        );
    });

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users by name, email, or role..."
                        className="pro-input !pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <button onClick={handleExportPDF} className="btn btn-secondary flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export PDF
                    </button>
                </div>
            </div>

            {loading && <p className="text-sm text-gray-400">Loading users from Supabase...</p>}

            <div className="overflow-visible rounded-xl border border-gray-100 min-h-[300px]">
                <div className="overflow-x-auto">
                    <table className="pro-table min-w-full">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th className="hidden sm:table-cell">Department</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user, idx) => (
                                    <tr key={user.id}>
                                        <td className="!font-medium !text-gray-800">
                                            <div className="flex items-center gap-3">
                                                {user.avatar_url ? (
                                                    <img src={user.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-600 shadow-sm">
                                                        {(user.full_name || user.email || '?').charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 leading-tight">{user.full_name || 'Unknown'}</p>
                                                    <p className="text-[10px] text-gray-500 leading-tight">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={`flex items-center gap-1.5 text-sm font-semibold ${getRoleBadge(user.role)}`}>
                                                <Shield className="w-3.5 h-3.5" />
                                                {user.role === 'admin' ? 'Admin' : 'Employee'}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge ${getStatusBadge(user.status)}`}>
                                                <span className="badge-dot" />{user.status}
                                            </span>
                                        </td>
                                        <td className="hidden sm:table-cell">{user.department || 'SimpleVia'}</td>
                                        <td className="!pr-6">
                                            <div className="relative flex justify-end">
                                                <button
                                                    onClick={(e) => toggleMenu(e, idx)}
                                                    className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>

                                                {activeMenu === idx && (
                                                    <div
                                                        onClick={(e) => e.stopPropagation()} 
                                                        className="absolute right-0 top-8 mt-1 w-36 bg-white rounded-xl shadow-xl z-[100] border border-gray-100 py-1 overflow-hidden animate-in fade-in zoom-in duration-200"
                                                    >
                                                        <button
                                                            className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                                                            onClick={() => handleEditClick(user)}
                                                        >
                                                            <Edit className="w-3.5 h-3.5" /> Edit
                                                        </button>
                                                        
                                                        {user.status === 'Blocked' ? (
                                                            <button
                                                                className="w-full text-left px-4 py-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 flex items-center gap-2 transition-colors border-t border-gray-50"
                                                                onClick={() => handleUnblock(user.id)}
                                                            >
                                                                <CheckCircle className="w-3.5 h-3.5" /> Unblock
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors border-t border-gray-50"
                                                                onClick={() => handleBlock(user.id)}
                                                            >
                                                                <Ban className="w-3.5 h-3.5" /> Block
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-gray-500 italic">
                                        {loading ? 'Loading...' : searchTerm ? 'No users match your search.' : 'No users found.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit User Modal */}
            {showEditModal && createPortal(
                <div className="pro-modal-overlay z-[200]">
                    <div className="pro-modal max-w-md mx-4" onClick={e => e.stopPropagation()}>
                        <div className="pro-modal-header border-b border-gray-100 pb-4">
                            <h3>Edit User</h3>
                            <button onClick={() => setShowEditModal(false)} className="btn-ghost btn-icon"><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <div className="pro-modal-body space-y-4 pt-4">
                            <div>
                                <label className="pro-label">Full Name</label>
                                <input 
                                    type="text" 
                                    className="pro-input" 
                                    value={formData.full_name}
                                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="pro-label">Email Address</label>
                                <input 
                                    type="email" 
                                    className="pro-input bg-gray-50 cursor-not-allowed" 
                                    value={formData.email}
                                    disabled
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="pro-label">Role</label>
                                    <select 
                                        className="pro-select"
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="employee">Employee</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="pro-label">Status</label>
                                    <select 
                                        className="pro-select"
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Blocked">Blocked</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="pro-modal-footer">
                            <button onClick={() => setShowEditModal(false)} className="btn btn-secondary">Cancel</button>
                            <button onClick={handleSaveEdit} className="btn btn-primary flex items-center gap-2">
                                <Check className="w-4 h-4" /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default UserManagement;