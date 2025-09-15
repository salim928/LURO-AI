// 2. CREATE: frontend/components/dashboard/Sidebar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Brain, 
  Database, 
  Home, 
  Settings, 
  Users, 
  FileText,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface User {
  id: string;
  name: string;
  email: string;
  organization: string;
  role: 'admin' | 'user' | 'viewer';
  subscription: 'free' | 'professional' | 'enterprise';
  avatar?: string;
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: (collapsed: boolean) => void;
  user: User;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'AI Query', href: '/dashboard/query', icon: Brain },
  { name: 'Data Sources', href: '/dashboard/data-sources', icon: Database },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Reports', href: '/dashboard/reports', icon: FileText },
  { name: 'Team', href: '/dashboard/team', icon: Users },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar({ collapsed, onToggle, user }: SidebarProps) {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const { showToast } = require('@/providers/ToastProvider');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      showToast('success', 'Signed out', 'You have been signed out successfully.');
    } catch (error) {
      console.error('Logout error:', error);
  showToast('error', 'Sign out failed', (error as any).message || 'Please try again.');
      setIsLoggingOut(false);
    }
  };

  return (
    <div className={`${
      collapsed ? 'w-16' : 'w-64'
    } transition-all duration-300 ease-in-out bg-[rgba(255,255,255,0.02)] border-r border-[rgba(255,255,255,0.04)] flex flex-col`}>
      
      {/* Header */}
      <div className="p-4 border-b border-[rgba(255,255,255,0.04)]">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-on-surface">AI Data Scientist</h2>
                <p className="text-xs text-muted">Analytics Platform</p>
              </div>
            </div>
          )}
          <button
            onClick={() => onToggle(!collapsed)}
            className="p-1 rounded-md hover:bg-[rgba(255,255,255,0.05)] text-muted hover:text-on-surface transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`${
                isActive 
                  ? 'bg-accent/10 text-accent border-accent/20' 
                  : 'text-muted hover:text-on-surface hover:bg-[rgba(255,255,255,0.02)]'
              } group flex items-center px-3 py-2 text-sm font-medium rounded-lg border border-transparent transition-all duration-200`}
            >
              <item.icon className={`${
                collapsed ? 'w-5 h-5' : 'w-5 h-5 mr-3'
              } flex-shrink-0`} />
              {!collapsed && item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-[rgba(255,255,255,0.04)]">
        {!collapsed ? (
          <div className="space-y-3">
            {/* User Info */}
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-[rgba(255,255,255,0.02)]">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                ) : (
                  <User className="w-4 h-4 text-accent" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-on-surface truncate">{user.name}</p>
                <p className="text-xs text-muted truncate">{user.organization}</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
            >
              <LogOut className="w-4 h-4 mr-3" />
              {isLoggingOut ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Collapsed User Avatar */}
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                ) : (
                  <User className="w-4 h-4 text-accent" />
                )}
              </div>
            </div>
            
            {/* Collapsed Logout */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex justify-center p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
