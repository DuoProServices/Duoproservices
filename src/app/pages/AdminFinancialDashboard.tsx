import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { isAdminEmail } from '../config/admins';
import { supabase } from '../utils/supabaseClient';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowLeft, Loader2, TrendingUp, DollarSign, Calendar, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { FinancialKPIs } from '../components/admin/FinancialKPIs';
import { MonthlyRevenueChart, ServiceTypeChart } from '../components/admin/RevenueCharts';
import { ProvinceBreakdown } from '../components/admin/ProvinceBreakdown';
import { TransactionTable } from '../components/admin/TransactionTable';
import { API_ENDPOINTS } from '../../config/api';

interface FinancialData {
  summary: {
    totalRevenue: number;
    totalPending: number;
    totalApproved: number;
    totalRejected: number;
    averageTicket: number;
    totalClients: number;
    activeClients: number;
    totalTransactions: number;
    paidTransactions: number;
  };
  monthlyRevenue: Array<{
    month: string;
    monthName: string;
    revenue: number;
  }>;
  provinceRevenue: Array<{
    province: string;
    revenue: number;
    percentage: string | number;
  }>;
  serviceTypeRevenue: Array<{
    serviceType: string;
    revenue: number;
    count: number;
  }>;
  paymentMethods: Array<{
    method: string;
    revenue: number;
    count: number;
  }>;
  transactions: any[];
  filters: {
    year: string;
    month?: string;
    province?: string;
    status?: string;
  };
}

export function AdminFinancialDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<FinancialData | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    if (!user || !isAdminEmail(user.email)) {
      navigate('/login');
      return;
    }
    loadFinancialData();
  }, [user, selectedYear, selectedMonth, selectedProvince, selectedStatus]);

  const loadFinancialData = async () => {
    setLoading(true);
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        throw new Error('Not authenticated');
      }

      const accessToken = sessionData.session.access_token;

      // Build query params
      const params = new URLSearchParams({
        year: selectedYear
      });
      if (selectedMonth) params.append('month', selectedMonth);
      if (selectedProvince) params.append('province', selectedProvince);
      if (selectedStatus) params.append('status', selectedStatus);

      const response = await fetch(
        `${API_ENDPOINTS.adminFinancials}?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load financial data');
      }

      const financialData = await response.json();
      setData(financialData);
    } catch (error) {
      console.error('Error loading financial data:', error);
      toast.error(`Failed to load financial data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedMonth('');
    setSelectedProvince('');
    setSelectedStatus('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading financial data...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/admin')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Admin Hub
                </Button>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="font-semibold text-xl">Financial Dashboard</h1>
                    <p className="text-sm text-gray-500">Revenue & Analytics</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Empty State */}
        <main className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <DollarSign className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">No Financial Data Yet</h2>
            <p className="text-gray-600 mb-8">
              Financial data will appear here once you have completed tax filings with payment transactions.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => navigate('/admin')} variant="outline">
                Back to Admin Hub
              </Button>
              <Button onClick={() => navigate('/admin/clients')}>
                View Customers
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Get available years (current year and last 3 years)
  const currentYear = new Date().getFullYear();
  const availableYears = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/admin')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="font-semibold text-xl">Financial Dashboard</h1>
                  <p className="text-sm text-gray-500">Revenue & Analytics</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">
                {data.summary.paidTransactions} paid transactions
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            {/* Year Filter */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            {/* Month Filter */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="">All Months</option>
              {[
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
              ].map((month, index) => (
                <option key={month} value={index + 1}>{month}</option>
              ))}
            </select>

            {/* Province Filter */}
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="">All Provinces</option>
              <option value="Ontario">Ontario</option>
              <option value="Quebec">Quebec</option>
              <option value="British Columbia">British Columbia</option>
              <option value="Alberta">Alberta</option>
              <option value="Manitoba">Manitoba</option>
              <option value="Saskatchewan">Saskatchewan</option>
              <option value="Nova Scotia">Nova Scotia</option>
              <option value="New Brunswick">New Brunswick</option>
              <option value="Newfoundland and Labrador">Newfoundland and Labrador</option>
              <option value="Prince Edward Island">Prince Edward Island</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>

            {(selectedMonth || selectedProvince || selectedStatus) && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </Card>

        <div className="space-y-6">
          {/* KPI Cards */}
          <FinancialKPIs data={data.summary} />

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MonthlyRevenueChart data={data.monthlyRevenue} />
            <ProvinceBreakdown data={data.provinceRevenue} />
          </div>

          {/* Service Type Chart */}
          <ServiceTypeChart data={data.serviceTypeRevenue} />

          {/* Transactions Table */}
          <TransactionTable 
            transactions={data.transactions}
            onClientClick={(clientId) => navigate(`/admin/client/${clientId}`)}
          />
        </div>
      </main>
    </div>
  );
}