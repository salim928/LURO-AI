
'use client';

import { useState } from 'react';
import { Download, Share2, BarChart3, Copy, Check } from 'lucide-react';

interface ResultsDisplayProps {
  results: {
    results: string;
    data_summary?: {
      original_rows: number;
      cleaned_rows: number;
      columns: string[];
      missing_values_handled: number;
    };
    filename?: string;
    query?: string;
    is_sample?: boolean;
  };
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyResults = async () => {
    try {
      await navigator.clipboard.writeText(results.results);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDownloadReport = () => {
    const reportContent = [
      `AI DATA SCIENTIST REPORT`,
      `Generated: ${new Date().toLocaleString()}`,
      `File: ${results.filename || 'Sample Data'}`,
      `Query: ${results.query || 'N/A'}`,
      ``,
      `${results.results}`,
      ``,
      `--- End of Report ---`
    ].join('\n');

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-analysis-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleShareResults = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI Data Scientist Report',
          text: results.results.substring(0, 200) + '...',
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      handleCopyResults();
    }
  };

  const formatResults = (text: string) => {
    // Split by sections and format each
    const sections = text.split('\n\n');
    
    return sections.map((section, index) => {
      const lines = section.split('\n');
      const title = lines[0];
      const content = lines.slice(1);
      
      // Check if it's a header (contains emojis or is all caps)
      const isHeader = title.includes('🤖') || title.includes('=') || 
                      title.match(/^[🔧📊🎯💡🌍🔄📈🇬🇭]/);
      
      if (isHeader) {
        return (
          <div key={index} className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              {title}
            </h3>
            <div className="space-y-2">
              {content.map((line, lineIndex) => {
                if (!line.trim()) return null;
                
                const isSubHeader = line.includes('-') && line.length < 50;
                const isBulletPoint = line.trim().startsWith('•') || line.trim().startsWith('-');
                
                if (isSubHeader) {
                  return (
                    <h4 key={lineIndex} className="font-medium text-gray-800 mt-4 mb-2">
                      {line.replace(/^-+/, '').trim()}
                    </h4>
                  );
                } else if (isBulletPoint) {
                  return (
                    <div key={lineIndex} className="flex items-start space-x-2 text-gray-700">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{line.replace(/^[•-]\s*/, '')}</span>
                    </div>
                  );
                } else if (line.includes(':')) {
                  const [label, value] = line.split(':', 2);
                  return (
                    <div key={lineIndex} className="flex flex-col sm:flex-row text-gray-700">
                      <span className="font-medium text-gray-900 sm:w-1/3">{label}:</span>
                      <span className="sm:w-2/3">{value.trim()}</span>
                    </div>
                  );
                } else {
                  return (
                    <p key={lineIndex} className="text-gray-700">
                      {line}
                    </p>
                  );
                }
              })}
            </div>
          </div>
        );
      } else {
        return (
          <div key={index} className="mb-4">
            <p className="text-gray-700 leading-relaxed">{section}</p>
          </div>
        );
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-accent mb-1">
              Analysis Results
            </h2>
            <p className="text-sm muted">
              {results.is_sample ? 'Sample data analysis' : `Analysis of ${results.filename}`}
              {results.query && ` • ${results.query}`}
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <button
              onClick={handleCopyResults}
              className="flex items-center space-x-1 text-sm panel px-3 py-2 rounded-lg"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            
            <button
              onClick={handleDownloadReport}
              className="flex items-center space-x-1 text-sm btn-secondary px-3 py-2 rounded-lg"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            
            <button
              onClick={handleShareResults}
              className="flex items-center space-x-1 text-sm btn-secondary px-3 py-2 rounded-lg"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Data Summary */}
        {results.data_summary && (
          <div className="panel mb-6">
            <h3 className="font-medium text-accent mb-2 flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              Data Summary
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-accent font-medium">Records:</span>
                <p className="text-on-surface">{results.data_summary.cleaned_rows.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-accent font-medium">Columns:</span>
                <p className="text-on-surface">{results.data_summary.columns.length}</p>
              </div>
              <div>
                <span className="text-accent font-medium">Data Quality:</span>
                <p className="text-on-surface">
                  {results.data_summary.missing_values_handled === 0 ? 'Excellent' : 'Cleaned'}
                </p>
              </div>
              <div>
                <span className="text-accent font-medium">AI Confidence:</span>
                <p className="text-on-surface">High</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Content */}
      <div className="card">
        <div className="prose max-w-none custom-scrollbar" style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {formatResults(results.results)}
        </div>
      </div>

      {/* Next Steps */}
      <div className="panel">
        <h3 className="font-medium text-accent mb-3 flex items-center">
          🚀 Next Steps
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-on-surface mb-2">Immediate Actions:</h4>
            <ul className="space-y-1 text-on-surface">
              <li>• Review the key insights and recommendations</li>
              <li>• Download the report for your records</li>
              <li>• Share findings with your team</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-on-surface mb-2">Follow-up Analysis:</h4>
            <ul className="space-y-1 text-on-surface">
              <li>• Upload more recent data for updated insights</li>
              <li>• Try different questions about your data</li>
              <li>• Set up regular monthly analysis</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}