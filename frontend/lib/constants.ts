export const APP_CONFIG = {
  name: 'AI Data Scientist',
  description: 'AI-powered business insights for Ghanaian SMEs',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  version: '1.0.0',
} as const;

export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000',
  timeout: 120000, // 2 minutes
  maxFileSize: 50 * 1024 * 1024, // 50MB
  allowedFormats: ['.csv'] as const,
} as const;

export const GHANA_REGIONS = [
  'Greater Accra',
  'Ashanti',
  'Northern',
  'Western',
  'Eastern',
  'Volta',
  'Upper East',
  'Upper West',
  'Central',
  'Brong-Ahafo',
  'Savannah',
  'Bono East',
  'Ahafo',
  'Oti',
  'Western North',
  'North East'
] as const;

export const GHANA_MAJOR_CITIES = [
  'Accra',
  'Kumasi',
  'Tamale',
  'Takoradi',
  'Sunyani',
  'Koforidua',
  'Ho',
  'Bolgatanga',
  'Wa',
  'Cape Coast'
] as const;

export const SAMPLE_QUERIES = [
  "Analyze sales trends and identify growth opportunities",
  "What are my best performing products and regions?", 
  "Identify seasonal patterns in my business data",
  "Recommend strategies to increase revenue in Ghana",
  "Analyze customer behavior and buying patterns",
  "Which regions should I expand to next?",
  "What products have the highest profit margins?",
  "How can I optimize my inventory management?",
  "Identify my most valuable customer segments",
  "What are the emerging market trends in my industry?"
] as const;

export const BUSINESS_SECTORS = [
  'Retail',
  'Agriculture', 
  'Manufacturing',
  'Services',
  'Technology',
  'Healthcare',
  'Education',
  'Tourism',
  'Mining',
  'Construction',
  'Transportation',
  'Financial Services'
] as const;

export const CHART_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green  
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#EC4899', // Pink
  '#6B7280'  // Gray
] as const;

export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'File size exceeds the maximum limit of 50MB',
  INVALID_FILE_TYPE: 'Only CSV files are supported',
  NETWORK_ERROR: 'Unable to connect to the analysis server',
  ANALYSIS_FAILED: 'Analysis failed. Please check your data and try again',
  QUERY_TOO_SHORT: 'Please enter a more detailed query (at least 10 characters)',
  SERVER_ERROR: 'Server error. Please try again later',
} as const;

export const SUCCESS_MESSAGES = {
  ANALYSIS_COMPLETE: 'Analysis completed successfully!',
  FILE_UPLOADED: 'File uploaded successfully',
  DATA_PROCESSED: 'Data processed and ready for analysis',
} as const;