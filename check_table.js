import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://yyfjuhardyoutgzxqbyj.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5Zmp1aGFyZHlvdXRnenhxYnlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxOTI0NDksImV4cCI6MjA5ODc2ODQ0OX0.AegNmG-QFZn9DQ5poX2kwCsfpaRgvkhdecDh4T6xOFI'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function check() {
  const { data, error } = await supabase.from('projects').select('*').limit(1)
  console.log("Data:", data)
  console.log("Error:", error)
}
check()
