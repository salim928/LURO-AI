// 3. CREATE: frontend/components/dashboard/Header.tsx
'use client';

import { Bell, Search, Menu } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  organization: string;
  role: 'admin' | 'user' | 'viewer';
  subscription: 'free' | 'professional' | 'enterprise';
  avatar?: string;
}

interface HeaderProps {
  user: User;
  sidebarCollapsed: boolean;
  onSidebarToggle: () => void;
}

export default function Header({ user, sidebarCollapsed, onSidebarToggle }: HeaderProps) {
  return (
    <header className="bg-[rgba(255,255,255,0.02)] border-b border-[rgba(255,255,255,0.04)] px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onSidebarToggle}
            className="p-2 rounded-md hover:bg-[rgba(255,255,255,0.05)] text-muted hover:text-on-surface transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div>
            <h1 className="text-xl font-semibold text-on-surface">
              Welcome back, {user.name.split(' ')[0]}
            </h1>
            <p className="text-sm text-muted">
              {user.organization} • {user.subscription} plan
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-on-surface placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 w-64"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] text-muted hover:text-on-surface transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
          </button>

          {/* Subscription Badge */}
          <div className="px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
            <span className="text-xs font-medium text-accent capitalize">{user.subscription}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
