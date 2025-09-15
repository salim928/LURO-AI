// ============================================
// frontend/app/dashboard/home/getting-started/page.tsx
// ============================================
'use client';

import { useState } from 'react';
import { CheckCircle, Circle, Database, Brain, FileText, TrendingUp } from 'lucide-react';

export default function GettingStartedPage() {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleStep = (stepId: number) => {
    setCompletedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const steps = [
    {
      id: 1,
      title: 'Connect Your First Data Source',
      description: 'Upload a CSV file or connect to your database to begin analyzing your business data.',
      icon: Database,
      action: '/dashboard/data-sources'
    },
    {
      id: 2,
      title: 'Run Your First AI Query',
      description: 'Ask a question about your data in plain English and get instant insights.',
      icon: Brain,
      action: '/dashboard/query'
    },
    {
      id: 3,
      title: 'Generate Your First Report',
      description: 'Create a professional report with charts and recommendations.',
      icon: FileText,
      action: '/dashboard/reports'
    },
    {
      id: 4,
      title: 'Review Analytics Dashboard',
      description: 'Explore your business metrics and track performance over time.',
      icon: TrendingUp,
      action: '/dashboard/analytics'
    }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-on-surface mb-2">Getting Started Guide</h1>
      <p className="text-muted mb-8">Complete these steps to unlock the full power of AI analytics</p>

      <div className="space-y-4">
        {steps.map((step) => {
          const Icon = step.icon;
          const isCompleted = completedSteps.includes(step.id);

          return (
            <div 
              key={step.id}
              className={`card p-6 border-2 transition-all ${
                isCompleted ? 'border-green-500/50 bg-green-500/5' : 'border-white/5'
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleStep(step.id)}
                  className="mt-1"
                >
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-muted" />
                  )}
                </button>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-5 h-5 text-accent" />
                    <h3 className="text-lg font-semibold text-on-surface">
                      Step {step.id}: {step.title}
                    </h3>
                  </div>
                  <p className="text-muted mb-4">{step.description}</p>
                  <a 
                    href={step.action}
                    className="btn-secondary text-sm inline-flex items-center"
                  >
                    Get Started
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-6 bg-accent/10 rounded-lg border border-accent/20">
        <h2 className="text-xl font-semibold text-on-surface mb-3">Need Help?</h2>
        <p className="text-muted mb-4">
          Our support team is here to help you get the most out of LURO-AI.
        </p>
        <div className="flex gap-4">
          <button className="btn-primary text-sm">Contact Support</button>
          <button className="btn-secondary text-sm">Watch Tutorial</button>
        </div>
      </div>
    </div>
  );
}