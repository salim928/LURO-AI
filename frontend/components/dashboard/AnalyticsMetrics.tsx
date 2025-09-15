'use client';

import { TrendingUp, TrendingDown, Minus, DollarSign, Users, Package, MapPin } from 'lucide-react';

interface Metric {
  label: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: 'revenue' | 'customers' | 'products' | 'regions';
  prefix?: string;
  suffix?: string;
}

interface AnalyticsMetricsProps {
  metrics: Metric[];
}

export default function AnalyticsMetrics({ metrics }: AnalyticsMetricsProps) {
  // Show toast if metrics are empty
  const { showToast } = require('@/providers/ToastProvider');
  if (!metrics || metrics.length === 0) {
    showToast('info', 'No metrics available', 'There are no metrics to display for this analysis.');
  }
  const getIcon = (iconType?: string) => {
    switch (iconType) {
      case 'revenue':
        return <DollarSign className="w-5 h-5" />;
      case 'customers':
        return <Users className="w-5 h-5" />;
      case 'products':
        return <Package className="w-5 h-5" />;
      case 'regions':
        return <MapPin className="w-5 h-5" />;
      default:
        return <TrendingUp className="w-5 h-5" />;
    }
  };

  const getTrendIcon = (changeType?: string) => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'decrease':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTrendColor = (changeType?: string) => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  const formatValue = (value: string | number, prefix?: string, suffix?: string) => {
    let formattedValue = typeof value === 'number' ? value.toLocaleString() : value;
    
    if (prefix) formattedValue = prefix + formattedValue;
    if (suffix) formattedValue = formattedValue + suffix;
    
    return formattedValue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <div key={index} className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                {getIcon(metric.icon)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatValue(metric.value, metric.prefix, metric.suffix)}
                </p>
              </div>
            </div>
          </div>
          
          {metric.change !== undefined && (
            <div className="mt-4 flex items-center space-x-2">
              {getTrendIcon(metric.changeType)}
              <span className={`text-sm font-medium ${getTrendColor(metric.changeType)}`}>
                {Math.abs(metric.change)}%
              </span>
              <span className="text-sm text-gray-500">vs last period</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}