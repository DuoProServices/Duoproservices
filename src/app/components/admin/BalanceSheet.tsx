import { Card } from '../ui/card';
import { formatCAD } from '../../config/pricing';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface BalanceSheetProps {
  year: number;
  revenue: number;
  expenses: number;
  netProfit: number;
}

export function BalanceSheet({ year, revenue, expenses, netProfit }: BalanceSheetProps) {
  // ASSETS
  const cashAndBank = netProfit > 0 ? netProfit : 0; // Simplified: profit goes to cash
  const accountsReceivable = 0; // Could track pending invoices
  const currentAssets = cashAndBank + accountsReceivable;
  const totalAssets = currentAssets;

  // LIABILITIES
  const accountsPayable = 0; // Could track unpaid expenses
  const taxesPayable = 0; // Could track tax obligations
  const currentLiabilities = accountsPayable + taxesPayable;
  const totalLiabilities = currentLiabilities;

  // EQUITY
  const retainedEarnings = netProfit;
  const ownerEquity = 0; // Could track initial investment
  const totalEquity = retainedEarnings + ownerEquity;

  // Verify accounting equation: Assets = Liabilities + Equity
  const isBalanced = Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Balance Sheet (Bilan)</h2>
        <p className="text-gray-600 mt-1">As of December 31, {year}</p>
      </div>

      {/* Accounting Equation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium">ASSETS</p>
              <h3 className="text-2xl font-bold text-blue-900 mt-1">
                {formatCAD(totalAssets)}
              </h3>
            </div>
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 font-medium">LIABILITIES</p>
              <h3 className="text-2xl font-bold text-red-900 mt-1">
                {formatCAD(totalLiabilities)}
              </h3>
            </div>
            <TrendingDown className="w-8 h-8 text-red-600" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium">EQUITY</p>
              <h3 className="text-2xl font-bold text-green-900 mt-1">
                {formatCAD(totalEquity)}
              </h3>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </Card>
      </div>

      {/* Balanced Indicator */}
      {isBalanced && (
        <div className="flex items-center justify-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <p className="text-sm text-green-700 font-medium">
            ✓ Balance Sheet is balanced: Assets = Liabilities + Equity
          </p>
        </div>
      )}

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ASSETS */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            Assets
          </h3>
          
          <div className="space-y-4">
            {/* Current Assets */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Current Assets</h4>
              <div className="space-y-2 pl-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Cash & Bank</span>
                  <span className="font-medium">{formatCAD(cashAndBank)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Accounts Receivable</span>
                  <span className="font-medium">{formatCAD(accountsReceivable)}</span>
                </div>
                <div className="flex items-center justify-between text-sm pt-2 border-t">
                  <span className="text-gray-700 font-medium">Total Current Assets</span>
                  <span className="font-bold">{formatCAD(currentAssets)}</span>
                </div>
              </div>
            </div>

            {/* Fixed Assets */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Fixed Assets</h4>
              <div className="space-y-2 pl-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Equipment & Property</span>
                  <span className="font-medium">{formatCAD(0)}</span>
                </div>
              </div>
            </div>

            {/* Total Assets */}
            <div className="pt-4 border-t-2 border-blue-300">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-blue-900">TOTAL ASSETS</span>
                <span className="text-xl font-bold text-blue-900">{formatCAD(totalAssets)}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* LIABILITIES & EQUITY */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            Liabilities & Equity
          </h3>
          
          <div className="space-y-4">
            {/* Current Liabilities */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Current Liabilities</h4>
              <div className="space-y-2 pl-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Accounts Payable</span>
                  <span className="font-medium">{formatCAD(accountsPayable)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Taxes Payable</span>
                  <span className="font-medium">{formatCAD(taxesPayable)}</span>
                </div>
                <div className="flex items-center justify-between text-sm pt-2 border-t">
                  <span className="text-gray-700 font-medium">Total Liabilities</span>
                  <span className="font-bold text-red-700">{formatCAD(totalLiabilities)}</span>
                </div>
              </div>
            </div>

            {/* Equity */}
            <div className="pt-4 border-t">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Owner's Equity</h4>
              <div className="space-y-2 pl-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Owner's Capital</span>
                  <span className="font-medium">{formatCAD(ownerEquity)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Retained Earnings</span>
                  <span className="font-medium text-green-700">{formatCAD(retainedEarnings)}</span>
                </div>
                <div className="flex items-center justify-between text-sm pt-2 border-t">
                  <span className="text-gray-700 font-medium">Total Equity</span>
                  <span className="font-bold text-green-700">{formatCAD(totalEquity)}</span>
                </div>
              </div>
            </div>

            {/* Total Liabilities + Equity */}
            <div className="pt-4 border-t-2 border-gray-300">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">TOTAL LIAB. + EQUITY</span>
                <span className="text-xl font-bold text-gray-900">
                  {formatCAD(totalLiabilities + totalEquity)}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Notes */}
      <Card className="p-6 bg-gray-50">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">📝 Notes</h4>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>• This is a simplified balance sheet based on available data</li>
          <li>• Cash & Bank includes net profit for the year</li>
          <li>• Retained Earnings represents accumulated profits</li>
          <li>• For a complete balance sheet, consider adding: inventory, fixed assets, loans, etc.</li>
        </ul>
      </Card>
    </div>
  );
}
