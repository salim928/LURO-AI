
// ============================================
// frontend/app/dashboard/home/quick-actions/page.tsx
// ============================================
'use client';

import { useRouter } from 'next/navigation';
import { 
  Upload, 
  Brain, 
  FileText, 
  Database, 
  Users, 
  Settings,
  TrendingUp,
  Download
} from 'lucide-react';

export default function QuickActionsPage() {
  const router = useRouter();

  const actions = [
    {
      title: 'Upload CSV File',
      description: 'Quick upload and analyze CSV data',
      icon: Upload,
      color: 'bg-blue-500',
      action: () => router.push('/dashboard/data-sources')
    },
    {
      title: 'Ask AI Question',
      description: 'Get instant insights from your data',
      icon: Brain,
      color: 'bg-purple-500',
      action: () => router.push('/dashboard/query')
    },
    {
      title: 'Generate Report',
      description: 'Create professional business reports',
      icon: FileText,
      color: 'bg-green-500',
      action: () => router.push('/dashboard/reports')
    },
    {
      title: 'View Analytics',
      description: 'Track business performance metrics',
      icon: TrendingUp,
      color: 'bg-orange-500',
      action: () => router.push('/dashboard/analytics')
    },
    {
      title: 'Manage Data Sources',
      description: 'Connect and manage your databases',
      icon: Database,
      color: 'bg-indigo-500',
      action: () => router.push('/dashboard/data-sources')
    },
    {
      title: 'Team Settings',
      description: 'Manage team members and permissions',
      icon: Users,
      color: 'bg-pink-500',
      action: () => router.push('/dashboard/team')
    },
    {
      title: 'Export Data',
      description: 'Download your data and reports',
      icon: Download,
      color: 'bg-teal-500',
      action: () => router.push('/dashboard/reports')
    },
    {
      title: 'Account Settings',
      description: 'Manage your account and preferences',
      icon: Settings,
      color: 'bg-gray-500',
      action: () => router.push('/dashboard/settings')
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-on-surface mb-2">Quick Actions</h1>
      <p className="text-muted mb-8">Common tasks and workflows at your fingertips</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.action}
              className="card p-6 hover:shadow-xl transition-all duration-300 text-left group"
            >
              <div className={`w-12 h-12 ${action.color}/10 rounded-lg flex items-center justify-center mb-4 group-hover:${action.color}/20 transition-colors`}>
                <Icon className={`w-6 h-6 text-white`} style={{ color: action.color.replace('bg-', '') }} />
              </div>
              <h3 className="font-semibold text-on-surface mb-2">{action.title}</h3>
              <p className="text-sm muted">{action.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
