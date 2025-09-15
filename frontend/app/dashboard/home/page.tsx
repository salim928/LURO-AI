// frontend/app/dashboard/home/page.tsx
// Create this new file for the Home section

'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { 
  Brain, 
  BarChart3, 
  TrendingUp, 
  Database, 
  Zap, 
  MessageSquare,
  ArrowRight,
  BookOpen,
  PlayCircle,
  FileText,
  HelpCircle
} from 'lucide-react';

export default function DashboardHomePage() {
  const { user, profile } = useAuth();
  const router = useRouter();

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Hero */}
      <section className="text-center py-8 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-on-surface mb-4">
          Welcome to Your AI Analytics Hub
        </h1>
        <p className="text-lg muted mb-6 max-w-2xl mx-auto">
          Transform your business data into actionable insights with AI-powered analytics 
          designed specifically for Ghana businesses.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button 
            onClick={() => router.push('/dashboard/query')}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Brain className="w-5 h-5" />
            Start AI Analysis
          </button>
          <button 
            onClick={() => router.push('/dashboard/data-sources')}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Database className="w-5 h-5" />
            Connect Data
          </button>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface p-4 rounded-lg border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-5 h-5 text-accent" />
            <span className="text-xs text-green-400">+12%</span>
          </div>
          <div className="text-2xl font-bold text-on-surface">12</div>
          <div className="text-sm muted">Total Analyses</div>
        </div>
        
        <div className="bg-surface p-4 rounded-lg border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <Database className="w-5 h-5 text-accent" />
            <span className="text-xs muted">Active</span>
          </div>
          <div className="text-2xl font-bold text-on-surface">3</div>
          <div className="text-sm muted">Data Sources</div>
        </div>
        
        <div className="bg-surface p-4 rounded-lg border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <Brain className="w-5 h-5 text-accent" />
            <span className="text-xs text-green-400">+8%</span>
          </div>
          <div className="text-2xl font-bold text-on-surface">47</div>
          <div className="text-sm muted">Insights Generated</div>
        </div>
        
        <div className="bg-surface p-4 rounded-lg border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            <span className="text-xs text-green-400">+23%</span>
          </div>
          <div className="text-2xl font-bold text-on-surface">₵25k</div>
          <div className="text-sm muted">Cost Savings</div>
        </div>
      </section>

      {/* Features Grid */}
      <section>
        <h2 className="text-2xl font-bold text-on-surface mb-6">What You Can Do</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div 
            className="card hover:shadow-xl transition-all duration-300 cursor-pointer group"
            onClick={() => router.push('/dashboard/query')}
          >
            <div className="p-6">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 border border-accent/20 group-hover:bg-accent/20 transition-colors">
                <Brain className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-on-surface mb-2">Ask AI Questions</h3>
              <p className="muted mb-4">
                Get instant insights by asking questions in plain English about your business data.
              </p>
              <span className="text-accent flex items-center gap-1 text-sm">
                Try it now <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          <div 
            className="card hover:shadow-xl transition-all duration-300 cursor-pointer group"
            onClick={() => router.push('/dashboard/data-sources')}
          >
            <div className="p-6">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 border border-accent/20 group-hover:bg-accent/20 transition-colors">
                <Database className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-on-surface mb-2">Connect Your Data</h3>
              <p className="muted mb-4">
                Link databases, CSV files, and business systems to unlock powerful analytics.
              </p>
              <span className="text-accent flex items-center gap-1 text-sm">
                Connect now <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          <div 
            className="card hover:shadow-xl transition-all duration-300 cursor-pointer group"
            onClick={() => router.push('/dashboard/reports')}
          >
            <div className="p-6">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 border border-accent/20 group-hover:bg-accent/20 transition-colors">
                <FileText className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-on-surface mb-2">Generate Reports</h3>
              <p className="muted mb-4">
                Create professional reports with charts, insights, and recommendations.
              </p>
              <span className="text-accent flex items-center gap-1 text-sm">
                Create report <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-xl font-semibold text-on-surface mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent" />
            Getting Started Guide
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-400 text-sm">1</span>
              </div>
              <div>
                <p className="text-sm font-medium text-on-surface">Connect your data source</p>
                <p className="text-xs muted">Upload CSV or connect your database</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-400 text-sm">2</span>
              </div>
              <div>
                <p className="text-sm font-medium text-on-surface">Ask questions in plain English</p>
                <p className="text-xs muted">"What are my best-selling products?"</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-400 text-sm">3</span>
              </div>
              <div>
                <p className="text-sm font-medium text-on-surface">Get actionable insights</p>
                <p className="text-xs muted">Receive recommendations with implementation plans</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-xl font-semibold text-on-surface mb-4 flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-accent" />
            Resources & Support
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-colors flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-muted" />
                <span className="text-sm text-on-surface">Watch video tutorials</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent" />
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-colors flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-muted" />
                <span className="text-sm text-on-surface">Read documentation</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent" />
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-colors flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-4 h-4 text-muted" />
                <span className="text-sm text-on-surface">Contact support</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}