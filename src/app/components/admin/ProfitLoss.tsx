import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { formatCAD } from '../../config/pricing';
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  Cell
} from 'recharts';

interface CategoryData {
  category: string;
  amount: number;
  percentage: string;
}

interface ProfitLossProps {
  year: number;
  revenue: number;
  expenses: number;
  netProfit: number;
  profitMargin: number;
  categoryData: CategoryData[];
  gstPaid: number;
  qstPaid: number;
}

export function ProfitLoss({ 
  year, 
  revenue, 
  expenses, 
  netProfit, 
  profitMargin,
  categoryData,
  gstPaid,
  qstPaid
}: ProfitLossProps) {
  // Calculate components
  const grossProfit = revenue; // Since we don't have COGS, gross profit = revenue
  const grossProfitMargin = revenue > 0 ? (grossProfit / revenue * 100) : 0;
  
  const operatingExpenses = expenses;
  const operatingIncome = grossProfit - operatingExpenses;
  const operatingMargin = revenue > 0 ? (operatingIncome / revenue * 100) : 0;

  const totalTaxPaid = gstPaid + qstPaid;
  const netIncome = operatingIncome - totalTaxPaid;
  const netMargin = revenue > 0 ? (netIncome / revenue * 100) : 0;

  // Prepare chart data
  const chartData = categoryData.map(cat => ({
    name: cat.category.length > 15 ? cat.category.substring(0, 15) + '...' : cat.category,
    amount: cat.amount
  }));

  const COLORS = [
    '#3b82f6', '#8b5cf6', '#ec4899', '#6366f1', '#f59e0b',
    '#06b6d4', '#f97316', '#ef4444', '#14b8a6', '#84cc16', '#6b7280'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Profit & Loss Statement (P&L)</h2>
        <p className="text-gray-600 mt-1">For the year ended December 31, {year}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium">Total Revenue</p>
              <h3 className="text-2xl font-bold text-green-900 mt-1">
                {formatCAD(revenue)}
              </h3>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 font-medium">Total Expenses</p>
              <h3 className="text-2xl font-bold text-red-900 mt-1">
                {formatCAD(expenses)}
              </h3>
            </div>
            <TrendingDown className="w-8 h-8 text-red-600" />
          </div>
        </Card>

        <Card className={`p-6 bg-gradient-to-br ${
          netIncome >= 0 
            ? 'from-blue-50 to-blue-100 border-blue-300' 
            : 'from-orange-50 to-orange-100 border-orange-300'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                netIncome >= 0 ? 'text-blue-700' : 'text-orange-700'
              }`}>
                Net Income
              </p>
              <h3 className={`text-2xl font-bold mt-1 ${
                netIncome >= 0 ? 'text-blue-900' : 'text-orange-900'
              }`}>
                {formatCAD(netIncome)}
              </h3>
            </div>
            <DollarSign className={`w-8 h-8 ${
              netIncome >= 0 ? 'text-blue-600' : 'text-orange-600'
            }`} />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 font-medium">Net Margin</p>
              <h3 className="text-2xl font-bold text-purple-900 mt-1">
                {netMargin.toFixed(1)}%
              </h3>
            </div>
            <Percent className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Detailed P&L Statement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Statement */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Income Statement</h3>
          
          <div className="space-y-4">
            {/* Revenue */}
            <div className="pb-4 border-b-2 border-green-200">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-green-700">Revenue</span>
                <span className="text-xl font-bold text-green-700">{formatCAD(revenue)}</span>
              </div>
            </div>

            {/* Cost of Goods Sold */}
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Cost of Goods Sold (COGS)</span>
                <span className="font-medium">{formatCAD(0)}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="font-semibold text-gray-700">Gross Profit</span>
                <div className="text-right">
                  <span className="font-bold text-gray-900 block">{formatCAD(grossProfit)}</span>
                  <Badge variant="outline" className="text-xs bg-green-50 border-green-300 text-green-700 mt-1">
                    {grossProfitMargin.toFixed(1)}% margin
                  </Badge>
                </div>
              </div>
            </div>

            {/* Operating Expenses */}
            <div className="pt-4 border-t-2">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Operating Expenses</h4>
              <div className="space-y-2 pl-4">
                {categoryData.slice(0, 5).map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{cat.category}</span>
                    <span className="font-medium">{formatCAD(cat.amount)}</span>
                  </div>
                ))}
                {categoryData.length > 5 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 italic">+ {categoryData.length - 5} more categories...</span>
                    <span className="font-medium">
                      {formatCAD(categoryData.slice(5).reduce((sum, cat) => sum + cat.amount, 0))}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t font-semibold">
                  <span className="text-gray-700">Total Operating Expenses</span>
                  <span className="text-red-700">{formatCAD(operatingExpenses)}</span>
                </div>
              </div>
            </div>

            {/* Operating Income */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-700">Operating Income (EBIT)</span>
                <div className="text-right">
                  <span className="font-bold text-gray-900 block">{formatCAD(operatingIncome)}</span>
                  <Badge variant="outline" className="text-xs bg-blue-50 border-blue-300 text-blue-700 mt-1">
                    {operatingMargin.toFixed(1)}% margin
                  </Badge>
                </div>
              </div>
            </div>

            {/* Taxes */}
            <div className="pt-4 border-t">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Taxes Paid</h4>
              <div className="space-y-2 pl-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">GST (5%)</span>
                  <span className="font-medium text-green-700">{formatCAD(gstPaid)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">QST (9.975%)</span>
                  <span className="font-medium text-blue-700">{formatCAD(qstPaid)}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-gray-700 font-medium">Total Taxes</span>
                  <span className="font-bold text-purple-700">{formatCAD(totalTaxPaid)}</span>
                </div>
              </div>
            </div>

            {/* Net Income */}
            <div className="pt-4 border-t-2 border-gray-400">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">NET INCOME</span>
                <div className="text-right">
                  <span className={`text-2xl font-bold block ${
                    netIncome >= 0 ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {formatCAD(netIncome)}
                  </span>
                  <Badge className={`mt-1 ${
                    netIncome >= 0 
                      ? 'bg-green-100 text-green-700 border-green-300' 
                      : 'bg-red-100 text-red-700 border-red-300'
                  }`}>
                    {netMargin.toFixed(1)}% net margin
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Right: Chart */}
        <div className="space-y-6">
          {/* Expenses by Category Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Expenses by Category</h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value: number) => formatCAD(value)}
                    labelStyle={{ color: '#000' }}
                  />
                  <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No expense data available
              </div>
            )}
          </Card>

          {/* Breakdown Table */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Expense Breakdown</h3>
            <div className="space-y-2">
              {categoryData.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    <span className="text-sm font-medium text-gray-700">{cat.category}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-900 block">
                      {formatCAD(cat.amount)}
                    </span>
                    <span className="text-xs text-gray-500">{cat.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Key Metrics */}
      <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50">
        <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Key Financial Ratios</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Gross Margin</p>
            <p className="text-xl font-bold text-indigo-700">{grossProfitMargin.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Operating Margin</p>
            <p className="text-xl font-bold text-purple-700">{operatingMargin.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Net Margin</p>
            <p className={`text-xl font-bold ${netMargin >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {netMargin.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Tax Rate</p>
            <p className="text-xl font-bold text-blue-700">
              {revenue > 0 ? (totalTaxPaid / revenue * 100).toFixed(1) : 0}%
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
