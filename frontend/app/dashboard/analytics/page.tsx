// frontend/app/dashboard/analytics/page.tsx

'use client';

import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  DollarSign,
  Users,
  ShoppingCart,
  Target
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart as RePieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30days');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Mock data for charts
  const revenueData = [
    { month: 'Jan', revenue: 45000, profit: 12000, expenses: 33000 },
    { month: 'Feb', revenue: 52000, profit: 15000, expenses: 37000 },
    { month: 'Mar', revenue: 48000, profit: 13000, expenses: 35000 },
    { month: 'Apr', revenue: 61000, profit: 18000, expenses: 43000 },
    { month: 'May', revenue: 70000, profit: 22000, expenses: 48000 },
    { month: 'Jun', revenue: 68000, profit: 20000, expenses: 48000 },
    { month: 'Jul', revenue: 75000, profit: 24000, expenses: 51000 },
    { month: 'Aug', revenue: 72000, profit: 21000, expenses: 51000 },
    { month: 'Sep', revenue: 80000, profit: 26000, expenses: 54000 },
    { month: 'Oct', revenue: 85000, profit: 28000, expenses: 57000 },
    { month: 'Nov', revenue: 82000, profit: 25000, expenses: 57000 },
    { month: 'Dec', revenue: 90000, profit: 30000, expenses: 60000 }
  ];

  const categoryData = [
    { name: 'Electronics', value: 35, amount: 350000 },
    { name: 'Clothing', value: 25, amount: 250000 },
    { name: 'Food & Beverage', value: 20, amount: 200000 },
    { name: 'Services', value: 15, amount: 150000 },
    { name: 'Others', value: 5, amount: 50000 }
  ];

  const customerData = [
    { day: 'Mon', new: 45, returning: 120 },
    { day: 'Tue', new: 52, returning: 135 },
    { day: 'Wed', new: 38, returning: 128 },
    { day: 'Thu', new: 65, returning: 142 },
    { day: 'Fri', new: 72, returning: 155 },
    { day: 'Sat', new: 85, returning: 170 },
    { day: 'Sun', new: 58, returning: 145 }
  ];

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  const metrics = [
    {
      title: 'Total Revenue',
      value: '₵850,000',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-400'
    },
    {
      title: 'Total Customers',
      value: '3,842',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-400'
    },
    {
      title: 'Total Orders',
      value: '12,543',
      change: '-2.4%',
      trend: 'down',
      icon: ShoppingCart,
      color: 'text-purple-400'
    },
    {
      title: 'Conversion Rate',
      value: '3.24%',
      change: '+0.8%',
      trend: 'up',
      icon: Target,
      color: 'text-orange-400'
    }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-on-surface mb-2">Analytics Dashboard</h1>
          <p className="text-muted">Track your business performance and metrics</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 bg-surface border border-white/10 rounded-lg focus:outline-none focus:border-accent"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="12months">Last 12 months</option>
          </select>
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <RefreshCw className="w-5 h-5 text-muted" />
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${metric.color}`} />
                <span className={`text-xs flex items-center gap-1 ${
                  metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {metric.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {metric.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-on-surface">{metric.value}</div>
              <div className="text-sm muted">{metric.title}</div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-on-surface">Revenue Overview</h2>
            <BarChart3 className="w-5 h-5 text-accent" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                labelStyle={{ color: '#888' }}
              />
              <Legend />
              <Area type="monotone" dataKey="revenue" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
              <Area type="monotone" dataKey="profit" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-on-surface">Sales by Category</h2>
            <PieChart className="w-5 h-5 text-accent" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
              />
            </RePieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Customer Analytics */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-on-surface">Customer Analytics</h2>
          <Users className="w-5 h-5 text-accent" />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={customerData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="day" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
              labelStyle={{ color: '#888' }}
            />
            <Legend />
            <Bar dataKey="new" fill="#8b5cf6" name="New Customers" />
            <Bar dataKey="returning" fill="#6366f1" name="Returning Customers" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Table */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-lg font-semibold text-on-surface">Top Performing Products</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface border-b border-white/5">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-muted">Product</th>
                <th className="text-left p-4 text-sm font-medium text-muted">Category</th>
                <th className="text-left p-4 text-sm font-medium text-muted">Sales</th>
                <th className="text-left p-4 text-sm font-medium text-muted">Revenue</th>
                <th className="text-left p-4 text-sm font-medium text-muted">Growth</th>
              </tr>
            </thead>
            <tbody>
              {[
                { product: 'Laptop Pro X1', category: 'Electronics', sales: 234, revenue: '₵234,000', growth: '+15%' },
                { product: 'Smart Watch S2', category: 'Electronics', sales: 189, revenue: '₵56,700', growth: '+22%' },
                { product: 'Winter Jacket', category: 'Clothing', sales: 445, revenue: '₵44,500', growth: '+8%' },
                { product: 'Coffee Maker Plus', category: 'Appliances', sales: 122, revenue: '₵36,600', growth: '+12%' },
                { product: 'Running Shoes V3', category: 'Sports', sales: 334, revenue: '₵33,400', growth: '-5%' }
              ].map((item, index) => (
                <tr key={index} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="p-4 text-sm text-on-surface">{item.product}</td>
                  <td className="p-4 text-sm text-muted">{item.category}</td>
                  <td className="p-4 text-sm text-muted">{item.sales}</td>
                  <td className="p-4 text-sm text-on-surface font-medium">{item.revenue}</td>
                  <td className="p-4">
                    <span className={`text-sm ${
                      item.growth.startsWith('+') ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {item.growth}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}