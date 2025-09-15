// ============================================
// STEP 3: Update frontend/lib/supabase.ts
// ============================================
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const supabase = createClientComponentClient();
