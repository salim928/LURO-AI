import { Brain, Target, Users, Globe, Award, Zap } from 'lucide-react';

export default function AboutPage() {
  const features = [
    {
      icon: Brain,
      title: "Advanced AI Technology",
      description: "Powered by state-of-the-art machine learning algorithms and natural language processing."
    },
    {
      icon: Target,
      title: "Ghana Market Focus",
      description: "Specifically designed for Ghanaian SMEs with local market context and insights."
    },
    {
      icon: Users,
      title: "SME Friendly",
      description: "Built for small and medium enterprises who need professional insights without the high cost."
    },
    {
      icon: Globe,
      title: "Regional Expansion",
      description: "Helping businesses identify opportunities across Ghana's diverse regions."
    },
    {
      icon: Award,
      title: "Proven Results",
      description: "80% cost savings compared to traditional consultants with faster turnaround times."
    },
    {
      icon: Zap,
      title: "Instant Analysis",
      description: "Get comprehensive business insights in minutes, not weeks or months."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-500 mb-6">
          About LURO-AI
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We're democratizing business intelligence for Ghanaian SMEs through AI-powered 
          data analysis. Our mission is to make data-driven decision making accessible 
          to every business, regardless of size or budget.
        </p>
      </div>

      {/* Story Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-3xl font-bold text-gray-500 mb-6">Our Story</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              Born from the frustration of seeing talented Ghanaian entrepreneurs struggle 
              with data analysis, LURO-AI was created to level the playing field. 
              Traditional business intelligence solutions cost thousands of cedis and take 
              weeks to deliver results.
            </p>
            <p>
              We believed there had to be a better way. By leveraging artificial intelligence 
              and understanding the unique challenges of the Ghanaian market, we built a 
              solution that delivers consultant-level insights in minutes, not months.
            </p>
            <p>
              Today, we're proud to serve SMEs across Greater Accra, Ashanti, Northern, and 
              other regions, helping them make data-driven decisions that drive growth.
            </p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Impact by Numbers</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">SMEs Served</span>
              <span className="text-2xl font-bold text-blue-600">500+</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cost Savings</span>
              <span className="text-2xl font-bold text-green-600">80%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Time Savings</span>
              <span className="text-2xl font-bold text-purple-600">95%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Regions Covered</span>
              <span className="text-2xl font-bold text-orange-600">All 16</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-500 mb-12">
          What Makes Us Different
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="card text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-500 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ghana Focus Section */}
      <div className="bg-green-50 rounded-2xl p-8 mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Built for Ghana 🇬🇭
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We understand the unique challenges and opportunities of doing business in Ghana. 
            Our AI is trained on local market dynamics and business patterns.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">Market Context</div>
            <p className="text-gray-600 text-sm">
              Regional preferences, seasonal patterns, and local business customs
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">Currency & Pricing</div>
            <p className="text-gray-600 text-sm">
              Ghana cedi calculations, mobile money integration, and local pricing strategies
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">Growth Opportunities</div>
            <p className="text-gray-600 text-sm">
              Export potential, regional expansion, and government incentive programs
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-500 mb-8">Our Commitment</h2>
        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-gray-600 mb-6">
            We're committed to supporting Ghana's entrepreneurial ecosystem by making 
            advanced analytics accessible to every business. Our goal is to help 
            1,000 SMEs make better decisions through data by 2025.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-blue-100 text-blue-800 px-6 py-3 rounded-lg font-medium">
              🎯 1,000 SMEs by 2025
            </div>
            <div className="bg-green-100 text-green-800 px-6 py-3 rounded-lg font-medium">
              🌍 All 16 regions covered
            </div>
            <div className="bg-purple-100 text-purple-800 px-6 py-3 rounded-lg font-medium">
              🤝 Local partnership focus
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">
          Ready to Join Our Mission?
        </h2>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Whether you're an SME looking for insights or a partner wanting to support 
          Ghana's business ecosystem, we'd love to work with you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Start Your Analysis
          </button>
          <button className="border border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors">
            Partner With Us
          </button>
        </div>
      </div>
    </div>
  );
}