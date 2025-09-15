// frontend/app/dashboard/layout.tsx
// Updated with Home section and better navigation

'use client';

import { Toaster } from '@/components/ui/toaster';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Home,
  LayoutDashboard, 
  Brain, 
  Database, 
  BarChart3, 
  FileText, 
  Users, 
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
  TrendingUp,
  Zap,
  MessageSquare
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, isLoading, signOut } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Updated navigation with Home section
  const navigation = [
    { 
      name: 'Home', 
      href: '/dashboard/home', 
      icon: Home,
      subItems: [
        { name: 'Overview', href: '/dashboard/home' },
        { name: 'Getting Started', href: '/dashboard/home/getting-started' },
        { name: 'Quick Actions', href: '/dashboard/home/quick-actions' },
        { name: 'Resources', href: '/dashboard/home/resources' },
      ]
    },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Query', href: '/dashboard/query', icon: Brain },
    { name: 'Data Sources', href: '/dashboard/data-sources', icon: Database },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Reports', href: '/dashboard/reports', icon: FileText },
    { name: 'Team', href: '/dashboard/team', icon: Users },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/sign-in');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-accent border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    // Force redirect to landing page after sign out
    router.push('/');
  };

  const handleBackToLanding = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-surface border-r border-white/5 transition-all duration-300`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/5">
            <Link href="/dashboard/home" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                AI
              </div>
              {!sidebarCollapsed && (
                <div>
                  <div className="text-lg font-semibold text-on-surface">LURO-AI</div>
                  <div className="text-xs muted">Analytics Platform</div>
                </div>
              )}
            </Link>
            {!sidebarCollapsed && (
              <button 
                onClick={handleBackToLanding}
                className="mt-4 flex items-center gap-2 text-sm muted hover:text-accent transition-colors w-full"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Landing Page
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                const isHomeSection = item.name === 'Home' && pathname.startsWith('/dashboard/home');
                
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive || isHomeSection
                          ? 'bg-accent/10 text-accent' 
                          : 'text-muted hover:bg-white/5 hover:text-on-surface'
                      }`}
                      title={sidebarCollapsed ? item.name : undefined}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {!sidebarCollapsed && <span>{item.name}</span>}
                    </Link>
                    
                    {/* Sub-items for Home section */}
                    {!sidebarCollapsed && item.subItems && isHomeSection && (
                      <ul className="ml-6 mt-2 space-y-1">
                        {item.subItems.map((subItem) => (
                          <li key={subItem.name}>
                            <Link
                              href={subItem.href}
                              className={`block px-3 py-1.5 text-sm rounded-lg transition-colors ${
                                pathname === subItem.href
                                  ? 'bg-accent/5 text-accent' 
                                  : 'text-muted hover:bg-white/5 hover:text-on-surface'
                              }`}
                            >
                              {subItem.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User info & Sign out */}
          <div className="p-4 border-t border-white/5">
            {!sidebarCollapsed && (
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                    <Users className="w-4 h-4 text-accent" />
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-on-surface">
                      {profile?.name || user?.email?.split('@')[0] || 'User'}
                    </div>
                    <div className="text-xs muted">
                      {profile?.organization || 'Sample Company'}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={handleSignOut}
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-center gap-2'} px-3 py-2 rounded-lg text-muted hover:bg-white/5 hover:text-on-surface transition-colors`}
              title={sidebarCollapsed ? 'Sign Out' : undefined}
            >
              <LogOut className="w-4 h-4" />
              {!sidebarCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="bg-surface border-b border-white/5 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <Menu className="w-5 h-5 text-muted" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-on-surface">
                  Welcome back, {profile?.name || user?.email?.split('@')[0] || 'John'}
                </h1>
                <p className="text-sm muted">
                  {profile?.organization || 'Sample Company'} • {profile?.subscription || 'free'} plan
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="search"
                placeholder="Search..."
                className="px-4 py-2 bg-background border border-white/10 rounded-lg text-sm focus:outline-none focus:border-accent"
              />
              <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                <Settings className="w-5 h-5 text-muted" />
              </button>
              <button className="btn-primary text-sm">
                {profile?.subscription === 'free' ? 'Upgrade' : profile?.subscription || 'Free'}
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 bg-background overflow-auto">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-surface border-t border-white/5 px-6 py-4">
          <div className="text-center text-xs muted">
            © {new Date().getFullYear()} LURO-AI — Built for Ghana SMEs
          </div>
        </footer>
      </div>
    </div>
  );
}