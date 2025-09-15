// frontend/app/(landing)/HomePageClient.tsx
// Client Component - Uses hooks and browser features
// This is a NEW FILE you need to create

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Brain, BarChart3, TrendingUp, Database, Zap, MessageSquare } from 'lucide-react';

export default function HomePageClient() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-2 border-accent border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-4xl md:text-6xl font-bold text-on-surface mb-6 leading-tight">
          Turn Your Business Data Into
          <span className="text-accent block mt-2">Actionable Insights</span>
        </h1>
        <p className="text-xl muted mb-8 max-w-3xl mx-auto leading-relaxed">
          Connect your databases, ask questions in plain English, and get AI-powered recommendations 
          that drive real results for your Ghana-based business.
        </p>
        
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button 
            onClick={() => router.push('/onboarding')}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Brain className="w-5 h-5" />
            Start Free Analysis
          </button>
          <button className="btn-secondary inline-flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Watch Demo
          </button>
        </div>
        
        <p className="text-sm muted mt-6">
          14-day free trial • No credit card required • Setup in minutes
        </p>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-on-surface mb-4">
            Built for Ghana Businesses
          </h2>
          <p className="text-lg muted max-w-2xl mx-auto">
            Everything you need to make data-driven decisions, no technical expertise required
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center hover:shadow-2xl transition-all duration-300">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4 border border-accent/20">
              <Database className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-on-surface mb-3">Connect Any Data Source</h3>
            <p className="muted leading-relaxed">
              Link your existing databases, CSV files, and business systems. 
              Works with QuickBooks, Excel, MySQL, and more.
            </p>
          </div>

          <div className="card text-center hover:shadow-2xl transition-all duration-300">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4 border border-accent/20">
              <Brain className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-on-surface mb-3">Ask in Plain English</h3>
            <p className="muted leading-relaxed">
              "Which products sell best in Accra?" "How can I reduce costs?" 
              No complex queries or formulas needed.
            </p>
          </div>

          <div className="card text-center hover:shadow-2xl transition-all duration-300">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4 border border-accent/20">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-on-surface mb-3">Get Actionable Insights</h3>
            <p className="muted leading-relaxed">
              Receive specific recommendations with timelines, expected impact, 
              and step-by-step implementation guides.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="hero-gradient rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-on-surface mb-4">
            Ready to Transform Your Business with Data?
          </h2>
          <p className="text-xl muted mb-8 max-w-2xl mx-auto">
            Join hundreds of Ghana businesses already making smarter decisions with AI
          </p>
          
          <button 
            onClick={() => router.push('/onboarding')}
            className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4"
          >
            <Zap className="w-5 h-5" />
            Start Your Free Trial
          </button>
          
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="panel text-center py-4">
              <div className="text-3xl font-bold text-accent mb-2">500+</div>
              <div className="muted">Businesses Trust Us</div>
            </div>
            <div className="panel text-center py-4">
              <div className="text-3xl font-bold text-accent mb-2">50,000+</div>
              <div className="muted">Insights Generated</div>
            </div>
            <div className="panel text-center py-4">
              <div className="text-3xl font-bold text-accent mb-2">₵2M+</div>
              <div className="muted">Savings Identified</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Options */}
      <section className="py-12">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-on-surface mb-4">Get Started Today</h3>
          <p className="muted">Choose the path that's right for your business</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div 
            className="panel p-6 cursor-pointer hover:bg-white/[0.02] transition-colors group"
            onClick={() => router.push('/onboarding')}
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center border border-accent/20 group-hover:bg-accent/20 transition-colors">
                <Brain className="w-5 h-5 text-accent" />
              </div>
              <h4 className="text-lg font-semibold text-on-surface">New to AI Analytics</h4>
            </div>
            <p className="muted">Start with our guided onboarding and sample data to see AI insights in action.</p>
          </div>

          <div 
            className="panel p-6 cursor-pointer hover:bg-white/[0.02] transition-colors group"
            onClick={() => router.push('/sign-in')}
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center border border-accent/20 group-hover:bg-accent/20 transition-colors">
                <BarChart3 className="w-5 h-5 text-accent" />
              </div>
              <h4 className="text-lg font-semibold text-on-surface">Returning User</h4>
            </div>
            <p className="muted">Sign in to access your dashboard, saved queries, and business insights.</p>
          </div>
        </div>
      </section>
    </>
  );
}