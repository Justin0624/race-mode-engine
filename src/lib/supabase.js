// Supabase is optional — app works without it (guest mode)
let supabase = null
let supabaseReady = false

async function initSupabase() {
  try {
    const url = import.meta.env.VITE_SUPABASE_URL
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY
    if (!url || !key || !url.startsWith('http')) return
    const { createClient } = await import('@supabase/supabase-js')
    supabase = createClient(url, key)
    supabaseReady = true
  } catch (e) {
    console.warn('Supabase unavailable — running in guest mode')
  }
}

// Fire and forget — don't block app load
initSupabase()

export { supabase, supabaseReady }
