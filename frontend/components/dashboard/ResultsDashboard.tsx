'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Share2, 
  Eye,
  Calendar,
  Filter,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import Charts from '@/components/charts/Charts';
import AnalyticsMetrics from '@/components/dashboard/AnalyticsMetrics';
import { useToast } from '@/providers/ToastProvider';

interface AnalysisResult {
  id: string;
  title: string;
  query: string;
  status: 'completed' | 'processing' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  insights: string[];
  recommendations: string[];
  visualizations: any[];
  metrics: any[];
}

export default function ResultsDashboard() {
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<AnalysisResult | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await fetch('/api/analyses/results');
      const data = await response.json();
      setResults(data.results || []);
      // Auto-select most recent completed result
      const completed = data.results?.find((r: AnalysisResult) => r.status === 'completed');
      if (completed) {
        setSelectedResult(completed);
      }
    } catch (err) {
      console.error('Failed to fetch results:', err);
      setError('Failed to load results');
      showToast('error', 'Failed to load results', 'Please check your connection or try again later.');
    }
  };

  const filteredResults = results.filter(result => {
    const matchesSearch = result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.query.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || result.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDownload = (result: AnalysisResult) => {
    const reportContent = [
      `LURO-AI REPORT`,
      `Analysis: ${result.title}`,
      `Query: ${result.query}`,
      `Generated: ${result.completedAt?.toLocaleString()}`,
      ``,
      `KEY INSIGHTS:`,
      ...result.insights.map(insight => `• ${insight}`),
      ``,
      `RECOMMENDATIONS:`,
      ...result.recommendations.map(rec => `• ${rec}`),
    ].join('\n');

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis-${result.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analysis Results</h1>
          <p className="text-gray-600">View and manage your AI-generated insights</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Results List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Recent Analyses</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search..."
                    className="pl-8 h-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 max-h-96 overflow-y-auto">
              {filteredResults.map((result) => (
                <div
                  key={result.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedResult?.id === result.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedResult(result)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium truncate">{result.title}</h4>
                    <Badge variant={
                      result.status === 'completed' ? 'default' :
                      result.status === 'processing' ? 'secondary' : 'destructive'
                    }>
                      {result.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                    {result.query}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{result.createdAt.toLocaleDateString()}</span>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{result.insights.length} insights</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Results View */}
        <div className="lg:col-span-3">
          {selectedResult ? (
            <div className="space-y-6">
              {/* Result Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedResult.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {selectedResult.query}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleDownload(selectedResult)}>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {selectedResult.completedAt?.toLocaleString() || 'In Progress'}
                      </span>
                    </div>
                    <Badge variant={
                      selectedResult.status === 'completed' ? 'default' :
                      selectedResult.status === 'processing' ? 'secondary' : 'destructive'
                    }>
                      {selectedResult.status}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>

              {/* Results Content */}
              {selectedResult.status === 'completed' && (
                <Tabs defaultValue="insights" className="space-y-6">
                  <TabsList>
                    <TabsTrigger value="insights">Key Insights</TabsTrigger>
                    <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                    <TabsTrigger value="charts">Visualizations</TabsTrigger>
                    <TabsTrigger value="metrics">Metrics</TabsTrigger>
                  </TabsList>

                  <TabsContent value="insights" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <TrendingUp className="w-5 h-5 text-blue-600" />
                          <span>Key Business Insights</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedResult.insights.map((insight, index) => (
                            <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <p className="text-gray-800">{insight}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="recommendations" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Actionable Recommendations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedResult.recommendations.map((rec, index) => (
                            <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-start space-x-3">
                                <Badge className="mt-0.5">Action {index + 1}</Badge>
                                <p className="text-gray-800">{rec}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="charts" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedResult.visualizations.map((viz, index) => (
                        <Card key={index}>
                          <CardHeader>
                            <CardTitle className="text-lg">{viz.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Charts
                              data={viz.data}
                              type={viz.type}
                              title={viz.title}
                              xKey={viz.xKey}
                              yKey={viz.yKey}
                            />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="metrics" className="space-y-4">
                    <AnalyticsMetrics metrics={selectedResult.metrics} />
                  </TabsContent>
                </Tabs>
              )}

              {/* Error Display */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Selected</h3>
                <p className="text-gray-500">Select an analysis from the list to view results</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}