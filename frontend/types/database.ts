
// ============================================
// 2. CREATE: frontend/types/database.ts
// ============================================
// This should match your Supabase database schema
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          organization: string | null;
          role: 'admin' | 'user' | 'viewer';
          subscription: 'free' | 'professional' | 'enterprise';
          avatar_url: string | null;
          phone: string | null;
          timezone: string | null;
          language: string | null;
          notificationSettings: string | null;
          theme: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          organization?: string | null;
          role?: 'admin' | 'user' | 'viewer';
          subscription?: 'free' | 'professional' | 'enterprise';
          avatar_url?: string | null;
          phone?: string | null;
          timezone?: string | null;
          language?: string | null;
          notificationSettings?: string | null;
          theme?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          organization?: string | null;
          role?: 'admin' | 'user' | 'viewer';
          subscription?: 'free' | 'professional' | 'enterprise';
          avatar_url?: string | null;
          phone?: string | null;
          timezone?: string | null;
          language?: string | null;
          notificationSettings?: string | null;
          theme?: string | null;
          updated_at?: string;
        };
      };
    };
  };
};