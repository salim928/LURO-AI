import { useState, useCallback } from 'react';
import { apiClient } from '../lib/api';
import { AnalysisResult, AnalysisSession } from '../types/index';

export interface UseAnalysisReturn {
  analyze: (file: File, query: string) => Promise<AnalysisResult>;
  sampleAnalyze: (query: string) => Promise<AnalysisResult>;
  loading: boolean;
  error: string | null;
  result: AnalysisResult | null;
  clearError: () => void;
  clearResult: () => void;
  sessions: AnalysisSession[];
}

export const useAnalysis = (): UseAnalysisReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [sessions, setSessions] = useState<AnalysisSession[]>([]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
  }, []);

  const analyze = useCallback(async (file: File, query: string): Promise<AnalysisResult> => {
    setLoading(true);
    setError(null);
    
    const startTime = Date.now();
    
    try {
      const analysisResult = await apiClient.analyzeData({ file, query });
      
      if (analysisResult.success) {
        setResult(analysisResult);
        
        // Add to sessions history
        const session: AnalysisSession = {
          id: `session_${Date.now()}`,
          timestamp: new Date(),
          filename: file.name,
          query,
          results: analysisResult,
          duration_seconds: Math.round((Date.now() - startTime) / 1000)
        };
        
        setSessions(prev => [session, ...prev.slice(0, 9)]); // Keep last 10 sessions
      } else {
        throw new Error(analysisResult.error || 'Analysis failed');
      }
      
      return analysisResult;
    } catch (err: any) {
      const errorMessage = err.message || 'Analysis failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const sampleAnalyze = useCallback(async (query: string): Promise<AnalysisResult> => {
    setLoading(true);
    setError(null);
    
    const startTime = Date.now();
    
    try {
      const analysisResult = await apiClient.sampleAnalysis({ query });
      
      if (analysisResult.success) {
        setResult(analysisResult);
        
        // Add to sessions history
        const session: AnalysisSession = {
          id: `sample_${Date.now()}`,
          timestamp: new Date(),
          filename: 'Sample Ghana Business Data',
          query,
          results: analysisResult,
          duration_seconds: Math.round((Date.now() - startTime) / 1000)
        };
        
        setSessions(prev => [session, ...prev.slice(0, 9)]);
      } else {
        throw new Error(analysisResult.error || 'Sample analysis failed');
      }
      
      return analysisResult;
    } catch (err: any) {
      const errorMessage = err.message || 'Sample analysis failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    analyze,
    sampleAnalyze,
    loading,
    error,
    result,
    clearError,
    clearResult,
    sessions
  };
};