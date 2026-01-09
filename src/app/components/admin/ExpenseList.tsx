import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { FileText, Trash2, Download, Edit } from 'lucide-react';
import { formatCAD } from '../../config/pricing';

interface Expense {
  id: string;
  date: string;
  vendor: string;
  category: string;
  amount: number;
  description: string;
  receiptUrl: string | null;
  gstAmount?: number;
  qstAmount?: number;
  createdAt: string;
}

interface ExpenseListProps {
  expenses: Expense[];
  onDelete?: (id: string) => void;
  onEdit?: (expense: Expense) => void;
}

export function ExpenseList({ expenses, onDelete, onEdit }: ExpenseListProps) {
  const exportToCSV = () => {
    const headers = ['Date', 'Vendor', 'Category', 'Amount', 'GST', 'QST', 'Total Tax', 'Total', 'Description'];
    const rows = expenses.map(exp => {
      const gst = exp.gstAmount || 0;
      const qst = exp.qstAmount || 0;
      const totalTax = gst + qst;
      const total = exp.amount + totalTax;
      
      return [
        exp.date,
        exp.vendor,
        exp.category,
        exp.amount.toFixed(2),
        gst.toFixed(2),
        qst.toFixed(2),
        totalTax.toFixed(2),
        total.toFixed(2),
        exp.description || ''
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `\"${cell}\"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Office Supplies': 'bg-blue-100 text-blue-700 border-blue-300',
      'Software & Tools': 'bg-purple-100 text-purple-700 border-purple-300',
      'Marketing & Advertising': 'bg-pink-100 text-pink-700 border-pink-300',
      'Professional Fees': 'bg-indigo-100 text-indigo-700 border-indigo-300',
      'Bank Fees': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'Internet & Phone': 'bg-cyan-100 text-cyan-700 border-cyan-300',
      'Rent & Utilities': 'bg-orange-100 text-orange-700 border-orange-300',
      'Insurance': 'bg-red-100 text-red-700 border-red-300',
      'Travel': 'bg-teal-100 text-teal-700 border-teal-300',
      'Meals & Entertainment': 'bg-green-100 text-green-700 border-green-300',
      'Other': 'bg-gray-100 text-gray-700 border-gray-300'
    };
    return colors[category] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  if (expenses.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-gray-500">No expenses found. Add your first expense to get started!</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">All Expenses</h3>
          <p className="text-sm text-gray-500 mt-1">{expenses.length} expense{expenses.length !== 1 ? 's' : ''}</p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={exportToCSV}
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="space-y-3">
        {expenses.map((expense) => (
          <div 
            key={expense.id}
            className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            {/* Date */}
            <div className="flex-shrink-0 text-center">
              <div className="text-xs text-gray-500 uppercase">
                {new Date(expense.date).toLocaleDateString('en', { month: 'short' })}
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {new Date(expense.date).getDate()}
              </div>
              <div className="text-xs text-gray-500">
                {new Date(expense.date).getFullYear()}
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{expense.vendor}</h4>
                  {expense.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{expense.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getCategoryColor(expense.category)}>
                      {expense.category}
                    </Badge>
                    {expense.gstAmount && expense.gstAmount > 0 && (
                      <Badge variant="outline" className="text-xs bg-green-50 border-green-300 text-green-700">
                        GST: {formatCAD(expense.gstAmount)}
                      </Badge>
                    )}
                    {expense.qstAmount && expense.qstAmount > 0 && (
                      <Badge variant="outline" className="text-xs bg-blue-50 border-blue-300 text-blue-700">
                        QST: {formatCAD(expense.qstAmount)}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0 text-right">
                  <div className="text-lg font-bold text-gray-900">
                    {formatCAD(expense.amount)}
                  </div>
                  {(expense.gstAmount || expense.qstAmount) && (
                    <div className="text-xs text-gray-500 mt-1">
                      Total: {formatCAD(expense.amount + (expense.gstAmount || 0) + (expense.qstAmount || 0))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex-shrink-0 flex items-center gap-2">
              {expense.receiptUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(expense.receiptUrl!, '_blank')}
                  title="View Receipt"
                >
                  <FileText className="w-4 h-4" />
                </Button>
              )}
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(expense)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  title="Edit Expense"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(expense.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  title="Delete Expense"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}