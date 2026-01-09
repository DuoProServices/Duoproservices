import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Users, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { toast } from 'sonner';

interface User {
  userId: string;
  email: string;
  name: string;
  role: string;
  casesCount: number;
  pendingCases: number;
}

interface AssignCaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: {
    clientId: string;
    clientName: string;
    year: number;
    currentAssignedTo?: string;
  } | null;
  onSuccess?: () => void;
}

export function AssignCaseDialog({ 
  open,
  onOpenChange,
  data,
  onSuccess 
}: AssignCaseDialogProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(data?.currentAssignedTo || null);
  const [transferReason, setTransferReason] = useState('');

  useEffect(() => {
    if (open && data) {
      loadUsers();
      setSelectedUserId(data.currentAssignedTo || null);
    }
  }, [open, data]);

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
      // Filter only active users with customer permissions
      setUsers(data.filter((u: any) => u.isActive && u.modules.includes('customers')));
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedUserId) {
      toast.error('Please select a team member');
      return;
    }

    setAssigning(true);

    try {
      const isTransfer = data?.currentAssignedTo && data.currentAssignedTo !== selectedUserId;
      const endpoint = isTransfer ? 'cases/transfer' : 'cases/assign';

      const body = isTransfer 
        ? {
            clientId: data?.clientId,
            year: data?.year,
            fromUserId: data.currentAssignedTo,
            toUserId: selectedUserId,
            reason: transferReason || 'Manual reassignment',
          }
        : {
            clientId: data?.clientId,
            year: data?.year,
            assignedTo: selectedUserId,
          };

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) throw new Error('Failed to assign case');

      toast.success(isTransfer ? 'Case transferred successfully' : 'Case assigned successfully');
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error assigning case:', error);
      toast.error('Failed to assign case');
    } finally {
      setAssigning(false);
    }
  };

  const isTransfer = data?.currentAssignedTo && selectedUserId && data.currentAssignedTo !== selectedUserId;

  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {data?.currentAssignedTo ? 'Reassign Case' : 'Assign Case'}
              </h2>
              <p className="text-sm text-gray-600">
                {data?.clientName} - Tax Year {data?.year}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Team Member
                </label>
                {users.map((user) => (
                  <button
                    key={user.userId}
                    onClick={() => setSelectedUserId(user.userId)}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                      selectedUserId === user.userId
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${user.userId === data?.currentAssignedTo ? 'bg-yellow-50' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.name}
                            {user.userId === data?.currentAssignedTo && (
                              <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                                Currently Assigned
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {user.casesCount} total cases • {user.pendingCases} pending
                          </p>
                        </div>
                      </div>
                      {selectedUserId === user.userId && (
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {isTransfer && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Transfer Reason (Optional)
                  </label>
                  <textarea
                    value={transferReason}
                    onChange={(e) => setTransferReason(e.target.value)}
                    placeholder="Why is this case being transferred?"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>
              )}

              {users.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No available team members</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Users need customer management permissions to be assigned cases
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={assigning}>
            Cancel
          </Button>
          <Button 
            onClick={handleAssign} 
            disabled={!selectedUserId || assigning || selectedUserId === data?.currentAssignedTo}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {assigning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isTransfer ? 'Transferring...' : 'Assigning...'}
              </>
            ) : (
              <>
                {isTransfer ? 'Transfer Case' : 'Assign Case'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}