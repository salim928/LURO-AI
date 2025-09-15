'use client';

import { Brain, BarChart3, TrendingUp, Zap } from 'lucide-react';

export default function LoadingSpinner() {
  const loadingSteps = [
    { icon: Brain, text: "Initializing AI analysis...", delay: 0 },
    { icon: BarChart3, text: "Processing your data...", delay: 1000 },
    { icon: TrendingUp, text: "Identifying patterns and trends...", delay: 2000 },
    { icon: Zap, text: "Generating insights and recommendations...", delay: 3000 }
  ];

  return (
    <div className="text-center py-8">
      <div className="mb-6">
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-2 bg-blue-500 rounded-full flex items-center justify-center">
            <Brain className="w-6 h-6 text-white animate-pulse" />
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        AI is analyzing your data
      </h3>
      
      <p className="text-gray-600 mb-6">
        This may take 30-60 seconds depending on your data size
      </p>

      <div className="space-y-3 max-w-md mx-auto">
        {loadingSteps.map((step, index) => {
          const IconComponent = step.icon;
          return (
            <div 
              key={index}
              className="flex items-center space-x-3 text-sm text-gray-600 animate-pulse"
              style={{ animationDelay: `${step.delay}ms` }}
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <IconComponent className="w-4 h-4 text-blue-600" />
              </div>
              <span>{step.text}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
        <p className="font-medium mb-1">What's happening behind the scenes:</p>
        <p>• Data cleaning and validation</p>
        <p>• Statistical analysis and correlation detection</p>
        <p>• Pattern recognition and trend analysis</p>
        <p>• AI-powered insight generation</p>
      </div>
    </div>
  );
}