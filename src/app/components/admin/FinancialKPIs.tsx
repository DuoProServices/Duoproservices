import { Card } from '../ui/card';
import { TrendingUp, TrendingDown, DollarSign, Clock, Users, CheckCircle } from 'lucide-react';
import { formatCAD } from '../../config/pricing';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon: 'revenue' | 'pending' | 'clients' | 'average';
  color: 'blue' | 'amber' | 'green' | 'purple';
}

export function KPICard({ title, value, subtitle, trend, icon, color }: KPICardProps) {
  const iconMap = {
    revenue: DollarSign,
    pending: Clock,
    clients: Users,
    average: CheckCircle
  };

  const colorMap = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      border: 'border-blue-200'
    },
    amber: {
      bg: 'bg-amber-50',
      icon: 'text-amber-600',
      border: 'border-amber-200'
    },
    green: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      border: 'border-green-200'
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      border: 'border-purple-200'
    }
  };

  const Icon = iconMap[icon];
  const colors = colorMap[color];

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">
            {typeof value === 'number' && title.includes('$') ? formatCAD(value) : value}
          </h3>
          
          {subtitle && (
            <p className="text-sm text-gray-600">{subtitle}</p>
          )}
          
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.value > 0 ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>

        <div className={`w-12 h-12 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
      </div>
    </Card>
  );
}

interface FinancialKPIsProps {
  data: {
    totalRevenue: number;
    totalPending: number;
    averageTicket: number;
    totalClients: number;
    activeClients: number;
  };
}

export function FinancialKPIs({ data }: FinancialKPIsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard
        title="Total Revenue ($)"
        value={data.totalRevenue}
        subtitle="Paid invoices"
        icon="revenue"
        color="green"
      />
      
      <KPICard
        title="Pending Payments ($)"
        value={data.totalPending}
        subtitle="Awaiting collection"
        icon="pending"
        color="amber"
      />
      
      <KPICard
        title="Average Ticket ($)"
        value={data.averageTicket}
        subtitle="Per filing"
        icon="average"
        color="blue"
      />
      
      <KPICard
        title="Active Clients"
        value={data.activeClients}
        subtitle={`of ${data.totalClients} total`}
        icon="clients"
        color="purple"
      />
    </div>
  );
}