'use client';

import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, AlertCircle, X, Clock } from 'lucide-react';
import { AnalysisSession } from '@/types/dashboard';
import { useToast } from '@/providers/ToastProvider';

interface ProgressTrackerProps {
  analysis: AnalysisSession;
  onCancel?: () => void;
}

const AGENT_STEPS = [
  { name: 'Data Cleaning', description: 'Cleaning and validating data', agent: 'DataCleaner' },
  { name: 'Hypothesis Generation', description: 'Generating statistical hypotheses', agent: 'HypothesisAgent' },
  { name: 'Preprocessing', description: 'Preparing data for analysis', agent: 'PreprocessingAgent' },
  { name: 'Feature Engineering', description: 'Creating enhanced features', agent: 'FeatureEngineeringAgent' },
  { name: 'Statistical Analysis', description: 'Running statistical tests', agent: 'StatsAnalyzer' },
  { name: 'Model Training', description: 'Training predictive models', agent: 'ModelTrainingAgent' },
  { name: 'Report Generation', description: 'Generating insights', agent: 'ReportGenerator' },
  { name: 'Action Planning', description: 'Creating recommendations', agent: 'CallToActionAgent' }
];

export default function ProgressTracker({ analysis, onCancel }: ProgressTrackerProps) {
  const { showToast } = useToast();
  // Show toast when analysis status changes to completed
  const prevStatus = useRef<string>(analysis.status);
  useEffect(() => {
    if (prevStatus.current !== 'completed' && analysis.status === 'completed') {
      showToast('success', 'Analysis completed', 'Your analysis is finished.');
    }
    prevStatus.current = analysis.status;
  }, [analysis.status, showToast]);

  // Agent step status logic: show completed if progress is 100, active for first step if not completed, pending for others
  const getStepStatus = (stepIndex: number) => {
    if (analysis.status === 'completed') return 'completed';
    if (stepIndex === 0) return 'active';
    return 'pending';
  };

  const formatTimeRemaining = () => {
    if (!analysis.estimatedCompletion) return 'Calculating...';
    
    const remaining = new Date(analysis.estimatedCompletion).getTime() - Date.now();
    if (remaining <= 0) return 'Almost done...';
    
    const minutes = Math.ceil(remaining / 60000);
    return `~${minutes} minute${minutes > 1 ? 's' : ''} remaining`;
  };

  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Analysis in Progress</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              "{analysis.query}"
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{formatTimeRemaining()}</span>
            </div>
            {onCancel && (
              <Button variant="outline" size="sm" onClick={onCancel}>
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Overall Progress</span>
            <span>{Math.round(analysis.progress)}%</span>
          </div>
          <Progress value={analysis.progress} className="h-2" />
        </div>

        {/* Agent Steps */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Analysis Steps</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {AGENT_STEPS.map((step, index) => {
              const status = getStepStatus(index);
              
              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    status === 'completed' 
                      ? 'bg-green-50 border-green-200' 
                      : status === 'active'
                      ? 'bg-blue-50 border-blue-200 animate-pulse'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    <div className="mt-0.5">
                      {status === 'completed' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : status === 'active' ? (
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${
                        status === 'completed' 
                          ? 'text-green-800' 
                          : status === 'active' 
                          ? 'text-blue-800' 
                          : 'text-gray-500'
                      }`}>
                        {step.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Status */}
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <div>
              <p className="text-sm font-medium">Processing</p>
              <p className="text-xs text-gray-500">AI agents are analyzing your data...</p>
            </div>
          </div>
          <Badge variant="secondary" className="animate-pulse">
            {analysis.status}
          </Badge>
        </div>

        {/* Real-time Insights Preview */}
        {/* Real-time Insights Preview removed: analysis.liveInsights not in type */}
      </CardContent>
    </Card>
  );
}