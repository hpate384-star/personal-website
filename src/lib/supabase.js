import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://yyfjuhardyoutgzxqbyj.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5Zmp1aGFyZHlvdXRnenhxYnlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxOTI0NDksImV4cCI6MjA5ODc2ODQ0OX0.AegNmG-QFZn9DQ5poX2kwCsfpaRgvkhdecDh4T6xOFI'

let supabase = null

try {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
} catch (err) {
  console.error('[Supabase] Failed to initialize client:', err)
}

export { supabase }


export function getOrCreateSessionId() {
  const KEY = 'portfolio_session_id'
  let id = localStorage.getItem(KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(KEY, id)
  }
  return id
}

export async function saveLastOpened(key, value) {
  if (!supabase) return
  try {
    const sessionId = getOrCreateSessionId()
    await supabase.from('last_opened').upsert(
      { session_id: sessionId, key, value, updated_at: new Date().toISOString() },
      { onConflict: 'session_id,key' }
    )
  } catch (e) {
    console.error('[Supabase] saveLastOpened error:', e)
  }
}

export async function getLastOpened(key) {
  if (!supabase) return null
  try {
    const sessionId = getOrCreateSessionId()
    const { data } = await supabase
      .from('last_opened')
      .select('value')
      .eq('session_id', sessionId)
      .eq('key', key)
      .single()
    return data?.value || null
  } catch (e) {
    return null
  }
}
