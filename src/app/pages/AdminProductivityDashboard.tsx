import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePermissions } from '../hooks/usePermissions';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import {
  ArrowLeft,
  TrendingUp,
  Users,
  FileText,
  CheckCircle2,
  Clock,
  DollarSign,
  Award,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { toast } from 'sonner';
import { formatCAD } from '../config/pricing';

interface UserProductivity {
  userId: string;
  name: string;
  email: string;
  totalCases: number;
  completedCases: number;
  inProgressCases: number;
  pendingCases: number;
  revenue: number;
  avgCompletionTime: number; // in days
  recentCases: {
    id: string;
    clientName: string;
    year: number;
    status: string;
    assignedDate: string;
  }[];
}

export function AdminProductivityDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasPermission, loading: permissionsLoading } = usePermissions();
  const [productivity, setProductivity] = useState<UserProductivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    if (!permissionsLoading && !hasPermission('customers')) {
      toast.error('Access denied. Customer management permission required.');
      navigate('/admin');
    }
  }, [permissionsLoading, hasPermission, navigate]);

  useEffect(() => {
    if (hasPermission('customers')) {
      loadProductivity();
    }
  }, [hasPermission, selectedPeriod]);

  const loadProductivity = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/productivity?period=${selectedPeriod}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) throw new Error('Failed to load productivity data');

      const data = await response.json();
      setProductivity(data);
    } catch (error) {
      console.error('Error loading productivity:', error);
      toast.error('Failed to load productivity data');
    } finally {
      setLoading(false);
    }
  };

  const totalStats = productivity.reduce(
    (acc, user) => ({
      totalCases: acc.totalCases + user.totalCases,
      completedCases: acc.completedCases + user.completedCases,
      inProgressCases: acc.inProgressCases + user.inProgressCases,
      revenue: acc.revenue + user.revenue,
    }),
    { totalCases: 0, completedCases: 0, inProgressCases: 0, revenue: 0 }
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'review': return 'bg-purple-100 text-purple-700 border-purple-200';
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
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Productivity Dashboard</h1>
                  <p className="text-sm text-gray-600">Track team performance and case assignments</p>
                </div>
              </div>
            </div>

            {/* Period Selector */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              {(['week', 'month', 'year'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    selectedPeriod === period
                      ? 'bg-white text-gray-900 shadow'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Cases</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{totalStats.totalCases}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{totalStats.completedCases}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{totalStats.inProgressCases}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{formatCAD(totalStats.revenue)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </Card>
        </div>

        {/* Team Members Productivity */}
        <div className="space-y-6">
          {productivity.map((userProd, index) => (
            <Card key={userProd.userId} className="overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      {userProd.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{userProd.name}</h3>
                      <p className="text-sm text-gray-600">{userProd.email}</p>
                    </div>
                    {index === 0 && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 border border-yellow-200 rounded-full">
                        <Award className="w-4 h-4 text-yellow-600" />
                        <span className="text-xs font-medium text-yellow-700">Top Performer</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-6">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Completion Rate</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {userProd.totalCases > 0
                          ? Math.round((userProd.completedCases / userProd.totalCases) * 100)
                          : 0}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Revenue</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCAD(userProd.revenue)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-2xl font-bold text-blue-600">{userProd.totalCases}</p>
                    <p className="text-xs text-gray-600 mt-1">Total Cases</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                    <p className="text-2xl font-bold text-green-600">{userProd.completedCases}</p>
                    <p className="text-xs text-gray-600 mt-1">Completed</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                    <p className="text-2xl font-bold text-yellow-600">{userProd.inProgressCases}</p>
                    <p className="text-xs text-gray-600 mt-1">In Progress</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <p className="text-2xl font-bold text-purple-600">{userProd.avgCompletionTime}</p>
                    <p className="text-xs text-gray-600 mt-1">Avg Days</p>
                  </div>
                </div>

                {/* Recent Cases */}
                {userProd.recentCases.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Recent Cases</h4>
                    <div className="space-y-2">
                      {userProd.recentCases.slice(0, 3).map((case_) => (
                        <div
                          key={case_.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="font-medium text-gray-900">{case_.clientName}</p>
                              <p className="text-sm text-gray-600">Tax Year {case_.year}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(case_.status)}`}>
                              {case_.status.replace('_', ' ')}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/admin/client/${case_.id}`)}
                            >
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}

          {productivity.length === 0 && (
            <Card className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No productivity data available for this period</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
