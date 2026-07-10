const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://yyfjuhardyoutgzxqbyj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5Zmp1aGFyZHlvdXRnenhxYnlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxOTI0NDksImV4cCI6MjA5ODc2ODQ0OX0.AegNmG-QFZn9DQ5poX2kwCsfpaRgvkhdecDh4T6xOFI';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
supabase.storage.listBuckets().then(res => console.log(res));
