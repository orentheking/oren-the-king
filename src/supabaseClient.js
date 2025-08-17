import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://tvyehcqcybwosdsydlgg.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2eWVoY3FjeWJ3b3Nkc3lkbGdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzE4NzAsImV4cCI6MjA3MTAwNzg3MH0.a69ZNbE_30KAwtujvGLkRMx3K9HfVAdsUDtni7A_PH0"
export const supabase = createClient(supabaseUrl, supabaseKey)