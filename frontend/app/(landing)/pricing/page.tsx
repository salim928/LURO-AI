import { Check, Star, Zap, Shield } from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "500",
      period: "per analysis",
      description: "Perfect for small businesses getting started with data analysis",
      features: [
        "Single CSV analysis",
        "Up to 1,000 rows",
        "Basic insights report",
        "Email support",
        "48-hour turnaround"
      ],
      limitations: [
        "No historical tracking",
        "Basic visualizations only"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Professional",
      price: "1,500",
      period: "per month",
      description: "Ideal for growing SMEs who need regular insights",
      features: [
        "Up to 5 analyses per month",
        "Up to 10,000 rows per file",
        "Advanced insights & recommendations",
        "Charts and visualizations",
        "Priority email support",
        "24-hour turnaround",
        "Historical trend tracking",
        "Export to PDF/Excel"
      ],
      limitations: [],
      cta: "Most Popular",
      popular: true
    },
    {
      name: "Enterprise",
      price: "5,000",
      period: "per month",
      description: "For established businesses with complex data needs",
      features: [
        "Unlimited analyses",
        "Unlimited data size",
        "Custom AI insights",
        "Advanced visualizations",
        "Phone & email support",
        "Same-day turnaround",
        "Multi-file analysis",
        "API access (coming soon)",
        "Custom reporting",
        "Dedicated account manager"
      ],
      limitations: [],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const comparisonData = [
    {
      feature: "Traditional Consultant",
      cost: "GH₵10,000 - 50,000",
      time: "2-8 weeks",
      quality: "High",
      customization: "High"
    },
    {
      feature: "LURO-AI",
      cost: "GH₵500 - 5,000",
      time: "Minutes to hours",
      quality: "High",
      customization: "Medium-High"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-600 mb-6">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Choose the plan that fits your business needs. All plans include our 
          AI-powered analysis and Ghana-specific insights. No hidden fees.
        </p>
        <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
          <Shield className="w-4 h-4" />
          <span>30-day money-back guarantee</span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {plans.map((plan, index) => (
          <div 
            key={index} 
            className={`relative card ${plan.popular ? 'ring-2 ring-blue-500 shadow-xl' : ''}`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span>Most Popular</span>
                </div>
              </div>
            )}
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-400 mb-2">{plan.name}</h3>
              <div className="mb-2">
                <span className="text-3xl font-bold text-gray-500">GH₵{plan.price}</span>
                <span className="text-gray-600">/{plan.period}</span>
              </div>
              <p className="text-sm text-gray-600">{plan.description}</p>
            </div>

            <div className="space-y-3 mb-6">
              {plan.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
              
              {plan.limitations.map((limitation, limitIndex) => (
                <div key={limitIndex} className="flex items-start space-x-3 opacity-60">
                  <div className="w-5 h-5 flex-shrink-0 mt-0.5"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full mt-1.5"></div>
                  <span className="text-sm text-gray-500">{limitation}</span>
                </div>
              ))}
        </div>

        <button 
          className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
            plan.popular 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
          }`}
        >
          {plan.cta}
        </button>
      </div>
    ))}
  </div>

  {/* Comparison Section */}
  <div className="mb-16">
    <h2 className="text-3xl font-bold text-center text-gray-600 mb-8">
      AI vs Traditional Consultants
    </h2>
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Solution</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Cost</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Time</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Quality</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Customization</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {comparisonData.map((row, index) => (
            <tr key={index} className={index === 1 ? 'bg-blue-50' : ''}>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {row.feature}
                {index === 1 && <span className="ml-2 text-blue-600">← You save 80%!</span>}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">{row.cost}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{row.time}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{row.quality}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{row.customization}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>

  {/* FAQ Section */}
  <div className="mb-16">
    <h2 className="text-3xl font-bold text-center text-gray-400 mb-8">
      Frequently Asked Questions
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-gray-400 mb-2">What file formats do you support?</h3>
          <p className="text-gray-600 text-sm">Currently we support CSV files. Excel and database connections are coming soon.</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-400 mb-2">How accurate are the AI insights?</h3>
          <p className="text-gray-600 text-sm">Our AI provides consultant-level accuracy, with the added benefit of being trained on Ghana-specific business patterns.</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-400 mb-2">Can I cancel anytime?</h3>
          <p className="text-gray-600 text-sm">Yes, monthly plans can be cancelled anytime. No long-term contracts or cancellation fees.</p>
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-gray-400 mb-2">Do you offer custom solutions?</h3>
          <p className="text-gray-600 text-sm">Yes, our Enterprise plan includes custom analysis and dedicated support for your specific needs.</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-400 mb-2">Is my data secure?</h3>
          <p className="text-gray-600 text-sm">Absolutely. We process your data securely and don't store it after analysis. Full privacy guaranteed.</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-400 mb-2">Do you offer training?</h3>
          <p className="text-gray-600 text-sm">Yes, we provide training sessions to help you get the most out of your data analysis.</p>
        </div>
      </div>
    </div>
  </div>

  {/* CTA Section */}
  <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
    <h2 className="text-2xl font-bold mb-4">
      Ready to Transform Your Business with Data?
    </h2>
    <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
      Start with our Starter plan or try a free analysis to see the power of AI-driven insights.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
        <Zap className="w-5 h-5" />
        <span>Start Free Analysis</span>
      </button>
      <button className="border border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors">
        Contact Sales Team
      </button>
    </div>
    <p className="text-xs text-blue-200 mt-4">No credit card required • 30-day money-back guarantee</p>
  </div>
</div>
);
}