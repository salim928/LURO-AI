'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Brain, Mail, Lock, User, Building, Eye, EyeOff } from 'lucide-react';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { signUp, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    if (!agreeTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    try {
      await signUp(
        formData.email,
        formData.password,
        {
          name: formData.name,
          organization: formData.organization,
        }
      );
    } catch (err) {
      // Error is handled by useAuth hook
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="py-16">
      {/* Welcome Message */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-on-surface mb-2">Get Started Today</h1>
        <p className="muted">
          Join hundreds of Ghana SMEs making data-driven decisions
        </p>
      </div>

      {/* Sign Up Form */}
      <div className="max-w-md mx-auto">
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-on-surface mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-field pl-10"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-on-surface mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field pl-10"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="organization" className="block text-sm font-medium text-on-surface mb-2">
                Organization
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  id="organization"
                  name="organization"
                  type="text"
                  value={formData.organization}
                  onChange={handleInputChange}
                  className="input-field pl-10"
                  placeholder="Your company name"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-on-surface mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input-field pl-10 pr-10"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-on-surface"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-on-surface mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="input-field pl-10 pr-10"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-on-surface"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="agreeTerms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent mt-1"
              />
              <label htmlFor="agreeTerms" className="text-sm muted">
                I agree to the{' '}
                <Link href="/terms" className="text-accent hover:text-accent-400">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-accent hover:text-accent-400">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || !agreeTerms}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm muted">
              Already have an account?{' '}
              <Link href="/sign-in" className="text-accent hover:text-accent-400 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="card p-6 mt-8">
          <h3 className="font-semibold text-on-surface mb-4">What you get with LURO-AI:</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-green-400 text-sm">✓</span>
              </div>
              <span className="text-sm muted">Instant business insights in plain English</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-green-400 text-sm">✓</span>
              </div>
              <span className="text-sm muted">Ghana-specific market recommendations</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-green-400 text-sm">✓</span>
              </div>
              <span className="text-sm muted">80% cheaper than hiring consultants</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-green-400 text-sm">✓</span>
              </div>
              <span className="text-sm muted">Multiple database and file format support</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-green-400 text-sm">✓</span>
              </div>
              <span className="text-sm muted">Actionable recommendations with implementation plans</span>
            </div>
          </div>
        </div>

        {/* Features Highlight */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-2 border border-accent/20">
              <span className="text-accent text-xl">⚡</span>
            </div>
            <p className="text-xs muted">5-minute analysis</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-2 border border-accent/20">
              <span className="text-accent text-xl">💰</span>
            </div>
            <p className="text-xs muted">80% cost savings</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-2 border border-accent/20">
              <span className="text-accent text-xl">🇬🇭</span>
            </div>
            <p className="text-xs muted">Ghana optimized</p>
          </div>
        </div>
      </div>
    </div>
  );
}