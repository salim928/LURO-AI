export interface BackendConfig {
  baseUrl: string;
  timeout: number;
  maxFileSize: number;
  allowedFormats: string[];
}

export interface AnalyzeRequest {
  file: File;
  query: string;
}

export interface SampleAnalysisRequest {
  query: string;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  components: {
    main_agent: string;
    data_loader: string;
    api: string;
    [key: string]: string;
  };
  version?: string;
  timestamp: string;
}

export interface SampleDataResponse {
  success: boolean;
  data: {
    columns: string[];
    sample_rows: Record<string, any>[];
    total_rows: number;
    description: string;
  };
}

export interface ErrorResponse {
  success: false;
  error: string;
  details?: string;
  code?: string;
}