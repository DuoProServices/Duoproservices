import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePermissions, UserPermissions, ModulePermission } from '../hooks/usePermissions';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import {
  ArrowLeft,
  Users,
  Shield,
  CheckCircle2,
  XCircle,
  Edit2,
  Loader2,
  UserPlus,
} from 'lucide-react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { toast } from 'sonner';

interface UserWithPermissions extends UserPermissions {
  casesCount?: number;
  pendingCases?: number;
  completedCases?: number;
}

export function AdminUsersPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, loading: permissionsLoading } = usePermissions();
  const [users, setUsers] = useState<UserWithPermissions[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserWithPermissions | null>(null);
  const [editingPermissions, setEditingPermissions] = useState(false);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);

  useEffect(() => {
    if (!permissionsLoading && !isAdmin()) {
      toast.error('Access denied. Admin permissions required.');
      navigate('/admin');
    }
  }, [permissionsLoading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin()) {
      loadUsers();
    }
  }, [isAdmin]);

  const loadUsers = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/users/list`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) throw new Error('Failed to load users');

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePermissions = async (userId: string, updates: Partial<UserPermissions>) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/users/permissions/${userId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates),
        }
      );

      if (!response.ok) throw new Error('Failed to update permissions');

      toast.success('Permissions updated successfully');
      await loadUsers();
      setEditingPermissions(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast.error('Failed to update permissions');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'accountant': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'viewer': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (permissionsLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Admin Hub
              </Button>
              <div className="h-8 w-px bg-gray-300" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                  <p className="text-sm text-gray-600">Manage team members and permissions</p>
                </div>
              </div>
            </div>
            
            {/* Add User Button */}
            <Button
              onClick={() => setShowAddUserDialog(true)}
              className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Add User
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{users.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {users.filter(u => u.isActive).length}
                </p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Admins</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
              <Shield className="w-8 h-8 text-purple-500" />
            </div>
          </Card>
        </div>

        {/* Users List */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Modules Access
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Cases
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((userItem) => (
                  <tr key={userItem.userId} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{userItem.name}</p>
                        <p className="text-sm text-gray-500">{userItem.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(userItem.role)}`}>
                        {userItem.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {userItem.isActive ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-sm font-medium">Active</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-400">
                          <XCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Inactive</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {userItem.modules.slice(0, 3).map((module) => (
                          <span
                            key={module}
                            className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-50 text-blue-700 border border-blue-100"
                          >
                            {module}
                          </span>
                        ))}
                        {userItem.modules.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
                            +{userItem.modules.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <span className="font-medium text-gray-900">{userItem.casesCount || 0}</span>
                        <span className="text-gray-500"> total</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(userItem);
                          setEditingPermissions(true);
                        }}
                        className="flex items-center gap-2"
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Edit Permissions Dialog */}
      {editingPermissions && selectedUser && (
        <PermissionsDialog
          user={selectedUser}
          onClose={() => {
            setEditingPermissions(false);
            setSelectedUser(null);
          }}
          onSave={handleUpdatePermissions}
        />
      )}

      {/* Add User Dialog */}
      {showAddUserDialog && (
        <AddUserDialog
          onClose={() => setShowAddUserDialog(false)}
          onAddUser={loadUsers}
        />
      )}
    </div>
  );
}

interface PermissionsDialogProps {
  user: UserWithPermissions;
  onClose: () => void;
  onSave: (userId: string, updates: Partial<UserPermissions>) => void;
}

function PermissionsDialog({ user, onClose, onSave }: PermissionsDialogProps) {
  const [role, setRole] = useState(user.role);
  const [modules, setModules] = useState<ModulePermission[]>(user.modules);
  const [isActive, setIsActive] = useState(user.isActive);

  const allModules: { id: ModulePermission; label: string; description: string }[] = [
    { id: 'dashboard', label: 'Dashboard', description: 'General overview and analytics' },
    { id: 'customers', label: 'Customers', description: 'Manage clients and tax filings' },
    { id: 'bookkeeping', label: 'Bookkeeping', description: 'Track expenses and invoices' },
    { id: 'financial', label: 'Financial', description: 'Revenue and financial reports' },
    { id: 'marketing', label: 'Marketing', description: 'Marketing tools and campaigns' },
    { id: 'users', label: 'User Management', description: 'Manage team and permissions (Admin only)' },
  ];

  const toggleModule = (moduleId: ModulePermission) => {
    if (modules.includes(moduleId)) {
      setModules(modules.filter(m => m !== moduleId));
    } else {
      setModules([...modules, moduleId]);
    }
  };

  const handleSave = () => {
    onSave(user.userId, { role, modules, isActive });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Edit Permissions</h2>
          <p className="text-sm text-gray-600 mt-1">{user.name} - {user.email}</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Role</label>
            <div className="grid grid-cols-3 gap-3">
              {(['admin', 'accountant', 'viewer'] as const).map((roleOption) => (
                <button
                  key={roleOption}
                  onClick={() => setRole(roleOption)}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    role === roleOption
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 capitalize">{roleOption}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Module Permissions */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Module Access</label>
            <div className="space-y-2">
              {allModules.map((module) => (
                <button
                  key={module.id}
                  onClick={() => toggleModule(module.id)}
                  disabled={role === 'admin' && module.id === 'users'}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    modules.includes(module.id)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${role === 'admin' && module.id === 'users' ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{module.label}</p>
                      <p className="text-sm text-gray-600">{module.description}</p>
                    </div>
                    {modules.includes(module.id) && (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            {role === 'admin' && (
              <p className="text-xs text-gray-500 mt-2">
                * Admin users automatically have access to all modules including User Management
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Status</label>
            <button
              onClick={() => setIsActive(!isActive)}
              className={`w-full p-4 border-2 rounded-lg flex items-center justify-between ${
                isActive
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 bg-gray-50'
              }`}
            >
              <div>
                <p className="font-medium text-gray-900">
                  {isActive ? 'Active' : 'Inactive'}
                </p>
                <p className="text-sm text-gray-600">
                  {isActive ? 'User can access the system' : 'User is blocked from accessing'}
                </p>
              </div>
              {isActive ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
}

interface AddUserDialogProps {
  onClose: () => void;
  onAddUser: () => void;
}

function AddUserDialog({ onClose, onAddUser }: AddUserDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'accountant' | 'viewer'>('viewer');
  const [modules, setModules] = useState<ModulePermission[]>(['dashboard']);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const allModules: { id: ModulePermission; label: string; description: string }[] = [
    { id: 'dashboard', label: 'Dashboard', description: 'General overview and analytics' },
    { id: 'customers', label: 'Customers', description: 'Manage clients and tax filings' },
    { id: 'bookkeeping', label: 'Bookkeeping', description: 'Track expenses and invoices' },
    { id: 'financial', label: 'Financial', description: 'Revenue and financial reports' },
    { id: 'marketing', label: 'Marketing', description: 'Marketing tools and campaigns' },
    { id: 'users', label: 'User Management', description: 'Manage team and permissions (Admin only)' },
  ];

  const toggleModule = (moduleId: ModulePermission) => {
    if (modules.includes(moduleId)) {
      setModules(modules.filter(m => m !== moduleId));
    } else {
      setModules([...modules, moduleId]);
    }
  };

  const handleAddUser = async () => {
    setLoading(true);
    try {
      if (!name || !email || !password) {
        toast.error('Please fill in all required fields');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        toast.error('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/users/create`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            password,
            role,
            modules,
            isActive,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add user');
      }

      const data = await response.json();
      console.log('User created successfully:', data);

      toast.success(`User ${name} created successfully!`);
      onAddUser();
      onClose();
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Add User</h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 border-2 rounded-lg text-left transition-all border-gray-200 hover:border-gray-300"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border-2 rounded-lg text-left transition-all border-gray-200 hover:border-gray-300"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border-2 rounded-lg text-left transition-all border-gray-200 hover:border-gray-300"
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Role</label>
            <div className="grid grid-cols-3 gap-3">
              {(['admin', 'accountant', 'viewer'] as const).map((roleOption) => (
                <button
                  key={roleOption}
                  onClick={() => setRole(roleOption)}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    role === roleOption
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900 capitalize">{roleOption}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Module Permissions */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Module Access</label>
            <div className="space-y-2">
              {allModules.map((module) => (
                <button
                  key={module.id}
                  onClick={() => toggleModule(module.id)}
                  disabled={role === 'admin' && module.id === 'users'}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    modules.includes(module.id)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${role === 'admin' && module.id === 'users' ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{module.label}</p>
                      <p className="text-sm text-gray-600">{module.description}</p>
                    </div>
                    {modules.includes(module.id) && (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            {role === 'admin' && (
              <p className="text-xs text-gray-500 mt-2">
                * Admin users automatically have access to all modules including User Management
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Status</label>
            <button
              onClick={() => setIsActive(!isActive)}
              className={`w-full p-4 border-2 rounded-lg flex items-center justify-between ${
                isActive
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 bg-gray-50'
              }`}
            >
              <div>
                <p className="font-medium text-gray-900">
                  {isActive ? 'Active' : 'Inactive'}
                </p>
                <p className="text-sm text-gray-600">
                  {isActive ? 'User can access the system' : 'User is blocked from accessing'}
                </p>
              </div>
              {isActive ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAddUser} className="bg-blue-600 hover:bg-blue-700">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add User'}
          </Button>
        </div>
      </Card>
    </div>
  );
}