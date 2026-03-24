import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  as string;
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Guard: only create client when env vars are present
if (!supabaseUrl || !supabaseKey) {
  console.warn(
    '[Supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not set. ' +
    'Supabase features will be unavailable until .env.local is configured.'
  );
}

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// ─── Lead Capture ────────────────────────────────────────────────────────────

export interface DemoLead {
  org_name:     string;
  contact_name: string;
  product_type: string;
  phone_email:  string;
}

/**
 * Inserts a demo-request lead into the `partner_leads` table.
 * Falls back to a console.info when Supabase is not configured (dev mode).
 * Returns { ok, error }.
 */
export async function submitDemoLead(
  lead: DemoLead
): Promise<{ ok: boolean; error: string | null }> {
  if (!supabase) {
    // Dev fallback: log and pretend success
    console.info('[Supabase] Demo lead (Supabase not configured):', lead);
    return { ok: true, error: null };
  }

  const { error } = await supabase
    .from('partner_leads')
    .insert([{ ...lead, created_at: new Date().toISOString() }]);

  if (error) {
    console.error('[Supabase] submitDemoLead error:', error.message);
    return { ok: false, error: error.message };
  }

  return { ok: true, error: null };
}
