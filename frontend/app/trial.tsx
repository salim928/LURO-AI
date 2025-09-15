// frontend/app/dashboard/data-sources/page.tsx
// Updated with toast notifications

'use client';

import { useState, useRef } from 'react';
import { useToast } from '@/providers/ToastProvider';
import { 
  Database, 
  Plus, 
  Upload, 
  CheckCircle, 
  Trash2,
  Download,
  RefreshCw,
  FileSpreadsheet,
  Server,
  Cloud,
  MoreVertical,
  X
} from 'lucide-react';

interface DataSource {
  id: string;
  name: string;
  type: 'csv' | 'excel' | 'mysql' | 'postgresql' | 'api';
  status: 'connected' | 'error' | 'syncing';
  lastSync: string;
  records: number;
  size: string;
  uploadDate: string;
}

export default function DataSourcesPage() {
  const { showToast } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);
  const [sourceType, setSourceType] = useState<'file' | 'database' | 'api'>('file');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data
  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      id: '1',
      name: 'Sales_Data_2024.csv',
      type: 'csv',
      status: 'connected',
      lastSync: '2 hours ago',
      records: 15234,
      size: '2.4 MB',
      uploadDate: '2024-12-01'
    },
    {
      id: '2',
      name: 'Customer_Database',
      type: 'mysql',
      status: 'connected',
      lastSync: '5 minutes ago',
      records: 8921,
      size: '12.8 MB',
      uploadDate: '2024-11-15'
    },
    {
      id: '3',
      name: 'Inventory_Sheet.xlsx',
      type: 'excel',
      status: 'syncing',
      lastSync: 'Syncing...',
      records: 3456,
      size: '856 KB',
      uploadDate: '2024-12-10'
    }
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      
      // Simulate file upload
      setIsUploading(true);
      showToast('info', 'Uploading file...', `Processing ${file.name}`);
      
      setTimeout(() => {
        const newDataSource: DataSource = {
          id: Date.now().toString(),
          name: file.name,
          type: file.name.endsWith('.csv') ? 'csv' : 'excel',
          status: 'connected',
          lastSync: 'Just now',
          records: Math.floor(Math.random() * 10000),
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          uploadDate: new Date().toISOString().split('T')[0]
        };
        setDataSources([...dataSources, newDataSource]);
        setIsUploading(false);
        setUploadedFile(null);
        setShowAddModal(false);
        showToast('success', 'Data source added!', `${file.name} has been successfully connected`);
      }, 2000);
    }
  };

  const handleDeleteSource = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      setDataSources(dataSources.filter(source => source.id !== id));
      showToast('success', 'Data source removed', `${name} has been deleted`);
    }
  };

  const handleSync = (id: string, name: string) => {
    setDataSources(dataSources.map(source => 
      source.id === id ? { ...source, status: 'syncing', lastSync: 'Syncing...' } : source
    ));
    showToast('info', 'Syncing data...', `Refreshing ${name}`);
    
    // Simulate sync completion
    setTimeout(() => {
      setDataSources(prev => prev.map(source => 
        source.id === id ? { ...source, status: 'connected', lastSync: 'Just now' } : source
      ));
      showToast('success', 'Sync complete!', `${name} has been updated`);
    }, 3000);
  };

  const handleConnect = () => {
    if (sourceType === 'database') {
      showToast('success', 'Database connected!', 'Your database has been successfully linked');
      setShowAddModal(false);
    } else if (sourceType === 'api') {
      showToast('success', 'API connected!', 'Your API endpoint has been configured');
      setShowAddModal(false);
    }
  };

  const statusColors = {
    connected: 'bg-green-500/20 text-green-400',
    error: 'bg-red-500/20 text-red-400',
    syncing: 'bg-yellow-500/20 text-yellow-400'
  };

  const typeIcons = {
    csv: FileSpreadsheet,
    excel: FileSpreadsheet,
    mysql: Database,
    postgresql: Database,
    api: Cloud
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-on-surface mb-2">Data Sources</h1>
          <p className="text-muted">Connect and manage your business data</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Data Source
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card p-4 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-2">
            <Database className="w-5 h-5 text-accent" />
          </div>
          <div className="text-2xl font-bold text-on-surface">{dataSources.length}</div>
          <div className="text-sm muted">Total Sources</div>
        </div>
        
        <div className="card p-4 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-on-surface">
            {dataSources.filter(s => s.status === 'connected').length}
          </div>
          <div className="text-sm muted">Connected</div>
        </div>
        
        <div className="card p-4 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-2">
            <Server className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-on-surface">
            {dataSources.reduce((sum, s) => sum + s.records, 0).toLocaleString()}
          </div>
          <div className="text-sm muted">Total Records</div>
        </div>
        
        <div className="card p-4 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-2">
            <RefreshCw className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-on-surface">
            {dataSources.filter(s => s.status === 'syncing').length}
          </div>
          <div className="text-sm muted">Syncing</div>
        </div>
      </div>

      {/* Data Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dataSources.map((source) => {
          const Icon = typeIcons[source.type];
          return (
            <div key={source.id} className="card hover:shadow-xl transition-all duration-300">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-on-surface">{source.name}</h3>
                      <p className="text-xs muted">{source.type.toUpperCase()}</p>
                    </div>
                  </div>
                  <button className="p-1 hover:bg-white/5 rounded transition-colors">
                    <MoreVertical className="w-4 h-4 text-muted" />
                  </button>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="muted">Status</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[source.status]}`}>
                      {source.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="muted">Records</span>
                    <span className="text-on-surface">{source.records.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="muted">Size</span>
                    <span className="text-on-surface">{source.size}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="muted">Last Sync</span>
                    <span className="text-on-surface">{source.lastSync}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleSync(source.id, source.name)}
                    className="flex-1 btn-secondary text-sm flex items-center justify-center gap-1"
                    disabled={source.status === 'syncing'}
                  >
                    <RefreshCw className={`w-3 h-3 ${source.status === 'syncing' ? 'animate-spin' : ''}`} />
                    {source.status === 'syncing' ? 'Syncing...' : 'Sync'}
                  </button>
                  <button 
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                    onClick={() => showToast('info', 'Export started', `Downloading ${source.name}...`)}
                  >
                    <Download className="w-4 h-4 text-muted" />
                  </button>
                  <button 
                    onClick={() => handleDeleteSource(source.id, source.name)}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Data Source Modal - Same as before but with handleConnect updated */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-lg p-6 w-full max-w-2xl">
            {/* Modal content remains the same... */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-on-surface">Add Data Source</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted" />
              </button>
            </div>
            
            {/* Rest of modal content... */}
            <div className="flex items-center justify-end gap-4 mt-6">
              <button 
                onClick={() => setShowAddModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                disabled={isUploading}
                onClick={handleConnect}
              >
                {isUploading ? 'Uploading...' : 'Connect'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}