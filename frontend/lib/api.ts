import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { AnalysisResult, AnalyzeRequest, SampleAnalysisRequest, HealthCheckResponse, SampleDataResponse } from '@/types/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000',
      timeout: 120000, // 2 minutes
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('API Response Error:', error.response?.data || error.message);
        
        // Transform error messages
        if (error.response?.data?.detail) {
          error.message = error.response.data.detail;
        } else if (error.response?.data?.error) {
          error.message = error.response.data.error;
        }
        
        return Promise.reject(error);
      }
    );
  }

  async healthCheck(): Promise<HealthCheckResponse> {
    try {
      const response = await this.client.get<HealthCheckResponse>('/health');
      return response.data;
    } catch (error) {
      throw new Error('Health check failed');
    }
  }

  async analyzeData({ file, query }: AnalyzeRequest): Promise<AnalysisResult> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('query', query);

      const response = await this.client.post<AnalysisResult>('/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Analysis failed:', error);
      throw new Error(error.message || 'Analysis failed');
    }
  }

  async sampleAnalysis({ query }: SampleAnalysisRequest): Promise<AnalysisResult> {
    try {
      const formData = new FormData();
      formData.append('query', query);

      const response = await this.client.post<AnalysisResult>('/sample-analysis', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Sample analysis failed:', error);
      throw new Error(error.message || 'Sample analysis failed');
    }
  }

  async getSampleData(): Promise<SampleDataResponse> {
    try {
      const response = await this.client.get<SampleDataResponse>('/sample-data');
      return response.data;
    } catch (error: any) {
      console.error('Failed to get sample data:', error);
      throw new Error(error.message || 'Failed to get sample data');
    }
  }
}

export const apiClient = new ApiClient();