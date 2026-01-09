import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Download, ExternalLink } from 'lucide-react';
import { formatCAD, getPricingName } from '../../config/pricing';

interface Transaction {
  id: string;
  clientName: string;
  clientEmail: string;
  year: number;
  amount: number;
  status: string;
  province: string;
  serviceType: string;
  paymentMethod?: string;
  paidAt?: string;
  createdAt?: string;
  invoiceNumber?: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  onClientClick?: (clientId: string) => void;
}

export function TransactionTable({ transactions, onClientClick }: TransactionTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-700 border-green-300">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-700 border-amber-300">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatServiceType = (type: string) => {
    return getPricingName(type, 'en');
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Client', 'Email', 'Year', 'Service', 'Province', 'Amount', 'Status', 'Invoice'];
    const rows = transactions.map(t => [
      t.paidAt ? new Date(t.paidAt).toLocaleDateString() : 'N/A',
      t.clientName,
      t.clientEmail,
      t.year,
      formatServiceType(t.serviceType),
      t.province,
      t.amount,
      t.status,
      t.invoiceNumber || 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <p className="text-sm text-gray-500 mt-1">{transactions.length} transactions</p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={exportToCSV}
          disabled={transactions.length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {transactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left text-sm font-medium text-gray-500 pb-3 pr-4">Date</th>
                <th className="text-left text-sm font-medium text-gray-500 pb-3 pr-4">Client</th>
                <th className="text-left text-sm font-medium text-gray-500 pb-3 pr-4">Year</th>
                <th className="text-left text-sm font-medium text-gray-500 pb-3 pr-4">Service</th>
                <th className="text-left text-sm font-medium text-gray-500 pb-3 pr-4">Province</th>
                <th className="text-right text-sm font-medium text-gray-500 pb-3 pr-4">Amount</th>
                <th className="text-left text-sm font-medium text-gray-500 pb-3 pr-4">Status</th>
                <th className="text-left text-sm font-medium text-gray-500 pb-3">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr 
                  key={transaction.id} 
                  className={`border-b last:border-0 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                >
                  <td className="py-4 pr-4">
                    <span className="text-sm text-gray-900">
                      {transaction.paidAt 
                        ? new Date(transaction.paidAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })
                        : '-'
                      }
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{transaction.clientName}</p>
                      <p className="text-xs text-gray-500">{transaction.clientEmail}</p>
                    </div>
                  </td>
                  <td className="py-4 pr-4">
                    <span className="text-sm text-gray-900">{transaction.year}</span>
                  </td>
                  <td className="py-4 pr-4">
                    <span className="text-sm text-gray-700">
                      {formatServiceType(transaction.serviceType)}
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    <span className="text-sm text-gray-700">{transaction.province}</span>
                  </td>
                  <td className="py-4 pr-4 text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCAD(transaction.amount)}
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    {getStatusBadge(transaction.status)}
                  </td>
                  <td className="py-4">
                    {transaction.invoiceNumber ? (
                      <span className="text-sm font-mono text-gray-600">
                        {transaction.invoiceNumber}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex items-center justify-center py-12 text-gray-500">
          <p className="text-sm">No transactions found</p>
        </div>
      )}
    </Card>
  );
}
