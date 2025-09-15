// frontend/app/dashboard/query/page.tsx

'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Brain, 
  Send, 
  Loader, 
  Database, 
  Sparkles,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Download,
  RefreshCw,
  MessageSquare,
  Info,
  ChevronDown,
  BookOpen
} from 'lucide-react';

interface QueryMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  data?: any;
  suggestions?: string[];
}

interface DataSourceOption {
  id: string;
  name: string;
  type: 'csv' | 'database';
  connected: boolean;
}

export default function AIQueryPage() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<QueryMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDataSource, setSelectedDataSource] = useState<string>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Mock data sources
  const dataSources: DataSourceOption[] = [
    { id: 'all', name: 'All Data Sources', type: 'database', connected: true },
    { id: '1', name: 'Sales_Data_2024.csv', type: 'csv', connected: true },
    { id: '2', name: 'Customer_Database', type: 'database', connected: true },
    { id: '3', name: 'Inventory_Sheet.xlsx', type: 'csv', connected: true }
  ];

  // Sample queries for quick start
  const sampleQueries = [
    "What are my top 5 selling products this month?",
    "Show me revenue trends for the last quarter",
    "Which customers have the highest lifetime value?",
    "What's my current inventory status?",
    "Analyze customer churn rate",
    "Compare this month's sales to last month"
  ];

  // Recent queries
  const [recentQueries] = useState([
    "What was the total revenue last month?",
    "Show me customer growth over time",
    "Which marketing campaigns performed best?"
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage: QueryMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages([...messages, userMessage]);
    setQuery('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: QueryMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(userMessage.content),
        timestamp: new Date().toLocaleTimeString(),
        data: generateMockData(userMessage.content),
        suggestions: [
          "Would you like to see this data in a different format?",
          "Should I export this to a report?",
          "Want to dive deeper into any specific metric?"
        ]
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 2000);
  };

  const generateAIResponse = (query: string): string => {
    // Mock AI responses based on query patterns
    if (query.toLowerCase().includes('revenue')) {
      return "Based on your sales data, the total revenue for last month was **₵125,450**, representing a **12% increase** from the previous month. The growth was primarily driven by increased sales in Electronics and Clothing categories.";
    } else if (query.toLowerCase().includes('customer')) {
      return "I've analyzed your customer database. You currently have **3,842 active customers**, with **312 new customers** added this month. The average customer lifetime value is **₵2,450**.";
    } else if (query.toLowerCase().includes('product')) {
      return "Your top 5 selling products this month are:\n1. Laptop Pro X1 - 234 units\n2. Smart Watch S2 - 189 units\n3. Winter Jacket - 156 units\n4. Coffee Maker Plus - 122 units\n5. Running Shoes V3 - 98 units";
    } else {
      return "I've analyzed your data and found some interesting insights. Based on current trends, your business is showing positive growth with key metrics improving month-over-month.";
    }
  };

  const generateMockData = (query: string) => {
    if (query.toLowerCase().includes('revenue') || query.toLowerCase().includes('sales')) {
      return {
        type: 'chart',
        data: [
          { month: 'Oct', value: 98000 },
          { month: 'Nov', value: 112000 },
          { month: 'Dec', value: 125450 }
        ]
      };
    }
    return null;
  };

  const handleSampleQuery = (sampleQuery: string) => {
    setQuery(sampleQuery);
    textareaRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)]">
      {/* Sidebar */}
      <div className="w-80 bg-surface border-r border-white/5 p-4 overflow-y-auto">
        {/* Data Source Selector */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted mb-3 flex items-center gap-2">
            <Database className="w-4 h-4" />
            Data Source
          </h3>
          <select
            value={selectedDataSource}
            onChange={(e) => setSelectedDataSource(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-white/10 rounded-lg text-sm focus:outline-none focus:border-accent"
          >
            {dataSources.map(source => (
              <option key={source.id} value={source.id}>
                {source.name}
              </option>
            ))}
          </select>
        </div>

        {/* Recent Queries */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Recent Queries
          </h3>
          <div className="space-y-2">
            {recentQueries.map((q, index) => (
              <button
                key={index}
                onClick={() => handleSampleQuery(q)}
                className="w-full text-left p-2 text-sm text-muted hover:bg-white/5 rounded-lg transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Sample Queries */}
        <div>
          <h3 className="text-sm font-medium text-muted mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Try These Queries
          </h3>
          <div className="space-y-2">
            {sampleQueries.map((q, index) => (
              <button
                key={index}
                onClick={() => handleSampleQuery(q)}
                className="w-full text-left p-3 text-sm bg-accent/5 hover:bg-accent/10 border border-accent/20 rounded-lg transition-colors"
              >
                <span className="text-on-surface">{q}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Help */}
        <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-accent" />
            <h4 className="text-sm font-medium text-on-surface">Tips</h4>
          </div>
          <ul className="text-xs text-muted space-y-1">
            <li>• Ask questions in plain English</li>
            <li>• Be specific about time periods</li>
            <li>• Mention metrics you want to see</li>
            <li>• Use "compare" to see trends</li>
          </ul>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Brain className="w-16 h-16 text-accent/20 mb-4" />
              <h2 className="text-2xl font-semibold text-on-surface mb-2">
                Ask AI About Your Data
              </h2>
              <p className="text-muted max-w-md mb-6">
                Get instant insights by asking questions in plain English. 
                I can analyze your sales, customers, inventory, and more.
              </p>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-muted" />
                <span className="text-sm text-muted">
                  Choose a sample query from the left to get started
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-4xl mx-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-3xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className="flex items-start gap-3">
                      {message.type === 'ai' && (
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                          <Brain className="w-4 h-4 text-accent" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div
                          className={`p-4 rounded-lg ${
                            message.type === 'user'
                              ? 'bg-accent text-white'
                              : 'bg-surface border border-white/5'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          
                          {/* Mock Data Visualization */}
                          {message.data && message.data.type === 'chart' && (
                            <div className="mt-4 p-4 bg-background/50 rounded-lg">
                              <div className="space-y-2">
                                {message.data.data.map((item: any, index: number) => (
                                  <div key={index} className="flex items-center gap-3">
                                    <span className="text-xs text-muted w-12">{item.month}</span>
                                    <div className="flex-1 bg-white/10 rounded-full h-6 relative">
                                      <div
                                        className="absolute left-0 top-0 h-full bg-accent rounded-full flex items-center justify-end pr-2"
                                        style={{ width: `${(item.value / 150000) * 100}%` }}
                                      >
                                        <span className="text-xs text-white">₵{item.value.toLocaleString()}</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Suggestions */}
                          {message.suggestions && (
                            <div className="mt-4 space-y-2">
                              {message.suggestions.map((suggestion, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleSampleQuery(suggestion)}
                                  className="w-full text-left p-2 text-xs bg-white/5 hover:bg-white/10 rounded transition-colors"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {/* Message Actions */}
                        {message.type === 'ai' && (
                          <div className="flex items-center gap-2 mt-2">
                            <button className="p-1.5 hover:bg-white/5 rounded transition-colors">
                              <Copy className="w-3 h-3 text-muted" />
                            </button>
                            <button className="p-1.5 hover:bg-white/5 rounded transition-colors">
                              <ThumbsUp className="w-3 h-3 text-muted" />
                            </button>
                            <button className="p-1.5 hover:bg-white/5 rounded transition-colors">
                              <ThumbsDown className="w-3 h-3 text-muted" />
                            </button>
                            <button className="p-1.5 hover:bg-white/5 rounded transition-colors">
                              <Download className="w-3 h-3 text-muted" />
                            </button>
                            <span className="text-xs text-muted ml-2">{message.timestamp}</span>
                          </div>
                        )}
                      </div>
                      {message.type === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                          <MessageSquare className="w-4 h-4 text-purple-400" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                      <Brain className="w-4 h-4 text-accent animate-pulse" />
                    </div>
                    <div className="bg-surface border border-white/5 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Loader className="w-4 h-4 text-accent animate-spin" />
                        <span className="text-sm text-muted">AI is analyzing your data...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-white/5 p-4">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="flex items-end gap-4">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your business data..."
                  className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg resize-none focus:outline-none focus:border-accent"
                  rows={1}
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
              </div>
              <button
                type="submit"
                disabled={!query.trim() || isLoading}
                className="btn-primary p-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted">
                Press Enter to send, Shift+Enter for new line
              </span>
              <button
                type="button"
                onClick={() => setMessages([])}
                className="text-xs text-muted hover:text-accent flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Clear chat
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}