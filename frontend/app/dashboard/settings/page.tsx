// frontend/app/dashboard/settings/page.tsx
// Complete file with shadcn-ui toast and persistence

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Palette, 
  Globe, 
  Save,
  Check,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';

export default function SettingsPage() {
  const { user, profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  
  // Form states - Initialize with actual profile data
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    organization: '',
    phone: '',
    timezone: 'Africa/Accra',
    language: 'en'
  });

  // Initialize form with profile data when it loads
  useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.name || '',
        email: profile.email || user?.email || '',
        organization: profile.organization || '',
        phone: '', // Add phone to profile if needed
        timezone: 'Africa/Accra',
        language: 'en'
      });
    }
  }, [profile, user]);

  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    reportReady: true,
    dataSync: false,
    weeklyDigest: true,
    systemUpdates: false
  });

  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'preferences', label: 'Preferences', icon: Globe }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Update profile in database
      await updateProfile({
        name: profileData.name,
        organization: profileData.organization,
      });
      
      // Save other settings to localStorage for now
      localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
      localStorage.setItem('theme', theme);
      
      toast({
        title: "Settings saved",
        description: "Your changes have been saved successfully",
      });
    } catch (error: any) {
      toast({
        title: "Failed to save",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfileChange = (field: string, value: string) => {
    setProfileData({ ...profileData, [field]: value });
  };

  // Load saved settings on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notificationSettings');
    if (savedNotifications) {
      setNotificationSettings(JSON.parse(savedNotifications));
    }
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme as any);
    }
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-on-surface mb-2">Settings</h1>
        <p className="text-muted">Manage your account and application preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-accent/10 text-accent'
                      : 'text-muted hover:bg-white/5 hover:text-on-surface'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="card p-6">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold text-on-surface mb-6">Profile Information</h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-on-surface mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => handleProfileChange('name', e.target.value)}
                        className="w-full px-4 py-2 bg-background border border-white/10 rounded-lg focus:outline-none focus:border-accent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-on-surface mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleProfileChange('email', e.target.value)}
                        className="w-full px-4 py-2 bg-background border border-white/10 rounded-lg focus:outline-none focus:border-accent"
                        disabled // Email usually can't be changed
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-on-surface mb-2">
                        Organization
                      </label>
                      <input
                        type="text"
                        value={profileData.organization}
                        onChange={(e) => handleProfileChange('organization', e.target.value)}
                        className="w-full px-4 py-2 bg-background border border-white/10 rounded-lg focus:outline-none focus:border-accent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-on-surface mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => handleProfileChange('phone', e.target.value)}
                        className="w-full px-4 py-2 bg-background border border-white/10 rounded-lg focus:outline-none focus:border-accent"
                        placeholder="+233 XX XXX XXXX"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-on-surface mb-2">
                        Timezone
                      </label>
                      <select
                        value={profileData.timezone}
                        onChange={(e) => handleProfileChange('timezone', e.target.value)}
                        className="w-full px-4 py-2 bg-background border border-white/10 rounded-lg focus:outline-none focus:border-accent"
                      >
                        <option value="Africa/Accra">Africa/Accra (GMT)</option>
                        <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                        <option value="Europe/London">Europe/London (GMT)</option>
                        <option value="America/New_York">America/New York (EST)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-on-surface mb-2">
                        Language
                      </label>
                      <select
                        value={profileData.language}
                        onChange={(e) => handleProfileChange('language', e.target.value)}
                        className="w-full px-4 py-2 bg-background border border-white/10 rounded-lg focus:outline-none focus:border-accent"
                      >
                        <option value="en">English</option>
                        <option value="fr">French</option>
                        <option value="tw">Twi</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold text-on-surface mb-6">Notification Preferences</h2>
                
                <div className="space-y-4">
                  {Object.entries({
                    emailAlerts: 'Email Alerts',
                    reportReady: 'Report Ready Notifications',
                    dataSync: 'Data Sync Updates',
                    weeklyDigest: 'Weekly Performance Digest',
                    systemUpdates: 'System Updates & Maintenance'
                  }).map(([key, label]) => (
                    <label key={key} className="flex items-center justify-between p-4 bg-background rounded-lg cursor-pointer hover:bg-white/5">
                      <div>
                        <div className="font-medium text-on-surface">{label}</div>
                        <div className="text-sm text-muted mt-1">
                          {key === 'emailAlerts' && 'Receive important alerts via email'}
                          {key === 'reportReady' && 'Get notified when reports are generated'}
                          {key === 'dataSync' && 'Updates about data synchronization'}
                          {key === 'weeklyDigest' && 'Weekly summary of your business metrics'}
                          {key === 'systemUpdates' && 'Important system updates and maintenance notices'}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings[key as keyof typeof notificationSettings]}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          [key]: e.target.checked
                        })}
                        className="w-5 h-5 text-accent"
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-semibold text-on-surface mb-6">Security Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-on-surface mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-on-surface mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 bg-background border border-white/10 rounded-lg focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-on-surface mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-2 bg-background border border-white/10 rounded-lg focus:outline-none focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-on-surface mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-2 bg-background border border-white/10 rounded-lg focus:outline-none focus:border-accent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-on-surface mb-4">Two-Factor Authentication</h3>
                    <div className="p-4 bg-background rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-on-surface">Two-factor authentication is not enabled</p>
                          <p className="text-sm text-muted mt-1">Add an extra layer of security to your account</p>
                        </div>
                        <button className="btn-primary">Enable 2FA</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Billing Settings */}
            {activeTab === 'billing' && (
              <div>
                <h2 className="text-xl font-semibold text-on-surface mb-6">Billing & Subscription</h2>
                
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-lg border border-accent/20">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-on-surface">Current Plan</h3>
                        <p className="text-2xl font-bold text-accent mt-1">Free Plan</p>
                      </div>
                      <button className="btn-primary">Upgrade</button>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted">Data Sources</p>
                        <p className="text-on-surface font-medium">3 / 3</p>
                      </div>
                      <div>
                        <p className="text-muted">Queries</p>
                        <p className="text-on-surface font-medium">100 / 100</p>
                      </div>
                      <div>
                        <p className="text-muted">Team Members</p>
                        <p className="text-on-surface font-medium">1 / 1</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-on-surface mb-4">Payment Method</h3>
                    <div className="p-4 bg-background rounded-lg">
                      <p className="text-muted">No payment method on file</p>
                      <button className="btn-secondary mt-3">Add Payment Method</button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-on-surface mb-4">Billing History</h3>
                    <div className="p-4 bg-background rounded-lg text-center">
                      <p className="text-muted">No billing history available</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div>
                <h2 className="text-xl font-semibold text-on-surface mb-6">Appearance</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-on-surface mb-4">Theme</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { value: 'light', label: 'Light', icon: Sun },
                        { value: 'dark', label: 'Dark', icon: Moon },
                        { value: 'system', label: 'System', icon: Monitor }
                      ].map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.value}
                            onClick={() => setTheme(option.value as any)}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              theme === option.value
                                ? 'border-accent bg-accent/10'
                                : 'border-white/10 hover:border-white/20'
                            }`}
                          >
                            <Icon className="w-6 h-6 mx-auto mb-2 text-accent" />
                            <p className="text-sm font-medium text-on-surface">{option.label}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-on-surface mb-4">Accent Color</h3>
                    <div className="flex gap-3">
                      {['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'].map((color) => (
                        <button
                          key={color}
                          className="w-10 h-10 rounded-lg border-2 border-white/20"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Settings */}
            {activeTab === 'preferences' && (
              <div>
                <h2 className="text-xl font-semibold text-on-surface mb-6">Preferences</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-on-surface mb-4">Data & Privacy</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-3 bg-background rounded-lg cursor-pointer">
                        <span className="text-sm text-on-surface">Share usage data to improve the product</span>
                        <input type="checkbox" className="w-5 h-5" />
                      </label>
                      <label className="flex items-center justify-between p-3 bg-background rounded-lg cursor-pointer">
                        <span className="text-sm text-on-surface">Receive product updates and tips</span>
                        <input type="checkbox" className="w-5 h-5" defaultChecked />
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-on-surface mb-4">Export Data</h3>
                    <div className="p-4 bg-background rounded-lg">
                      <p className="text-sm text-muted mb-3">Download all your data in a machine-readable format</p>
                      <button className="btn-secondary">Export All Data</button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-on-surface mb-4">Delete Account</h3>
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="text-sm text-red-400 mb-3">This action cannot be undone. All your data will be permanently deleted.</p>
                      <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-white/5">
              <button 
                className="btn-secondary"
                onClick={() => {
                  // Reset to original values
                  if (profile) {
                    setProfileData({
                      name: profile.name || '',
                      email: profile.email || user?.email || '',
                      organization: profile.organization || '',
                      phone: '',
                      timezone: 'Africa/Accra',
                      language: 'en'
                    });
                  }
                  toast({
                    title: "Changes discarded",
                    description: "Form reset to original values",
                  });
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="btn-primary flex items-center gap-2"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}