import { useState } from 'react';
import { Search, Plus, Eye, Edit, X, Users, UserCheck, UserX, Filter } from 'lucide-react';

interface Employee {
    id: number;
    employeeId: string;
    name: string;
    position: string;
    department: string;
    status: 'Active' | 'On Leave' | 'Inactive';
    contact: string;
    email: string;
    hireDate: string;
}

const initialEmployees: Employee[] = [
    { id: 1, employeeId: 'EMP-2024-001', name: 'Dela Cruz, Juan', position: 'Administrative Officer', department: 'Admin', status: 'Active', contact: '09171234567', email: 'juan@simplevia.com', hireDate: '2022-03-15' },
    { id: 2, employeeId: 'EMP-2024-002', name: 'Santos, Maria', position: 'Project Manager', department: 'Operations', status: 'On Leave', contact: '09182345678', email: 'maria@simplevia.com', hireDate: '2021-06-10' },
    { id: 3, employeeId: 'EMP-2024-003', name: 'Reyes, Jose', position: 'Technical Assistant', department: 'IT', status: 'Active', contact: '09193456789', email: 'jose@simplevia.com', hireDate: '2023-01-20' },
    { id: 4, employeeId: 'EMP-2024-004', name: 'Garcia, Ana', position: 'Administrative Aide', department: 'Admin', status: 'Active', contact: '09204567890', email: 'ana@simplevia.com', hireDate: '2023-08-01' },
    { id: 5, employeeId: 'EMP-2024-005', name: 'Bautista, Pedro', position: 'Driver', department: 'Operations', status: 'Inactive', contact: '09215678901', email: 'pedro@simplevia.com', hireDate: '2020-11-05' },
    { id: 6, employeeId: 'EMP-2024-006', name: 'Fernandez, Rosa', position: 'HR Specialist', department: 'HR', status: 'Active', contact: '09226789012', email: 'rosa@simplevia.com', hireDate: '2022-09-12' },
];

const statusBadge: Record<string, string> = {
    Active: 'badge-success',
    'On Leave': 'badge-warning',
    Inactive: 'badge-danger',
};

const EmployeeList = () => {
    const [employees, setEmployees] = useState(initialEmployees);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('All');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewPanel, setShowViewPanel] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [formData, setFormData] = useState({ name: '', position: '', department: '', status: 'Active' as Employee['status'], contact: '', email: '' });

    const filtered = employees.filter(e => {
        const matchSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.position.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = filterStatus === 'All' || e.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const totalActive = employees.filter(e => e.status === 'Active').length;
    const totalOnLeave = employees.filter(e => e.status === 'On Leave').length;
    const totalInactive = employees.filter(e => e.status === 'Inactive').length;

    const handleAdd = () => {
        const newEmp: Employee = {
            id: Date.now(),
            employeeId: `EMP-2024-${String(employees.length + 1).padStart(3, '0')}`,
            name: formData.name,
            position: formData.position,
            department: formData.department,
            status: formData.status,
            contact: formData.contact,
            email: formData.email,
            hireDate: new Date().toISOString().split('T')[0],
        };
        setEmployees([...employees, newEmp]);
        setShowAddModal(false);
        setFormData({ name: '', position: '', department: '', status: 'Active', contact: '', email: '' });
    };

    const handleEdit = () => {
        if (!selectedEmployee) return;
        setEmployees(employees.map(e => e.id === selectedEmployee.id ? { ...e, ...formData } : e));
        setShowEditModal(false);
        setSelectedEmployee(null);
    };


    const openEdit = (emp: Employee) => {
        setSelectedEmployee(emp);
        setFormData({ name: emp.name, position: emp.position, department: emp.department, status: emp.status, contact: emp.contact, email: emp.email });
        setShowEditModal(true);
    };

    const openView = (emp: Employee) => {
        setSelectedEmployee(emp);
        setShowViewPanel(true);
    };


    const statItems = [
        { label: 'Total', value: employees.length, icon: Users, gradient: 'linear-gradient(135deg, #059669, #10b981)', badge: 'All' },
        { label: 'Active', value: totalActive, icon: UserCheck, gradient: 'linear-gradient(135deg, #2563eb, #3b82f6)', badge: 'Active' },
        { label: 'On Leave', value: totalOnLeave, icon: Users, gradient: 'linear-gradient(135deg, #d97706, #f59e0b)', badge: 'On Leave' },
        { label: 'Inactive', value: totalInactive, icon: UserX, gradient: 'linear-gradient(135deg, #dc2626, #ef4444)', badge: 'Inactive' },
    ];

    const renderFormFields = (onSubmit: () => void, submitLabel: string) => (
        <div className="space-y-4">
            <div>
                <label className="pro-label">Full Name</label>
                <select
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="pro-select"
                >
                    <option value="" disabled>Select Employee</option>
                    <option value="Dela Cruz, Juan">Dela Cruz, Juan</option>
                    <option value="Santos, Maria">Santos, Maria</option>
                    <option value="Reyes, Jose">Reyes, Jose</option>
                    <option value="Garcia, Ana">Garcia, Ana</option>
                    <option value="Bautista, Pedro">Bautista, Pedro</option>
                    <option value="Fernandez, Rosa">Fernandez, Rosa</option>
                </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="pro-label">Position</label>
                    <input type="text" value={formData.position} onChange={e => setFormData({ ...formData, position: e.target.value })} className="pro-input" />
                </div>
                <div>
                    <label className="pro-label">Department</label>
                    <input type="text" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} className="pro-input" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="pro-label">Contact Number</label>
                    <input type="text" value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} className="pro-input" />
                </div>
                <div>
                    <label className="pro-label">Email</label>
                    <input type="text" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="pro-input" />
                </div>
            </div>
            <div>
                <label className="pro-label">Employment Status</label>
                <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as Employee['status'] })} className="pro-select">
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>
            <div className="pro-modal-footer !px-0 !pb-0">
                <button onClick={() => { setShowAddModal(false); setShowEditModal(false); }} className="btn btn-secondary">Cancel</button>
                <button onClick={onSubmit} className="btn btn-primary">{submitLabel}</button>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center animate-fade-in-up">
                <div className="page-header" style={{ marginBottom: 0 }}>
                    <h1>Employee Information Management</h1>
                    <p>Manage employee records and information</p>
                </div>
                <button onClick={() => { setFormData({ name: '', position: '', department: '', status: 'Active', contact: '', email: '' }); setShowAddModal(true); }} className="btn btn-primary">
                    <Plus className="w-4 h-4" /> Add Employee
                </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
                {statItems.map((item) => (
                    <button
                        key={item.label}
                        onClick={() => setFilterStatus(item.badge)}
                        className={`stat-card text-left transition-all ${filterStatus === item.badge ? 'ring-2 ring-white/50 scale-[1.02]' : ''}`}
                        style={{ background: item.gradient }}
                    >
                        <div className="flex items-center justify-between relative z-10">
                            <div>
                                <p className="stat-label">{item.label}</p>
                                <p className="stat-value">{item.value}</p>
                            </div>
                            <div className="stat-icon">
                                <item.icon className="w-5 h-5" />
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Search & Filter Toolbar */}
            <div className="pro-card p-4 animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
                <div className="flex items-center gap-3">
                    <div className="pro-search flex-1 max-w-md">
                        <Search className="search-icon" />
                        <input type="text" placeholder="Search by name, ID, or position..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="pro-select !w-auto !py-2">
                            <option value="All">All Status</option>
                            <option value="Active">Active</option>
                            <option value="On Leave">On Leave</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="pro-card overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
                <div className="overflow-x-auto">
                    <table className="pro-table">
                        <thead>
                            <tr>
                                <th>Employee ID</th>
                                <th>Name</th>
                                <th>Position</th>
                                <th>Department</th>
                                <th>Status</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(emp => (
                                <tr key={emp.id}>
                                    <td className="font-mono text-xs">{emp.employeeId}</td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                {emp.name.charAt(0)}
                                            </div>
                                            <span className="font-medium text-gray-800">{emp.name}</span>
                                        </div>
                                    </td>
                                    <td>{emp.position}</td>
                                    <td>{emp.department}</td>
                                    <td>
                                        <span className={`badge ${statusBadge[emp.status]}`}>
                                            <span className="badge-dot" />
                                            {emp.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex items-center justify-center gap-1">
                                            <button onClick={() => openView(emp)} className="btn-ghost btn-icon text-blue-500 hover:bg-blue-50" title="View">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => openEdit(emp)} className="btn-ghost btn-icon text-emerald-600 hover:bg-emerald-50" title="Edit">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan={6} className="text-center py-12 text-gray-400">No employees found matching your criteria.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="pro-modal-overlay">
                    <div className="pro-modal max-w-lg" onClick={e => e.stopPropagation()}>
                        <div className="pro-modal-header">
                            <h3>Add New Employee</h3>
                            <button onClick={() => setShowAddModal(false)} className="btn-ghost btn-icon"><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <div className="pro-modal-body">
                            {renderFormFields(handleAdd, "Add Employee")}
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div className="pro-modal-overlay">
                    <div className="pro-modal max-w-lg" onClick={e => e.stopPropagation()}>
                        <div className="pro-modal-header">
                            <h3>Edit Employee</h3>
                            <button onClick={() => setShowEditModal(false)} className="btn-ghost btn-icon"><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <div className="pro-modal-body">
                            {renderFormFields(handleEdit, "Save Changes")}
                        </div>
                    </div>
                </div>
            )}

            {/* View Panel (Slide-in) */}
            {showViewPanel && selectedEmployee && (
                <div className="pro-modal-overlay !justify-end">
                    <div className="absolute inset-0" onClick={() => setShowViewPanel(false)} />
                    <div className="relative w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl animate-slide-in-right z-10">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-gray-900">Employee Details</h3>
                                <button onClick={() => setShowViewPanel(false)} className="btn-ghost btn-icon"><X className="w-5 h-5 text-gray-400" /></button>
                            </div>
                            <div className="flex flex-col items-center mb-6">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg">
                                    {selectedEmployee.name.charAt(0)}
                                </div>
                                <h4 className="text-lg font-bold text-gray-900">{selectedEmployee.name}</h4>
                                <p className="text-sm text-gray-500">{selectedEmployee.position}</p>
                                <span className={`mt-2 badge ${statusBadge[selectedEmployee.status]}`}>
                                    <span className="badge-dot" />
                                    {selectedEmployee.status}
                                </span>
                            </div>
                            <div className="space-y-4 border-t border-gray-100 pt-6">
                                {[
                                    ['Employee ID', selectedEmployee.employeeId],
                                    ['Department', selectedEmployee.department],
                                    ['Contact', selectedEmployee.contact],
                                    ['Email', selectedEmployee.email],
                                    ['Hire Date', selectedEmployee.hireDate],
                                ].map(([label, value]) => (
                                    <div key={label} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                        <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">{label}</span>
                                        <span className="text-sm font-semibold text-gray-800">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default EmployeeList;
