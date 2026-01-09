import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { isAdminEmail } from '../config/admins';
import { supabase } from '../utils/supabaseClient';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft, 
  Loader2, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Receipt,
  FileText,
  Calendar,
  Filter,
  Download,
  Camera
} from 'lucide-react';
import { toast } from 'sonner';
import { ExpenseForm } from '../components/admin/ExpenseForm';
import { ExpenseList } from '../components/admin/ExpenseList';
import { BalanceSheet } from '../components/admin/BalanceSheet';
import { ProfitLoss } from '../components/admin/ProfitLoss';
import { ReceiptScanner } from '../components/bookkeeping/ReceiptScanner';
import { exportToPDF } from '../utils/pdfExport';
import { formatCAD } from '../config/pricing';
import { API_ENDPOINTS } from '../../config/api';
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface BookkeepingSummary {
  summary: {
    year: number;
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    profitMargin: number;
    totalTaxPaid: number;
    totalGSTPaid: number;
    totalQSTPaid: number;
    expenseCount: number;
  };
  monthlyData: Array<{
    month: string;
    monthName: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
  categoryData: Array<{
    category: string;
    amount: number;
    percentage: string | number;
  }>;
}

const CATEGORY_COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple  
  '#ec4899', // pink
  '#6366f1', // indigo
  '#eab308', // yellow
  '#06b6d4', // cyan
  '#f97316', // orange
  '#ef4444', // red
  '#14b8a6', // teal
  '#10b981', // green
  '#64748b'  // gray
];

export function AdminBookkeepingDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<BookkeepingSummary | null>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showReceiptScanner, setShowReceiptScanner] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedTab, setSelectedTab] = useState<'overview' | 'expenses' | 'bilan' | 'pl'>('overview');

  useEffect(() => {
    if (!user || !isAdminEmail(user.email)) {
      navigate('/login');
      return;
    }
    loadBookkeepingData();
  }, [user, selectedYear]);

  const loadBookkeepingData = async () => {
    setLoading(true);
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        throw new Error('Not authenticated');
      }

      const accessToken = sessionData.session.access_token;

      // Load summary
      const summaryResponse = await fetch(
        `${API_ENDPOINTS.bookkeepingSummary}?year=${selectedYear}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!summaryResponse.ok) {
        const errorData = await summaryResponse.json();
        throw new Error(errorData.error || 'Failed to load summary');
      }

      const summaryData = await summaryResponse.json();
      setSummary(summaryData);

      // Load expenses
      const expensesResponse = await fetch(
        `${API_ENDPOINTS.bookkeepingExpenses}?year=${selectedYear}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!expensesResponse.ok) {
        const errorData = await expensesResponse.json();
        throw new Error(errorData.error || 'Failed to load expenses');
      }

      const expensesData = await expensesResponse.json();
      setExpenses(expensesData.expenses || []);

    } catch (error) {
      console.error('Error loading bookkeeping data:', error);
      toast.error(`Failed to load data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReceiptScanned = (data: any) => {
    // Pre-fill expense form with scanned data
    const expenseData = {
      description: data.merchant || '',
      date: data.date || new Date().toISOString().split('T')[0],
      amount: data.total || 0,
      category: data.category || 'other',
      gstPaid: data.gst || 0,
      qstPaid: data.qst || 0,
      taxYear: selectedYear
    };

    setEditingExpense(expenseData);
    setShowReceiptScanner(false);
    setShowExpenseForm(true);
    toast.success('Receipt data loaded! Please review and save.');
  };

  const handleExportBalanceSheet = async () => {
    try {
      await exportToPDF({
        elementId: 'balance-sheet-export',
        filename: `balance-sheet-${selectedYear}`,
        title: `Balance Sheet ${selectedYear}`,
        subtitle: 'Canadian Tax Accounting',
        orientation: 'portrait'
      });
      toast.success('Balance Sheet exported successfully!');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export Balance Sheet');
    }
  };

  const handleExportProfitLoss = async () => {
    try {
      await exportToPDF({
        elementId: 'profit-loss-export',
        filename: `profit-loss-${selectedYear}`,
        title: `Profit & Loss Statement ${selectedYear}`,
        subtitle: 'Canadian Tax Accounting',
        orientation: 'portrait'
      });
      toast.success('P&L Statement exported successfully!');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export P&L Statement');
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) throw new Error('Not authenticated');

      const response = await fetch(
        API_ENDPOINTS.bookkeepingExpense(expenseId),
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${sessionData.session.access_token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to delete expense');

      toast.success('Expense deleted successfully');
      loadBookkeepingData();
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading bookkeeping data...</p>
        </div>
      </div>
    );
  }

  if (!summary) {
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
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <Receipt className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="font-semibold text-xl">Bookkeeping</h1>
                    <p className="text-sm text-gray-500">Manage expenses & income</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Empty State */}
        <main className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Receipt className="w-10 h-10 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">No Bookkeeping Data Yet</h2>
            <p className="text-gray-600 mb-8">
              Start tracking your business expenses, invoices, and tax deductions here.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => navigate('/admin')} variant="outline">
                Back to Admin Hub
              </Button>
              <Button onClick={() => {
                setShowExpenseForm(true);
                setLoading(false);
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Expense
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const currentYear = new Date().getFullYear();
  const availableYears = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border rounded-lg shadow-lg p-3">
          <p className="font-medium text-gray-900">{payload[0].payload.monthName}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm mt-1" style={{ color: entry.color }}>
              {entry.name}: {formatCAD(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

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
                Back
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <Receipt className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="font-semibold text-xl">Bookkeeping</h1>
                  <p className="text-sm text-gray-500">Manage expenses & income</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setSelectedTab('overview')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                selectedTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setSelectedTab('expenses')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                selectedTab === 'expenses'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Expenses ({expenses.length})
            </button>
            <button
              onClick={() => setSelectedTab('bilan')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                selectedTab === 'bilan'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Bilan
            </button>
            <button
              onClick={() => setSelectedTab('pl')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                selectedTab === 'pl'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              P&L
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {formatCAD(summary.summary.totalRevenue)}
                    </h3>
                    <p className="text-xs text-gray-600 mt-2">From invoices</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Total Expenses</p>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {formatCAD(summary.summary.totalExpenses)}
                    </h3>
                    <p className="text-xs text-gray-600 mt-2">{summary.summary.expenseCount} expenses</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Net Profit</p>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {formatCAD(summary.summary.netProfit)}
                    </h3>
                    <p className="text-xs text-gray-600 mt-2">
                      {summary.summary.profitMargin.toFixed(1)}% margin
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Total Tax Paid</p>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {formatCAD(summary.summary.totalTaxPaid)}
                    </h3>
                    <div className="flex gap-3 mt-2">
                      <p className="text-xs text-green-700">
                        GST: {formatCAD(summary.summary.totalGSTPaid || 0)}
                      </p>
                      <p className="text-xs text-blue-700">
                        QST: {formatCAD(summary.summary.totalQSTPaid || 0)}
                      </p>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Revenue vs Expenses Chart */}
              <Card className="p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold mb-6">Revenue vs Expenses</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={summary.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="monthName" 
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="Revenue"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="expenses" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      name="Expenses"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="profit" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Profit"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              {/* Expense Categories */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-6">Expenses by Category</h3>
                <div className="space-y-3">
                  {summary.categoryData.slice(0, 6).map((cat, index) => (
                    <div key={cat.category}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-700">{cat.category}</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCAD(cat.amount)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all"
                          style={{ 
                            width: `${cat.percentage}%`,
                            backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length]
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {selectedTab === 'expenses' && (
          <div className="space-y-6">
            {!showExpenseForm && !editingExpense && !showReceiptScanner && (
              <div className="flex justify-end gap-2">
                <Button 
                  onClick={() => setShowReceiptScanner(true)}
                  variant="outline"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Scan Receipt
                </Button>
                <Button onClick={() => setShowExpenseForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Expense
                </Button>
              </div>
            )}

            {showReceiptScanner && (
              <>
                <ReceiptScanner 
                  onDataExtracted={handleReceiptScanned}
                  language="en"
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={() => setShowReceiptScanner(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}

            {(showExpenseForm || editingExpense) && (
              <ExpenseForm
                existingExpense={editingExpense}
                onSuccess={() => {
                  setShowExpenseForm(false);
                  setEditingExpense(null);
                  loadBookkeepingData();
                }}
                onCancel={() => {
                  setShowExpenseForm(false);
                  setEditingExpense(null);
                }}
              />
            )}

            {!showExpenseForm && !editingExpense && !showReceiptScanner && (
              <ExpenseList 
                expenses={expenses}
                onDelete={handleDeleteExpense}
                onEdit={(expense) => setEditingExpense(expense)}
              />
            )}
          </div>
        )}

        {selectedTab === 'bilan' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={handleExportBalanceSheet}>
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
            <div id="balance-sheet-export">
              <BalanceSheet
                year={parseInt(selectedYear)}
                revenue={summary.summary.totalRevenue}
                expenses={summary.summary.totalExpenses}
                netProfit={summary.summary.netProfit}
              />
            </div>
          </div>
        )}

        {selectedTab === 'pl' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={handleExportProfitLoss}>
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
            <div id="profit-loss-export">
              <ProfitLoss
                year={parseInt(selectedYear)}
                revenue={summary.summary.totalRevenue}
                expenses={summary.summary.totalExpenses}
                netProfit={summary.summary.netProfit}
                profitMargin={summary.summary.profitMargin}
                categoryData={summary.categoryData}
                gstPaid={summary.summary.totalGSTPaid || 0}
                qstPaid={summary.summary.totalQSTPaid || 0}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}