 

'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Mic, Send, Lightbulb, Upload, Database, Brain } from 'lucide-react';
import { SAMPLE_QUERIES } from '@/lib/constants';
import { useAnalysis } from '@/hooks/useAnalysis';
import { AnalysisSession } from '@/types/dashboard';
import { useToast } from '@/providers/ToastProvider';

// Extend Window interface for speech recognition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

interface QueryInterfaceProps {
  onAnalysisStart: (analysis: AnalysisSession) => void;
  disabled?: boolean;
}

export default function QueryInterface({ onAnalysisStart, disabled = false }: QueryInterfaceProps) {
  const [query, setQuery] = useState('');
  const [selectedDataSource, setSelectedDataSource] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();
  const { analyze, sampleAnalyze, loading, error } = useAnalysis();

  const handleQuerySubmit = async () => {
    if (!query.trim()) return;

    try {
      let result;

      if (uploadedFile) {
        result = await analyze(uploadedFile, query);
      } else {
        result = await sampleAnalyze(query);
      }

      if (result.success) {
        onAnalysisStart({
          id: Date.now().toString(),
          query,
          status: 'processing',
          progress: 0,
          startedAt: new Date(),
          estimatedCompletion: new Date(Date.now() + 300000) // 5 minutes
        });
        showToast('success', 'Analysis started', 'Your query is being processed.');
      } else {
        showToast('error', 'Analysis failed', result.message || 'An error occurred.');
      }
    } catch (err) {
      console.error('Analysis failed:', err);
      showToast('error', 'Analysis failed', 'An unexpected error occurred.');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setUploadedFile(file);
      showToast('success', 'File uploaded', `${file.name} uploaded successfully.`);
    } else if (file) {
      showToast('warning', 'Invalid file type', 'Please upload a CSV file.');
    }
  };

  const handleVoiceInput = () => {
  if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event: any) => {
  const transcript = event.results[0][0].transcript;
  setQuery(prev => prev + (prev ? ' ' : '') + transcript);
  showToast('info', 'Voice input received', transcript);
      };
      
      recognition.start();
    } else {
  showToast('warning', 'Speech recognition not supported', 'Try a different browser.');
    }
  };

  const handleSampleQuery = (sampleQuery: string) => {
    setQuery(sampleQuery);
  };

  return (
    <div className="space-y-6">
      {/* Main Query Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-blue-600" />
            <span>Ask Your Data Anything</span>
          </CardTitle>
          <CardDescription>
            Use natural language to analyze your business data and get AI-powered insights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Data Source Selection */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium">Data Source:</span>
              {uploadedFile ? (
                <Badge variant="secondary">{uploadedFile.name}</Badge>
              ) : (
                <Badge variant="outline">Sample Ghana Business Data</Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".csv"
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload CSV
              </Button>
            </div>
          </div>

          {/* Query Input */}
          <div className="space-y-2">
            <Textarea
              placeholder="e.g., Show me sales trends by region and recommend strategies to increase revenue in Ghana..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-h-[120px] resize-none"
              disabled={disabled}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleVoiceInput}
                  disabled={disabled}
                  className={isListening ? "bg-red-50 border-red-300" : ""}
                >
                  <Mic className={`w-4 h-4 mr-2 ${isListening ? "text-red-500 animate-pulse" : ""}`} />
                  {isListening ? "Listening..." : "Voice Input"}
                </Button>
                <span className="text-xs text-gray-500">{query.length}/1000</span>
              </div>
              
              <Button 
                onClick={handleQuerySubmit}
                disabled={!query.trim() || disabled || loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Analyze
              </Button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sample Queries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <span>Sample Questions</span>
          </CardTitle>
          <CardDescription>
            Get started with these example queries tailored for Ghana businesses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SAMPLE_QUERIES.slice(0, 6).map((sampleQuery: string, index: number) => (
              <Button
                key={index}
                variant="outline"
                className="text-left h-auto p-3 justify-start"
                onClick={() => handleSampleQuery(sampleQuery)}
                disabled={disabled}
              >
                <span className="text-sm text-gray-700">{sampleQuery}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}