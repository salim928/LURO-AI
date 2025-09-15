'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Database, 
  Plus, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Settings,
  FileText,
  Cloud,
  Server
} from 'lucide-react';

interface DataSource {
  id: string;
  name: string;
  type: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  recordCount: number;
  tables?: string[];
}

const DATA_SOURCE_TYPES = [
  { value: 'postgresql', label: 'PostgreSQL', icon: Database },
  { value: 'mysql', label: 'MySQL', icon: Database },
  { value: 'mongodb', label: 'MongoDB', icon: Server },
  { value: 'bigquery', label: 'Google BigQuery', icon: Cloud },
  { value: 'csv', label: 'CSV File', icon: FileText },
  { value: 'excel', label: 'Excel File', icon: FileText }
];

export default function DataSourcesList() {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [isAddingSource, setIsAddingSource] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('');
  const [connectionForm, setConnectionForm] = useState({
    name: '',
    host: '',
    port: '',
    database: '',
    username: '',
    password: ''
  });

  useEffect(() => {
    fetchDataSources();
  }, []);

  const fetchDataSources = async () => {
    try {
      const response = await fetch('/api/datasources');
      const data = await response.json();
      setDataSources(data.sources || []);
    } catch (error) {
      console.error('Failed to fetch data sources:', error);
    }
  };

  const handleAddDataSource = async () => {
    try {
      const response = await fetch('/api/datasources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          ...connectionForm
        })
      });
      
      if (response.ok) {
        setIsAddingSource(false);
        setSelectedType('');
        setConnectionForm({
          name: '',
          host: '',
          port: '',
          database: '',
          username: '',
          password: ''
        });
        fetchDataSources();
      }
    } catch (error) {
      console.error('Failed to add data source:', error);
    }
  };

  const handleTestConnection = async (sourceId: string) => {
    try {
      const response = await fetch(`/api/datasources/${sourceId}/test`, {
        method: 'POST'
      });
      
      if (response.ok) {
        fetchDataSources(); // Refresh to get updated status
      }
    } catch (error) {
      console.error('Failed to test connection:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Data Sources</h2>
          <p className="text-gray-600">Connect and manage your business data sources</p>
        </div>
        
        <Dialog open={isAddingSource} onOpenChange={setIsAddingSource}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Data Source
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Data Source</DialogTitle>
              <DialogDescription>
                Connect a new database or file source for analysis
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="type">Source Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select data source type" />
                  </SelectTrigger>
                  <SelectContent>
                    {DATA_SOURCE_TYPES.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center space-x-2">
                            <IconComponent className="w-4 h-4" />
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {selectedType && !['csv', 'excel'].includes(selectedType) && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Connection Name</Label>
                    <Input
                      id="name"
                      placeholder="My Database"
                      value={connectionForm.name}
                      onChange={(e) => setConnectionForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="host">Host</Label>
                      <Input
                        id="host"
                        placeholder="localhost"
                        value={connectionForm.host}
                        onChange={(e) => setConnectionForm(prev => ({ ...prev, host: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="port">Port</Label>
                      <Input
                        id="port"
                        placeholder="5432"
                        value={connectionForm.port}
                        onChange={(e) => setConnectionForm(prev => ({ ...prev, port: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="database">Database Name</Label>
                    <Input
                      id="database"
                      placeholder="mydb"
                      value={connectionForm.database}
                      onChange={(e) => setConnectionForm(prev => ({ ...prev, database: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        placeholder="user"
                        value={connectionForm.username}
                        onChange={(e) => setConnectionForm(prev => ({ ...prev, username: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={connectionForm.password}
                        onChange={(e) => setConnectionForm(prev => ({ ...prev, password: e.target.value }))}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddingSource(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddDataSource} disabled={!selectedType || (!connectionForm.name && !['csv', 'excel'].includes(selectedType))}>
                Add Source
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Data Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dataSources.map((source) => {
          const sourceType = DATA_SOURCE_TYPES.find(t => t.value === source.type);
          const IconComponent = sourceType?.icon || Database;
          
          return (
            <Card key={source.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <IconComponent className="w-5 h-5 text-gray-600" />
                    <CardTitle className="text-lg">{source.name}</CardTitle>
                  </div>
                  {getStatusIcon(source.status)}
                </div>
                <CardDescription className="flex items-center justify-between">
                  <span>{sourceType?.label || source.type}</span>
                  <Badge className={getStatusColor(source.status)}>
                    {source.status}
                  </Badge>
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Last Sync</p>
                    <p className="font-medium">{new Date(source.lastSync).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Records</p>
                    <p className="font-medium">{source.recordCount.toLocaleString()}</p>
                  </div>
                </div>

                {source.tables && source.tables.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Available Tables</p>
                    <div className="flex flex-wrap gap-1">
                      {source.tables.slice(0, 3).map((table) => (
                        <Badge key={table} variant="secondary" className="text-xs">
                          {table}
                        </Badge>
                      ))}
                      {source.tables.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{source.tables.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleTestConnection(source.id)}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Test
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Add Source Card */}
        <Card 
          className="border-dashed border-2 hover:border-blue-300 cursor-pointer transition-colors"
          onClick={() => setIsAddingSource(true)}
        >
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Plus className="w-8 h-8 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Add Data Source</h3>
            <p className="text-sm text-gray-500 text-center">
              Connect databases, files, or cloud services
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}