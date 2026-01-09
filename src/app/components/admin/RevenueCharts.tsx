import { Card } from '../ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCAD } from '../../config/pricing';

interface MonthlyRevenueChartProps {
  data: Array<{
    month: string;
    monthName: string;
    revenue: number;
  }>;
}

export function MonthlyRevenueChart({ data }: MonthlyRevenueChartProps) {
  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border rounded-lg shadow-lg p-3">
          <p className="font-medium text-gray-900">{payload[0].payload.monthName}</p>
          <p className="text-sm text-blue-600 font-semibold mt-1">
            {formatCAD(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Monthly Revenue</h3>
        <p className="text-sm text-gray-500 mt-1">Revenue trends throughout the year</p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
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
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#3b82f6" 
            strokeWidth={3}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

interface ServiceTypeChartProps {
  data: Array<{
    serviceType: string;
    revenue: number;
    count: number;
  }>;
}

export function ServiceTypeChart({ data }: ServiceTypeChartProps) {
  // Format service type names
  const formatServiceName = (name: string) => {
    if (name === 'personal-basic') return 'Basic';
    if (name === 'personal-standard') return 'Standard';
    if (name === 'personal-complex') return 'Complex';
    if (name === 'personal-quebec') return 'Quebec';
    if (name === 'business-self-employed') return 'Self-Employed';
    if (name === 'business-small') return 'Small Business';
    if (name === 'business-corporate') return 'Corporate';
    if (name === 'custom') return 'Custom';
    return name;
  };

  const formattedData = data.map(item => ({
    ...item,
    name: formatServiceName(item.serviceType)
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border rounded-lg shadow-lg p-3">
          <p className="font-medium text-gray-900">{payload[0].payload.name}</p>
          <p className="text-sm text-green-600 font-semibold mt-1">
            {formatCAD(payload[0].value)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {payload[0].payload.count} filing{payload[0].payload.count !== 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Revenue by Service Type</h3>
        <p className="text-sm text-gray-500 mt-1">Breakdown by service categories</p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="revenue" 
            fill="#10b981" 
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
