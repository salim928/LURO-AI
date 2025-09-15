// frontend/app/dashboard/page.tsx
// Complete modernized dashboard with shadcn-ui toast

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, 
  Brain, 
  Database, 
  TrendingUp, 
  Zap,
  Activity,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  RefreshCw,
  Download,
  Calendar
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');
  
  const [metrics, setMetrics] = useState({
    totalAnalyses: 0,
    dataSourcesConnected: 0,
    insightsGenerated: 0,
    costSavingsIdentified: 0
  });

  // Mock chart data
  const chartData = [
    { day: 'Mon', analyses: 4, insights: 12 },
    { day: 'Tue', analyses: 6, insights: 18 },
    { day: 'Wed', analyses: 3, insights: 10 },
    { day: 'Thu', analyses: 8, insights: 24 },
    { day: 'Fri', analyses: 7, insights: 21 },
    { day: 'Sat', analyses: 5, insights: 15 },
    { day: 'Sun', analyses: 4, insights: 13 }
  ];

  // Recent activities
  const recentActivities = [
    { id: 1, type: 'query', title: 'Sales Analysis Query', time: '2 hours ago', status: 'completed' },
    { id: 2, type: 'report', title: 'Q4 Report Generated', time: '5 hours ago', status: 'completed' },
    { id: 3, type: 'data', title: 'Customer DB Synced', time: '1 day ago', status: 'syncing' },
    { id: 4, type: 'insight', title: 'New Growth Opportunity', time: '2 days ago', status: 'new' }
  ];

  useEffect(() => {
    // Simulate loading metrics with animation
    const timer = setTimeout(() => {
      setMetrics({
        totalAnalyses: 12,
        dataSourcesConnected: 3,
        insightsGenerated: 47,
        costSavingsIdentified: 25000
      });
    }, 500);

    // Show welcome message
    if (profile?.name) {
      toast({
        title: `Welcome back, ${profile.name}!`,
        description: "Your dashboard is ready",
      });
    }

    return () => clearTimeout(timer);
  }, [profile, toast]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Dashboard refreshed",
        description: "All metrics have been updated",
      });
    }, 2000);
  };

  const MetricCard = ({ title, value, change, trend, icon: Icon, color }: any) => (
    <div className="card p-6 hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color}/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <button className="p-1 hover:bg-white/5 rounded transition-colors">
          <MoreVertical className="w-4 h-4 text-muted" />
        </button>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm text-muted">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-bold text-on-surface">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </h3>
          {change && (
            <span className={`flex items-center gap-1 text-sm ${
              trend === 'up' ? 'text-green-400' : 'text-red-400'
            }`}>
              {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {change}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-on-surface mb-2">
            Dashboard Overview
          </h1>
          <p className="text-muted">Track your business analytics and performance</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-surface border border-white/10 rounded-lg text-sm focus:outline-none focus:border-accent"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          
          <button 
            onClick={handleRefresh}
            className={`p-2 hover:bg-white/5 rounded-lg transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw className="w-5 h-5 text-muted" />
          </button>
          
          <button className="btn-primary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Analyses"
          value={metrics.totalAnalyses}
          change="+12%"
          trend="up"
          icon={BarChart3}
          color="text-blue-400"
        />
        <MetricCard
          title="Data Sources"
          value={metrics.dataSourcesConnected}
          change="+1"
          trend="up"
          icon={Database}
          color="text-purple-400"
        />
        <MetricCard
          title="Insights Generated"
          value={metrics.insightsGenerated}
          change="+8%"
          trend="up"
          icon={Brain}
          color="text-green-400"
        />
        <MetricCard
          title="Cost Savings"
          value={`₵${metrics.costSavingsIdentified.toLocaleString()}`}
          change="+23%"
          trend="up"
          icon={DollarSign}
          color="text-orange-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-on-surface">Activity Overview</h2>
            <Activity className="w-5 h-5 text-accent" />
          </div>
          
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="day" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                labelStyle={{ color: '#888' }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="analyses" 
                stackId="1" 
                stroke="#6366f1" 
                fill="#6366f1" 
                fillOpacity={0.6} 
                name="Analyses"
              />
              <Area 
                type="monotone" 
                dataKey="insights" 
                stackId="1" 
                stroke="#10b981" 
                fill="#10b981" 
                fillOpacity={0.6}
                name="Insights"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-on-surface">Recent Activity</h2>
            <Calendar className="w-5 h-5 text-accent" />
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.status === 'completed' ? 'bg-green-400' :
                  activity.status === 'syncing' ? 'bg-yellow-400' :
                  'bg-blue-400'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-on-surface">{activity.title}</p>
                  <p className="text-xs text-muted">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 text-sm text-accent hover:text-accent-400 transition-colors">
            View all activity →
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
             onClick={() => {
               router.push('/dashboard/query');
               toast({
                 title: "AI Query",
                 description: "Opening AI analysis interface...",
               });
             }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-on-surface">Quick Analysis</h3>
                <p className="text-sm text-muted">Start a new AI-powered analysis</p>
              </div>
            </div>
            <ArrowUpRight className="w-5 h-5 text-muted group-hover:text-accent transition-colors" />
          </div>
          <button className="btn-primary w-full">
            Start New Analysis
          </button>
        </div>

        <div className="card p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
             onClick={() => {
               router.push('/dashboard/data-sources');
               toast({
                 title: "Data Sources",
                 description: "Opening data source manager...",
               });
             }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Database className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-on-surface">Connect Data Source</h3>
                <p className="text-sm text-muted">Add new data to expand insights</p>
              </div>
            </div>
            <ArrowUpRight className="w-5 h-5 text-muted group-hover:text-accent transition-colors" />
          </div>
          <button className="btn-secondary w-full">
            Add Data Source
          </button>
        </div>
      </div>
    </div>
  );
}