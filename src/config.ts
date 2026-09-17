// Supabase URL + anon/publishable key. Safe to ship in the client: access is
// controlled by Row Level Security policies on the `progress` table, not by
// keeping this key secret. Never put the service-role key here.
export const SUPABASE_URL = 'https://mpvoudnxksewsbdztyoc.supabase.co'
export const SUPABASE_ANON_KEY = 'sb_publishable_44IDG_wbmOHypCRD5OWXLw_UHltvhgm'

// Cloud sync is OFF while running locally (`npm run dev`), so playing through a
// game on the dev server never writes to the real Supabase data. Progress still
// saves to localStorage, so local play behaves the same: it just stays on this
// machine. Set VITE_CLOUD_SYNC=on in a local .env to deliberately test sign-in
// and sync against the database.
const syncOverride = import.meta.env.VITE_CLOUD_SYNC
export const CLOUD_SYNC_ENABLED = syncOverride ? syncOverride === 'on' : !import.meta.env.DEV
