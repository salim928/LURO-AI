// frontend/app/dashboard/reports/page.tsx

'use client';

import { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Download, 
  Share2, 
  Calendar,
  TrendingUp,
  BarChart3,
  PieChart,
  Filter,
  Search,
  Clock,
  Eye
} from 'lucide-react';

interface Report {
  id: string;
  title: string;
  description: string;
  type: 'sales' | 'marketing' | 'financial' | 'custom';
  status: 'draft' | 'published' | 'scheduled';
  createdDate: string;
  lastModified: string;
  author: string;
  views: number;
  scheduled?: string;
}

export default function ReportsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [reportType, setReportType] = useState<'sales' | 'marketing' | 'financial' | 'custom'>('sales');
  const [filterType, setFilterType] = useState<'all' | 'draft' | 'published' | 'scheduled'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const [reports] = useState<Report[]>([
    {
      id: '1',
      title: 'Q4 2024 Sales Performance',
      description: 'Comprehensive analysis of sales metrics and revenue trends',
      type: 'sales',
      status: 'published',
      createdDate: '2024-12-01',
      lastModified: '2024-12-15',
      author: 'John Doe',
      views: 245
    },
    {
      id: '2',
      title: 'Marketing Campaign ROI Analysis',
      description: 'Campaign performance metrics and conversion rates',
      type: 'marketing',
      status: 'published',
      createdDate: '2024-11-20',
      lastModified: '2024-12-10',
      author: 'Jane Smith',
      views: 189
    },
    {
      id: '3',
      title: 'Monthly Financial Summary',
      description: 'P&L statement and cash flow analysis',
      type: 'financial',
      status: 'scheduled',
      createdDate: '2024-12-05',
      lastModified: '2024-12-14',
      author: 'John Doe',
      views: 92,
      scheduled: '2024-12-31'
    },
    {
      id: '4',
      title: 'Customer Insights Report',
      description: 'Customer behavior patterns and satisfaction metrics',
      type: 'custom',
      status: 'draft',
      createdDate: '2024-12-10',
      lastModified: '2024-12-16',
      author: 'Mike Johnson',
      views: 15
    }
  ]);

  const typeColors = {
    sales: 'bg-blue-500/20 text-blue-400',
    marketing: 'bg-purple-500/20 text-purple-400',
    financial: 'bg-green-500/20 text-green-400',
    custom: 'bg-orange-500/20 text-orange-400'
  };

  const statusColors = {
    draft: 'bg-gray-500/20 text-gray-400',
    published: 'bg-green-500/20 text-green-400',
    scheduled: 'bg-yellow-500/20 text-yellow-400'
  };

  const filteredReports = reports.filter(report => {
    const matchesFilter = filterType === 'all' || report.status === filterType;
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          report.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const reportTemplates = [
    {
      type: 'sales',
      title: 'Sales Report',
      icon: TrendingUp,
      description: 'Track revenue, deals, and sales team performance'
    },
    {
      type: 'marketing',
      title: 'Marketing Report',
      icon: BarChart3,
      description: 'Analyze campaign performance and ROI'
    },
    {
      type: 'financial',
      title: 'Financial Report',
      icon: PieChart,
      description: 'P&L statements and financial metrics'
    },
    {
      type: 'custom',
      title: 'Custom Report',
      icon: FileText,
      description: 'Build your own report from scratch'
    }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-on-surface mb-2">Reports</h1>
          <p className="text-muted">Create and manage business reports</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-5 h-5 text-accent" />
          </div>
          <div className="text-2xl font-bold text-on-surface">{reports.length}</div>
          <div className="text-sm muted">Total Reports</div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <Eye className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-on-surface">
            {reports.reduce((sum, r) => sum + r.views, 0)}
          </div>
          <div className="text-sm muted">Total Views</div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-on-surface">
            {reports.filter(r => r.status === 'scheduled').length}
          </div>
          <div className="text-sm muted">Scheduled</div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-on-surface">
            {reports.filter(r => r.status === 'draft').length}
          </div>
          <div className="text-sm muted">Drafts</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reports..."
            className="w-full pl-10 pr-4 py-2 bg-surface border border-white/10 rounded-lg focus:outline-none focus:border-accent"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-2 bg-surface border border-white/10 rounded-lg focus:outline-none focus:border-accent"
          >
            <option value="all">All Reports</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
          <div key={report.id} className="card hover:shadow-xl transition-all duration-300 cursor-pointer">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${typeColors[report.type]}`}>
                    {report.type}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[report.status]}`}>
                  {report.status}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-on-surface mb-2">{report.title}</h3>
              <p className="text-sm muted mb-4">{report.description}</p>
              
              {report.scheduled && (
                <div className="flex items-center gap-2 mb-4 text-sm text-yellow-400">
                  <Calendar className="w-4 h-4" />
                  Scheduled for {report.scheduled}
                </div>
              )}
              
              <div className="flex items-center justify-between text-xs muted">
                <div className="flex items-center gap-4">
                  <span>By {report.author}</span>
                  <span>{report.views} views</span>
                </div>
                <span>{report.lastModified}</span>
              </div>
              
              <div className="flex items-center gap-2 mt-4">
                <button className="flex-1 btn-secondary text-sm flex items-center justify-center gap-1">
                  <Eye className="w-3 h-3" />
                  View
                </button>
                <button className="flex-1 btn-primary text-sm flex items-center justify-center gap-1">
                  <Download className="w-3 h-3" />
                  Export
                </button>
                <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <Share2 className="w-4 h-4 text-muted" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Report Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-on-surface mb-6">Create New Report</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {reportTemplates.map((template) => {
                const Icon = template.icon;
                return (
                  <button
                    key={template.type}
                    onClick={() => setReportType(template.type as any)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      reportType === template.type 
                        ? 'border-accent bg-accent/10' 
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <Icon className="w-6 h-6 text-accent mb-2" />
                    <h3 className="font-medium text-on-surface mb-1">{template.title}</h3>
                    <p className="text-xs muted">{template.description}</p>
                  </button>
                );
              })}
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">
                  Report Title
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-background border border-white/10 rounded-lg focus:outline-none focus:border-accent"
                  placeholder="Enter report title..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-2 bg-background border border-white/10 rounded-lg focus:outline-none focus:border-accent"
                  rows={3}
                  placeholder="Describe what this report will contain..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">
                  Data Range
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    className="px-4 py-2 bg-background border border-white/10 rounded-lg focus:outline-none focus:border-accent"
                  />
                  <input
                    type="date"
                    className="px-4 py-2 bg-background border border-white/10 rounded-lg focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-4 mt-6">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button className="btn-primary">
                Create Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}