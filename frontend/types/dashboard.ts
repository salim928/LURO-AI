export interface DataSource {
  id: string;
  name: string;
  type: 'postgresql' | 'mysql' | 'mongodb' | 'bigquery' | 'csv';
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: Date;
  tableCount?: number;
  connectionString?: string;
}

export interface AnalysisStep {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  startTime?: Date;
  endTime?: Date;
  error?: string;
}

export interface Analysis {
  id: string;
  query: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  steps: AnalysisStep[];
  results?: AnalysisResults;
  createdAt: Date;
  estimatedCompletion?: Date;
}

export interface AnalysisResults {
  summary: string;
  insights: Insight[];
  recommendations: Recommendation[];
  visualizations: Visualization[];
  technicalDetails: TechnicalDetails;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  category: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  expectedImpact: string;
  timeline: string;
}

export interface Visualization {
  id: string;
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'heatmap';
  title: string;
  data: any[];
  config: any;
}

export interface TechnicalDetails {
  dataQuality: DataQuality;
  statisticalTests: StatisticalTest[];
  modelPerformance?: ModelPerformance;
  featureImportance?: FeatureImportance[];
}

export interface DataQuality {
  score: number;
  issues: string[];
  completeness: number;
  consistency: number;
}

export interface StatisticalTest {
  name: string;
  result: string;
  pValue: number;
  significant: boolean;
}

export interface ModelPerformance {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
}

export interface AnalysisSession {
  id: string;
  query: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  startedAt: Date;
  estimatedCompletion: Date;
}