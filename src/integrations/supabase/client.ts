// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gdftfgutsizrgnvdjgmo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkZnRmZ3V0c2l6cmdudmRqZ21vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0ODgyNDQsImV4cCI6MjA2MzA2NDI0NH0.nekv3eWvL2g8gjyb_1ioqpy5pr4VduarohY4X4j70IU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);