

###`frontend/types/index.ts`
```typescript
export interface AnalysisResult {
  success: boolean;
  results: string;
  data_summary?: DataSummary;
  filename?: string;
  query?: string;
  is_sample?: boolean;
  error?: string;
}

export interface DataSummary {
  original_rows: number;
  cleaned_rows: number;
  columns: string[];
  missing_values_handled: number;
  numeric_columns?: number;
  categorical_columns?: number;
  date_columns?: number;
  memory_usage?: number;
}

export interface UploadFormProps {
  setResults: (results: AnalysisResult) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export interface ResultsDisplayProps {
  results: AnalysisResult;
}

export interface LoadingSpinnerProps {
  message?: string;
}

export interface ChartData {
  [key: string]: string | number;
}

export interface ChartsProps {
  data: ChartData[];
  type: 'bar' | 'line' | 'pie' | 'area';
  title: string;
  xKey: string;
  yKey: string;
  height?: number;
  colors?: string[];
}

export interface DataPreviewProps {
  data: any[];
  columns: string[];
  maxRows?: number;
  title?: string;
}

export interface Metric {
  label: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: 'revenue' | 'customers' | 'products' | 'regions' | 'growth';
  prefix?: string;
  suffix?: string;
  description?: string;
}

export interface AnalyticsMetricsProps {
  metrics: Metric[];
}

export interface BusinessInsight {
  category: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  ghana_specific?: boolean;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface FileUploadStatus {
  export interface AnalysisResult {
    success: boolean;
    results: string;
    data_summary?: DataSummary;
    filename?: string;
    query?: string;
    is_sample?: boolean;
    error?: string;
  }

  export interface DataSummary {
    original_rows: number;
    cleaned_rows: number;
    columns: string[];
    missing_values_handled: number;
    numeric_columns?: number;
    categorical_columns?: number;
    date_columns?: number;
    memory_usage?: number;
  }

  export interface UploadFormProps {
    setResults: (results: AnalysisResult) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
  }

  export interface ResultsDisplayProps {
    results: AnalysisResult;
  }

  export interface LoadingSpinnerProps {
    message?: string;
  }

  export interface ChartData {
    [key: string]: string | number;
  }

  export interface ChartsProps {
    data: ChartData[];
    type: 'bar' | 'line' | 'pie' | 'area';
    title: string;
    xKey: string;
    yKey: string;
    height?: number;
    colors?: string[];
  }

  export interface DataPreviewProps {
    data: any[];
    columns: string[];
    maxRows?: number;
    title?: string;
  }

  export interface Metric {
    label: string;
    value: string | number;
    change?: number;
    changeType?: 'increase' | 'decrease' | 'neutral';
    icon?: 'revenue' | 'customers' | 'products' | 'regions' | 'growth';
    prefix?: string;
    suffix?: string;
    description?: string;
  }

  export interface AnalyticsMetricsProps {
    metrics: Metric[];
  }

  export interface BusinessInsight {
    category: string;
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    actionable: boolean;
    ghana_specific?: boolean;
  }

  export interface APIResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
  }

  export interface FileUploadStatus {
    export interface AnalysisResult {
      success: boolean;
      results: string;
      data_summary?: DataSummary;
      filename?: string;
      query?: string;
      is_sample?: boolean;
      error?: string;
    }

    export interface DataSummary {
      original_rows: number;
      cleaned_rows: number;
      columns: string[];
      missing_values_handled: number;
      numeric_columns?: number;
      categorical_columns?: number;
      date_columns?: number;
      memory_usage?: number;
    }

    export interface UploadFormProps {
      setResults: (results: AnalysisResult) => void;
      setLoading: (loading: boolean) => void;
      setError: (error: string | null) => void;
    }

    export interface ResultsDisplayProps {
      results: AnalysisResult;
    }

    export interface LoadingSpinnerProps {
      message?: string;
    }

    export interface ChartData {
      [key: string]: string | number;
    }

    export interface ChartsProps {
      data: ChartData[];
      type: 'bar' | 'line' | 'pie' | 'area';
      title: string;
      xKey: string;
      yKey: string;
      height?: number;
      colors?: string[];
    }

    export interface DataPreviewProps {
      data: any[];
      columns: string[];
      maxRows?: number;
      title?: string;
    }

    export interface Metric {
      label: string;
      value: string | number;
      change?: number;
      changeType?: 'increase' | 'decrease' | 'neutral';
      icon?: 'revenue' | 'customers' | 'products' | 'regions' | 'growth';
      prefix?: string;
      suffix?: string;
      description?: string;
    }

    export interface AnalyticsMetricsProps {
      metrics: Metric[];
    }

    export interface BusinessInsight {
      category: string;
      title: string;
      description: string;
      impact: 'high' | 'medium' | 'low';
      actionable: boolean;
      ghana_specific?: boolean;
    }

    export interface APIResponse<T = any> {
      success: boolean;
      data?: T;
      error?: string;
      message?: string;
    }

    export interface FileUploadStatus {
      export interface AnalysisResult {
        success: boolean;
        results: string;
        data_summary?: DataSummary;
        filename?: string;
        query?: string;
        is_sample?: boolean;
        error?: string;
      }

      export interface DataSummary {
        original_rows: number;
        cleaned_rows: number;
        columns: string[];
        missing_values_handled: number;
        numeric_columns?: number;
        categorical_columns?: number;
        date_columns?: number;
        memory_usage?: number;
      }

      export interface UploadFormProps {
        setResults: (results: AnalysisResult) => void;
        setLoading: (loading: boolean) => void;
        setError: (error: string | null) => void;
      }

      export interface ResultsDisplayProps {
        results: AnalysisResult;
      }

      export interface LoadingSpinnerProps {
        message?: string;
      }

      export interface ChartData {
        [key: string]: string | number;
      }

      export interface ChartsProps {
        data: ChartData[];
        type: 'bar' | 'line' | 'pie' | 'area';
        title: string;
        xKey: string;
        yKey: string;
        height?: number;
        colors?: string[];
      }

      export interface DataPreviewProps {
        data: any[];
        columns: string[];
        maxRows?: number;
        title?: string;
      }

      export interface Metric {
        label: string;
        value: string | number;
        change?: number;
        changeType?: 'increase' | 'decrease' | 'neutral';
        icon?: 'revenue' | 'customers' | 'products' | 'regions' | 'growth';
        prefix?: string;
        suffix?: string;
        description?: string;
      }

      export interface AnalyticsMetricsProps {
        metrics: Metric[];
      }

      export interface BusinessInsight {
        category: string;
        title: string;
        description: string;
        impact: 'high' | 'medium' | 'low';
        actionable: boolean;
        ghana_specific?: boolean;
      }

      export interface APIResponse<T = any> {
        success: boolean;
        data?: T;
        error?: string;
        message?: string;
      }

      export interface FileUploadStatus {
        export interface AnalysisResult {
          success: boolean;
          results: string;
          data_summary?: DataSummary;
          filename?: string;
          query?: string;
          is_sample?: boolean;
          error?: string;
        }

        export interface DataSummary {
          original_rows: number;
          cleaned_rows: number;
          columns: string[];
          missing_values_handled: number;
          numeric_columns?: number;
          categorical_columns?: number;
          date_columns?: number;
          memory_usage?: number;
        }

        export interface UploadFormProps {
          setResults: (results: AnalysisResult) => void;
          setLoading: (loading: boolean) => void;
          setError: (error: string | null) => void;
        }

        export interface ResultsDisplayProps {
          results: AnalysisResult;
        }

        export interface LoadingSpinnerProps {
          message?: string;
        }

        export interface ChartData {
          [key: string]: string | number;
        }

        export interface ChartsProps {
          data: ChartData[];
          type: 'bar' | 'line' | 'pie' | 'area';
          title: string;
          xKey: string;
          yKey: string;
          height?: number;
          colors?: string[];
        }

        export interface DataPreviewProps {
          data: any[];
          columns: string[];
          maxRows?: number;
          title?: string;
        }

        export interface Metric {
          label: string;
          value: string | number;
          change?: number;
          changeType?: 'increase' | 'decrease' | 'neutral';
          icon?: 'revenue' | 'customers' | 'products' | 'regions' | 'growth';
          prefix?: string;
          suffix?: string;
          description?: string;
        }

        export interface AnalyticsMetricsProps {
          metrics: Metric[];
        }

        export interface BusinessInsight {
          category: string;
          title: string;
          description: string;
          impact: 'high' | 'medium' | 'low';
          actionable: boolean;
          ghana_specific?: boolean;
        }

        export interface APIResponse<T = any> {
          success: boolean;
          data?: T;
          error?: string;
          message?: string;
        }

        export interface FileUploadStatus {
          export interface AnalysisResult {
            success: boolean;
            results: string;
            data_summary?: DataSummary;
            filename?: string;
            query?: string;
            is_sample?: boolean;
            error?: string;
          }

          export interface DataSummary {
            original_rows: number;
            cleaned_rows: number;
            columns: string[];
            missing_values_handled: number;
            numeric_columns?: number;
            categorical_columns?: number;
            date_columns?: number;
            memory_usage?: number;
          }

          export interface UploadFormProps {
            setResults: (results: AnalysisResult) => void;
            setLoading: (loading: boolean) => void;
            setError: (error: string | null) => void;
          }

          export interface ResultsDisplayProps {
            results: AnalysisResult;
          }

          export interface LoadingSpinnerProps {
            message?: string;
          }

          export interface ChartData {
            [key: string]: string | number;
          }

          export interface ChartsProps {
            data: ChartData[];
            type: 'bar' | 'line' | 'pie' | 'area';
            title: string;
            xKey: string;
            yKey: string;
            height?: number;
            colors?: string[];
          }

          export interface DataPreviewProps {
            data: any[];
            columns: string[];
            maxRows?: number;
            title?: string;
          }

          export interface Metric {
            label: string;
            value: string | number;
            change?: number;
            changeType?: 'increase' | 'decrease' | 'neutral';
            icon?: 'revenue' | 'customers' | 'products' | 'regions' | 'growth';
            prefix?: string;
            suffix?: string;
            description?: string;
          }

          export interface AnalyticsMetricsProps {
            metrics: Metric[];
          }

          export interface BusinessInsight {
            category: string;
            title: string;
            description: string;
            impact: 'high' | 'medium' | 'low';
            actionable: boolean;
            ghana_specific?: boolean;
          }

          export interface APIResponse<T = any> {
            success: boolean;
            data?: T;
            error?: string;
            message?: string;
          }

          export interface FileUploadStatus {
            uploading: boolean;
            progress: number;
            error?: string;
          }

          export interface AnalysisSession {
            id: string;
            timestamp: Date;
            filename: string;
            query: string;
            results: AnalysisResult;
            duration_seconds: number;
          }