'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { CheckCircle, ArrowRight, Building, Target, BarChart3, Brain } from 'lucide-react';

interface OnboardingData {
  organizationName: string;
  industry: string;
  companySize: string;
  location: string;
  primaryGoals: string[];
  currentChallenges: string;
  dataTypes: string[];
  monthlyRevenue: string;
  experienceLevel: string;
}

const INDUSTRIES = [
  'Retail & E-commerce',
  'Agriculture & Food Processing', 
  'Manufacturing',
  'Financial Services',
  'Healthcare',
  'Education',
  'Tourism & Hospitality',
  'Construction & Real Estate',
  'Technology',
  'Transportation & Logistics',
  'Professional Services',
  'Other'
];

const GHANA_REGIONS = [
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
  'Other'
];

const BUSINESS_GOALS = [
  'Increase sales revenue',
  'Improve customer retention',
  'Optimize operations',
  'Expand to new markets',
  'Reduce costs',
  'Better inventory management',
  'Improve marketing ROI',
  'Enhance customer experience'
];

const DATA_TYPES = [
  'Sales data',
  'Customer data',
  'Inventory data',
  'Financial records',
  'Marketing metrics',
  'Operational data',
  'Website analytics',
  'Social media data'
];

export default function OnboardingPage() {
  const { user, isLoading, updateProfile } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    organizationName: '',
    industry: '',
    companySize: '',
    location: '',
    primaryGoals: [],
    currentChallenges: '',
    dataTypes: [],
    monthlyRevenue: '',
    experienceLevel: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  // Update form with user data when available
  useEffect(() => {
    if (user && !onboardingData.organizationName) {
      setOnboardingData(prev => ({
        ...prev,
        organizationName: user.organization || ''
      }));
    }
  }, [user, onboardingData.organizationName]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-muted mt-4">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated (after loading is complete)
  if (!user) {
    router.push('/sign-in');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-muted mt-4">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleArrayValue = (array: string[], value: string, key: keyof OnboardingData) => {
    const currentArray = array;
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    setOnboardingData(prev => ({
      ...prev,
      [key]: newArray
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Update user profile with onboarding data
      if (updateProfile) {
        await updateProfile({
          ...user,
          organization: onboardingData.organizationName,
        });
      }

      // Simulate API call to save onboarding data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Onboarding error:', error);
      // Still redirect to dashboard even if API fails
      router.push('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Building className="w-12 h-12 text-accent mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-on-surface">Tell us about your business</h2>
              <p className="muted">Help us understand your organization better</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="organizationName" className="text-on-surface">Organization Name *</Label>
                <Input
                  id="organizationName"
                  placeholder="e.g., Kwame's Trading Enterprise"
                  value={onboardingData.organizationName}
                  onChange={(e) => setOnboardingData(prev => ({ ...prev, organizationName: e.target.value }))}
                  className="input-field"
                />
              </div>

              <div>
                <Label htmlFor="industry" className="text-on-surface">Industry *</Label>
                <Select 
                  value={onboardingData.industry} 
                  onValueChange={(value) => setOnboardingData(prev => ({ ...prev, industry: value }))}
                >
                  <SelectTrigger className="input-field">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((industry) => (
                      <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="companySize" className="text-on-surface">Company Size</Label>
                <Select 
                  value={onboardingData.companySize} 
                  onValueChange={(value) => setOnboardingData(prev => ({ ...prev, companySize: value }))}
                >
                  <SelectTrigger className="input-field">
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-5">1-5 employees</SelectItem>
                    <SelectItem value="6-20">6-20 employees</SelectItem>
                    <SelectItem value="21-50">21-50 employees</SelectItem>
                    <SelectItem value="51-100">51-100 employees</SelectItem>
                    <SelectItem value="100+">100+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location" className="text-on-surface">Location in Ghana</Label>
                <Select 
                  value={onboardingData.location} 
                  onValueChange={(value) => setOnboardingData(prev => ({ ...prev, location: value }))}
                >
                  <SelectTrigger className="input-field">
                    <SelectValue placeholder="Select your region" />
                  </SelectTrigger>
                  <SelectContent>
                    {GHANA_REGIONS.map((region) => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Target className="w-12 h-12 text-accent mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-on-surface">What are your main goals?</h2>
              <p className="muted">Select all that apply to your business objectives</p>
            </div>

            <div>
              <Label className="text-base font-medium text-on-surface">Primary Business Goals</Label>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {BUSINESS_GOALS.map((goal) => (
                  <div
                    key={goal}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      onboardingData.primaryGoals.includes(goal)
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] text-on-surface'
                    }`}
                    onClick={() => toggleArrayValue(onboardingData.primaryGoals, goal, 'primaryGoals')}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{goal}</span>
                      {onboardingData.primaryGoals.includes(goal) && (
                        <CheckCircle className="w-4 h-4 text-accent" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="monthlyRevenue" className="text-on-surface">Approximate Monthly Revenue (Optional)</Label>
              <Select 
                value={onboardingData.monthlyRevenue} 
                onValueChange={(value) => setOnboardingData(prev => ({ ...prev, monthlyRevenue: value }))}
              >
                <SelectTrigger className="input-field">
                  <SelectValue placeholder="Select revenue range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-5k">Under GH₵5,000</SelectItem>
                  <SelectItem value="5k-20k">GH₵5,000 - GH₵20,000</SelectItem>
                  <SelectItem value="20k-50k">GH₵20,000 - GH₵50,000</SelectItem>
                  <SelectItem value="50k-100k">GH₵50,000 - GH₵100,000</SelectItem>
                  <SelectItem value="100k-500k">GH₵100,000 - GH₵500,000</SelectItem>
                  <SelectItem value="500k+">Over GH₵500,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <BarChart3 className="w-12 h-12 text-accent mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-on-surface">What data do you have?</h2>
              <p className="muted">Help us understand your current data landscape</p>
            </div>

            <div>
              <Label className="text-base font-medium text-on-surface">Types of Data Available</Label>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {DATA_TYPES.map((dataType) => (
                  <div
                    key={dataType}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      onboardingData.dataTypes.includes(dataType)
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] text-on-surface'
                    }`}
                    onClick={() => toggleArrayValue(onboardingData.dataTypes, dataType, 'dataTypes')}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{dataType}</span>
                      {onboardingData.dataTypes.includes(dataType) && (
                        <CheckCircle className="w-4 h-4 text-accent" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="experienceLevel" className="text-on-surface">Data Analysis Experience</Label>
              <Select 
                value={onboardingData.experienceLevel} 
                onValueChange={(value) => setOnboardingData(prev => ({ ...prev, experienceLevel: value }))}
              >
                <SelectTrigger className="input-field">
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner - New to data analysis</SelectItem>
                  <SelectItem value="intermediate">Intermediate - Some Excel experience</SelectItem>
                  <SelectItem value="advanced">Advanced - Used BI tools before</SelectItem>
                  <SelectItem value="expert">Expert - Data professional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="currentChallenges" className="text-on-surface">Current Business Challenges (Optional)</Label>
              <Textarea
                id="currentChallenges"
                placeholder="What are the main challenges your business is facing? This helps us provide more relevant insights."
                value={onboardingData.currentChallenges}
                onChange={(e) => setOnboardingData(prev => ({ ...prev, currentChallenges: e.target.value }))}
                rows={3}
                className="input-field resize-none"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-on-surface">You're all set!</h2>
              <p className="muted">Review your information and complete your setup</p>
            </div>

            <div className="panel p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium muted">Organization:</span>
                  <p className="text-on-surface">{onboardingData.organizationName}</p>
                </div>
                <div>
                  <span className="font-medium muted">Industry:</span>
                  <p className="text-on-surface">{onboardingData.industry}</p>
                </div>
                <div>
                  <span className="font-medium muted">Location:</span>
                  <p className="text-on-surface">{onboardingData.location}</p>
                </div>
                <div>
                  <span className="font-medium muted">Company Size:</span>
                  <p className="text-on-surface">{onboardingData.companySize}</p>
                </div>
              </div>

              <div>
                <span className="font-medium muted">Primary Goals:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {onboardingData.primaryGoals.map((goal) => (
                    <Badge key={goal} className="bg-accent/20 text-accent border-accent/30">{goal}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-medium muted">Available Data:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {onboardingData.dataTypes.map((dataType) => (
                    <Badge key={dataType} className="bg-[rgba(255,255,255,0.05)] text-on-surface border-[rgba(255,255,255,0.1)]">{dataType}</Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
              <h3 className="font-semibold text-accent mb-2">What happens next?</h3>
              <ul className="space-y-1 text-sm muted">
                <li>• Access your personalized dashboard</li>
                <li>• Connect your data sources</li>
                <li>• Start with guided analysis templates</li>
                <li>• Get Ghana-specific business recommendations</li>
                <li>• Join our community of 500+ SMEs</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return onboardingData.organizationName && onboardingData.industry;
      case 2:
        return onboardingData.primaryGoals.length > 0;
      case 3:
        return onboardingData.dataTypes.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-on-surface">Welcome, {user.name}!</h1>
            </div>
            <Badge className="bg-accent/20 text-accent border-accent/30">Step {currentStep} of {totalSteps}</Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Main Card */}
        <Card>
          <CardContent className="p-8">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1 || isSubmitting}
            className="btn-secondary"
          >
            Previous
          </Button>
          
          <div className="flex items-center space-x-2">
            {Array.from({ length: totalSteps }, (_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index + 1 <= currentStep ? 'bg-accent' : 'bg-[rgba(255,255,255,0.2)]'
                }`}
              />
            ))}
          </div>

          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed() || isSubmitting}
              className="btn-primary"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Setting up...
                </>
              ) : (
                <>
                  Complete Setup
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}