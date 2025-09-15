// frontend/app/(auth)/sign-in/page.tsx
// Complete file with shadcn-ui toast

'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Brain, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, isLoading, error } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      toast({
        title: "Welcome back!",
        description: "Successfully signed in to your account",
      });
    } catch (err: any) {
      toast({
        title: "Sign in failed",
        description: err.message || "Please check your credentials and try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="py-16">
      {/* Welcome Message */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-on-surface mb-2">Welcome Back</h1>
        <p className="muted">
          Sign in to continue analyzing your business data with AI
        </p>
      </div>

      {/* Sign In Form */}
      <div className="max-w-md mx-auto">
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-on-surface mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 pl-10 bg-background border border-white/10 rounded-lg focus:outline-none focus:border-accent"
                  placeholder="Enter your email"
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
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 pl-10 pr-10 bg-background border border-white/10 rounded-lg focus:outline-none focus:border-accent"
                  placeholder="Enter your password"
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

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm muted">
              Don't have an account?{' '}
              <Link href="/sign-up" className="text-accent hover:text-accent-400 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Features Highlight */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2 border border-accent/20">
              <span className="text-accent text-xl">⚡</span>
            </div>
            <p className="text-xs muted">5-minute analysis</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2 border border-accent/20">
              <span className="text-accent text-xl">💰</span>
            </div>
            <p className="text-xs muted">80% cost savings</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2 border border-accent/20">
              <span className="text-accent text-xl">🇬🇭</span>
            </div>
            <p className="text-xs muted">Ghana optimized</p>
          </div>
        </div>
      </div>
    </div>
  );
}