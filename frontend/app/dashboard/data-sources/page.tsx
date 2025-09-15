// frontend/app/dashboard/data-sources/page.tsx
// Complete file with all functionality

'use client';

import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
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
  X,
  AlertCircle,
  FileText,
  Link2
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
  const { toast } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);
  const [sourceType, setSourceType] = useState<'file' | 'database' | 'api'>('file');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Database connection form
  const [dbConfig, setDbConfig] = useState({
    type: 'mysql',
    host: '',
    port: '3306',
    database: '',
    username: '',
    password: ''
  });

  // API connection form
  const [apiConfig, setApiConfig] = useState({
    endpoint: '',
    authType: 'none',
    apiKey: '',
    headers: ''
  });

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

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        handleFileProcess(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload CSV or Excel files only",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleFileProcess = (file: File) => {
    setUploadedFile(file);
    setIsUploading(true);
    
    toast({
      title: "Uploading file...",
      description: `Processing ${file.name}`,
    });
    
    // Simulate file upload to backend
    setTimeout(() => {
      const newDataSource: DataSource = {
        id: Date.now().toString(),
        name: file.name,
        type: file.name.endsWith('.csv') ? 'csv' : 'excel',
        status: 'connected',
        lastSync: 'Just now',
        records: Math.floor(Math.random() * 10000) + 1000,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        uploadDate: new Date().toISOString().split('T')[0]
      };
      
      setDataSources([...dataSources, newDataSource]);
      setIsUploading(false);
      setUploadedFile(null);
      setShowAddModal(false);
      
      toast({
        title: "Data source added!",
        description: `${file.name} has been successfully connected`,
      });
    }, 2000);
  };

  const handleDatabaseConnect = () => {
    if (!dbConfig.host || !dbConfig.database || !dbConfig.username) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Connecting to database...",
      description: `Establishing connection to ${dbConfig.database}`,
    });

    // Simulate database connection
    setTimeout(() => {
      const newDataSource: DataSource = {
        id: Date.now().toString(),
        name: dbConfig.database,
        type: dbConfig.type as 'mysql' | 'postgresql',
        status: 'connected',
        lastSync: 'Just now',
        records: Math.floor(Math.random() * 50000) + 5000,
        size: `${(Math.random() * 100).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split('T')[0]
      };

      setDataSources([...dataSources, newDataSource]);
      setShowAddModal(false);
      
      // Reset form
      setDbConfig({
        type: 'mysql',
        host: '',
        port: '3306',
        database: '',
        username: '',
        password: ''
      });

      toast({
        title: "Database connected!",
        description: "Your database has been successfully linked",
      });
    }, 2000);
  };

  const handleApiConnect = () => {
    if (!apiConfig.endpoint) {
      toast({
        title: "Missing endpoint",
        description: "Please enter an API endpoint",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Connecting to API...",
      description: "Testing API connection",
    });

    // Simulate API connection
    setTimeout(() => {
      const newDataSource: DataSource = {
        id: Date.now().toString(),
        name: new URL(apiConfig.endpoint).hostname,
        type: 'api',
        status: 'connected',
        lastSync: 'Just now',
        records: 0,
        size: 'Dynamic',
        uploadDate: new Date().toISOString().split('T')[0]
      };

      setDataSources([...dataSources, newDataSource]);
      setShowAddModal(false);
      
      // Reset form
      setApiConfig({
        endpoint: '',
        authType: 'none',
        apiKey: '',
        headers: ''
      });

      toast({
        title: "API connected!",
        description: "Your API endpoint has been configured",
      });
    }, 1500);
  };

  const handleDeleteSource = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      setDataSources(dataSources.filter(source => source.id !== id));
      toast({
        title: "Data source removed",
        description: `${name} has been deleted`,
      });
    }
  };

  const handleSync = (id: string, name: string) => {
    setDataSources(dataSources.map(source => 
      source.id === id ? { ...source, status: 'syncing', lastSync: 'Syncing...' } : source
    ));
    
    toast({
      title: "Syncing data...",
      description: `Refreshing ${name}`,
    });
    
    // Simulate sync completion
    setTimeout(() => {
      setDataSources(prev => prev.map(source => 
        source.id === id ? { 
          ...source, 
          status: 'connected', 
          lastSync: 'Just now',
          records: source.records + Math.floor(Math.random() * 100)
        } : source
      ));
      
      toast({
        title: "Sync complete!",
        description: `${name} has been updated`,
      });
    }, 3000);
  };

  const handleExport = (source: DataSource) => {
    toast({
      title: "Export started",
      description: `Preparing ${source.name} for download...`,
    });

    // Simulate export
    setTimeout(() => {
      toast({
        title: "Export ready",
        description: `${source.name} has been downloaded`,
      });
    }, 1500);
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
                    onClick={() => handleExport(source)}
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

      {/* Add Data Source Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-on-surface">Add Data Source</h2>
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  setUploadedFile(null);
                }}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted" />
              </button>
            </div>
            
            {/* Source Type Tabs */}
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => setSourceType('file')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  sourceType === 'file' 
                    ? 'bg-accent text-white' 
                    : 'bg-white/5 text-muted hover:bg-white/10'
                }`}
              >
                Upload File
              </button>
              <button
                onClick={() => setSourceType('database')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  sourceType === 'database' 
                    ? 'bg-accent text-white' 
                    : 'bg-white/5 text-muted hover:bg-white/10'
                }`}
              >
                Database
              </button>
              <button
                onClick={() => setSourceType('api')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  sourceType === 'api' 
                    ? 'bg-accent text-white' 
                    : 'bg-white/5 text-muted hover:bg-white/10'
                }`}
              >
                API
              </button>
            </div>
            
            {/* File Upload */}
            {sourceType === 'file' && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    dragActive ? 'border-accent bg-accent/10' : 'border-white/20 hover:border-accent/50'
                  }`}
                >
                  <Upload className="w-12 h-12 text-muted mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-on-surface mb-2">
                    {uploadedFile ? uploadedFile.name : 'Drop your file here or click to browse'}
                  </h3>
                  <p className="text-sm muted">Supports CSV, Excel files up to 50MB</p>
                  
                  {isUploading && (
                    <div className="mt-4">
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-accent h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                      </div>
                      <p className="text-sm text-accent mt-2">Uploading...</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 p-4 bg-accent/10 rounded-lg border border-accent/20">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-accent mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-on-surface mb-1">File format requirements:</p>
                      <ul className="text-muted space-y-1">
                        <li>• CSV files should have headers in the first row</li>
                        <li>• Excel files should use the first sheet for data</li>
                        <li>• Maximum file size: 50MB</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Database Connection */}
            {sourceType === 'database' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2">Database Type</label>
                  <select 
                    value={dbConfig.type}
                    onChange={(e) => setDbConfig({...dbConfig, type: e.target.value})}
                    className="w-full px-4 py-2 bg-background border border-white/10 rounded-lg focus:outline-none focus:border-accent"
                  >
                    <option value="mysql">MySQL</option>
                    <option value="postgresql">PostgreSQL</option>
                    <option value="mongodb">MongoDB</option>
                    <option value="mssql">SQL Server</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2">
                    Host <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={dbConfig.host}
                    onChange={(e) => setDbConfig({...dbConfig, host: e.target.value})}
                    className="w-full px-4 py-2 bg-background border border-white/10 rounded-lg focus:outline-none focus:border-accent"
                    placeholder="localhost or database.example.com"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-2">Port</label>
                    <input
                      type="text"
                      value={dbConfig.port}
                      onChange={(e) => setDbConfig({...dbConfig, port: e.target.value})}
                      className="w-full px-4 py-2 bg-background border border-white/10 rounded-lg focus:outline-none focus:border-accent"
                      placeholder="3306"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-2">
                      Database Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={dbConfig.database}
                      onChange={(e) => setDbConfig({...dbConfig, database: e.target.value})}
                      className="w-full px-4 py-2 bg-background border border-white/10 rounded-lg focus:outline-none focus:border-accent"
                      placeholder="my_database"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-2">
                      Username <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={dbConfig.username}
                      onChange={(e) => setDbConfig({...dbConfig, username: e.target.value})}
                      className="w-full px-4 py-2 bg-background border border-white/10 rounded-lg focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-2">Password</label>
                    <input
                      type="password"
                      value={dbConfig.password}
                      onChange={(e) => setDbConfig({...dbConfig, password: e.target.value})}
                      className="w-full px-4 py-2 bg-background border border-white/10 rounded-lg focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>
                
                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <p className="text-sm text-blue-400">
                    Make sure your database allows connections from our IP addresses. 
                    Contact support if you need help with whitelisting.
                  </p>
                </div>
              </div>
            )}
            
            {/* API Connection */}
            {sourceType === 'api' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2">
                    API Endpoint <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={apiConfig.endpoint}
                    onChange={(e) => setApiConfig({...apiConfig, endpoint: e.target.value})}
                    className="w-full px-4 py-2 bg-background border border-white/10 rounded-lg focus:outline-none focus:border-accent"
                    placeholder="https://api.example.com/data"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2">Authentication Type</label>
                  <select 
                    value={apiConfig.authType}
                    onChange={(e) => setApiConfig({...apiConfig, authType: e.target.value})}
                    className="w-full px-4 py-2 bg-background border border-white/10 rounded-lg focus:outline-none focus:border-accent"
                  >
                    <option value="none">None</option>
                    <option value="api-key">API Key</option>
                    <option value="bearer">Bearer Token</option>
                    <option value="basic">Basic Auth</option>
                    <option value="oauth2">OAuth 2.0</option>
                  </select>
                </div>
                
                {apiConfig.authType !== 'none' && (
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-2">
                      {apiConfig.authType === 'api-key' ? 'API Key' : 'Authentication Value'}
                    </label>
                    <input
                      type="text"
                      value={apiConfig.apiKey}
                      onChange={(e) => setApiConfig({...apiConfig, apiKey: e.target.value})}
                      className="w-full px-4 py-2 bg-background border border-white/10 rounded-lg focus:outline-none focus:border-accent"
                      placeholder="Enter your authentication credentials"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2">
                    Custom Headers (Optional)
                  </label>
                  <textarea
                    value={apiConfig.headers}
                    onChange={(e) => setApiConfig({...apiConfig, headers: e.target.value})}
                    className="w-full px-4 py-2 bg-background border border-white/10 rounded-lg focus:outline-none focus:border-accent"
                    rows={3}
                    placeholder='{"Content-Type": "application/json"}'
                  />
                </div>
                
                <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <p className="text-sm text-yellow-400">
                    We'll test the connection before saving. Make sure your API is accessible and returns valid JSON data.
                  </p>
                </div>
              </div>
            )}
            
            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-4 mt-6">
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  setUploadedFile(null);
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                disabled={isUploading}
                onClick={() => {
                  if (sourceType === 'database') {
                    handleDatabaseConnect();
                  } else if (sourceType === 'api') {
                    handleApiConnect();
                  }
                }}
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