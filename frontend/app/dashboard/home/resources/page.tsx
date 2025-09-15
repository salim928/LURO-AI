
// ============================================
// frontend/app/dashboard/home/resources/page.tsx
// ============================================
'use client';

import { Book, Video, FileText, HelpCircle, MessageCircle, Download } from 'lucide-react';

export default function ResourcesPage() {
  const resources = [
    {
      category: 'Documentation',
      icon: Book,
      items: [
        { title: 'Getting Started Guide', description: 'Learn the basics of LURO=AI' },
        { title: 'API Documentation', description: 'Integrate with your existing systems' },
        { title: 'Data Source Setup', description: 'Connect various data sources' },
        { title: 'Query Language Guide', description: 'Master AI-powered queries' }
      ]
    },
    {
      category: 'Video Tutorials',
      icon: Video,
      items: [
        { title: 'Platform Overview', description: '10-minute introduction video' },
        { title: 'Connecting Data Sources', description: 'Step-by-step walkthrough' },
        { title: 'Creating Reports', description: 'Generate professional reports' },
        { title: 'Advanced Analytics', description: 'Deep dive into analytics features' }
      ]
    },
    {
      category: 'Templates',
      icon: FileText,
      items: [
        { title: 'Sales Report Template', description: 'Ready-to-use sales analysis' },
        { title: 'Marketing Dashboard', description: 'Track marketing metrics' },
        { title: 'Financial Analysis', description: 'Financial reporting template' },
        { title: 'Customer Insights', description: 'Customer behavior analysis' }
      ]
    },
    {
      category: 'Support',
      icon: HelpCircle,
      items: [
        { title: 'FAQ', description: 'Frequently asked questions' },
        { title: 'Contact Support', description: 'Get help from our team' },
        { title: 'Community Forum', description: 'Connect with other users' },
        { title: 'Feature Requests', description: 'Suggest new features' }
      ]
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-on-surface mb-2">Resources & Learning</h1>
      <p className="text-muted mb-8">Everything you need to master AI-powered analytics</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map((section, index) => {
          const Icon = section.icon;
          return (
            <div key={index} className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <h2 className="text-xl font-semibold text-on-surface">{section.category}</h2>
              </div>
              
              <div className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-on-surface group-hover:text-accent">
                          {item.title}
                        </h3>
                        <p className="text-xs muted mt-1">{item.description}</p>
                      </div>
                      <Download className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 card p-6 bg-gradient-to-r from-indigo-600/10 to-purple-600/10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-on-surface mb-2">Need Personal Assistance?</h2>
            <p className="text-muted">Our support team is available 24/7 to help you succeed</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Start Live Chat
          </button>
        </div>
      </div>
    </div>
  );
}