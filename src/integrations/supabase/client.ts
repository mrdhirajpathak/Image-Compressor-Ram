
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://smjabbpukcmeorldjerm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtamFiYnB1a2NtZW9ybGRqZXJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3OTMwMDUsImV4cCI6MjA2NDM2OTAwNX0.3YmY91ie2YAkbtPZiO_AiTc5eKIJeFb3zwMOI8thrlA'

export const supabase = createClient(supabaseUrl, supabaseKey)
