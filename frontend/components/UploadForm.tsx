'use client';

import { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, Sparkles } from 'lucide-react';

interface UploadFormProps {
  setResults: (results: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export default function UploadForm({ setResults, setLoading, setError }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [query, setQuery] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const sampleQueries = [
    "Analyze sales trends and identify growth opportunities",
    "What are my best performing products and regions?",
    "Identify seasonal patterns in my business data",
    "Recommend strategies to increase revenue in Ghana",
    "Analyze customer behavior and buying patterns"
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
      } else {
        setError('Please upload a CSV file only');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Please upload a CSV file only');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a CSV file to upload');
      return;
    }

    if (!query.trim()) {
      setError('Please enter a question about your data');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('query', query.trim());

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      const response = await axios.post(`${backendUrl}/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 120000, // 2 minute timeout
      });

      if (response.data.success) {
        setResults(response.data);
      } else {
        setError(response.data.error || 'Analysis failed');
      }
    } catch (error: any) {
      console.error('Analysis error:', error);
      
      if (error.code === 'ECONNABORTED') {
        setError('Analysis is taking longer than expected. Please try with a smaller file or simpler query.');
      } else if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.response?.status === 413) {
        setError('File too large. Please upload a smaller CSV file (under 10MB).');
      } else if (error.message.includes('Network Error')) {
        setError('Cannot connect to analysis server. Please check if the backend is running.');
      } else {
        setError('Analysis failed. Please check your file format and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSampleAnalysis = async () => {
    if (!query.trim()) {
      setError('Please enter a question to analyze sample data');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      const response = await axios.post(`${backendUrl}/sample-analysis`, 
        `query=${encodeURIComponent(query.trim())}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          timeout: 60000,
        }
      );

      if (response.data.success) {
        setResults(response.data);
      } else {
        setError(response.data.error || 'Sample analysis failed');
      }
    } catch (error: any) {
      console.error('Sample analysis error:', error);
      setError(error.response?.data?.detail || error.message || 'Sample analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* File Upload Area */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload CSV File
        </label>
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive 
              ? 'border-accent bg-[rgba(79,70,229,0.06)]' 
              : file 
                ? 'border-green-400 bg-[rgba(34,197,94,0.04)]' 
                : 'border-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.01)]'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          {file ? (
            <div className="text-green-400">
              <FileText className="w-8 h-8 mx-auto mb-2" />
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB • Click to change
              </p>
            </div>
          ) : (
            <div className="text-muted">
              <Upload className="w-8 h-8 mx-auto mb-2" />
              <p className="font-medium">Drop your CSV file here</p>
              <p className="text-sm">or click to browse</p>
            </div>
          )}
        </div>
      </div>

      {/* Query Input */}
      <div>
  <label className="block text-sm font-medium muted mb-2">
          What would you like to know about your data?
        </label>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., Analyze my sales trends and recommend strategies to increase revenue in Ghana"
          className="input-field h-24 resize-none"
          maxLength={500}
        />
  <p className="text-xs muted mt-1">
          {query.length}/500 characters
        </p>
      </div>

      {/* Sample Questions */}
  <div>
  <p className="text-sm font-medium muted mb-2">
          💡 Sample Questions:
        </p>
        <div className="flex flex-wrap gap-2">
          {sampleQueries.map((sampleQuery, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setQuery(sampleQuery)}
              className="text-xs bg-[rgba(255,255,255,0.02)] text-muted px-3 py-1 rounded-full hover:bg-[rgba(79,70,229,0.08)] hover:text-accent transition-colors"
            >
              {sampleQuery}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
  <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          disabled={!file || !query.trim()}
          className="btn-primary flex-1 flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Analyze My Data</span>
        </button>
        
        <button
          type="button"
          onClick={handleSampleAnalysis}
          disabled={!query.trim()}
          className="btn-secondary flex-1 flex items-center justify-center space-x-2"
        >
          <FileText className="w-4 h-4" />
          <span>Try Sample Data</span>
        </button>
      </div>

      {/* Help Text */}
  <div className="text-xs muted bg-[rgba(255,255,255,0.01)] p-3 rounded-lg">
        <p className="font-medium mb-1">Supported file format:</p>
        <p>• CSV files with headers (columns like: date, product, sales, region, etc.)</p>
        <p>• Maximum file size: 10MB</p>
        <p>• Include numeric data for best analysis results</p>
      </div>
    </form>
  );
}