const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const SESSION_KEY = 'onegovflow.supabase.session';

export type SupabaseUser = {
  id: string;
  phone?: string;
  user_metadata?: Record<string, unknown>;
};

export type SupabaseSession = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  user: SupabaseUser;
};

function authHeaders(accessToken?: string) {
  if (!SUPABASE_ANON_KEY) throw new Error('Supabase public client configuration is missing.');
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${accessToken ?? SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  };
}

function readSession(): SupabaseSession | null {
  const value = window.localStorage.getItem(SESSION_KEY);
  if (!value) return null;
  try {
    return JSON.parse(value) as SupabaseSession;
  } catch {
    window.localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

function writeSession(session: SupabaseSession | null) {
  if (session) window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else window.localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new CustomEvent('onegovflow:auth-changed'));
}

async function supabaseRequest<T>(path: string, init: RequestInit = {}, accessToken?: string): Promise<T> {
  if (!SUPABASE_URL) throw new Error('Supabase URL is not configured.');
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    ...init,
    headers: { ...authHeaders(accessToken), ...(init.headers ?? {}) },
  });
  const payload = (await response.json().catch(() => null)) as { msg?: string; error_description?: string; error?: string } | T | null;
  if (!response.ok) {
    const message = payload && typeof payload === 'object' && ('msg' in payload || 'error_description' in payload || 'error' in payload)
      ? payload.msg ?? payload.error_description ?? payload.error
      : undefined;
    throw new Error(message || 'Supabase request failed.');
  }
  return payload as T;
}

export function getStoredSession() {
  return readSession();
}

export async function sendPhoneOtp(phone: string) {
  await supabaseRequest('/auth/v1/otp', {
    method: 'POST',
    body: JSON.stringify({ phone, create_user: true }),
  });
}

export async function verifyPhoneOtp(phone: string, token: string) {
  const session = await supabaseRequest<SupabaseSession>('/auth/v1/verify', {
    method: 'POST',
    body: JSON.stringify({ phone, token, type: 'sms' }),
  });
  writeSession(session);
  return session;
}

export async function refreshStoredSession() {
  const session = readSession();
  if (!session?.refresh_token) return null;
  try {
    const next = await supabaseRequest<SupabaseSession>('/auth/v1/token?grant_type=refresh_token', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: session.refresh_token }),
    });
    writeSession(next);
    return next;
  } catch {
    writeSession(null);
    return null;
  }
}

export async function signOutSupabase() {
  const session = readSession();
  if (session?.access_token) {
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, { method: 'POST', headers: authHeaders(session.access_token) }).catch(() => undefined);
  }
  writeSession(null);
}

export async function loadLanguagePreference(userId: string) {
  if (!SUPABASE_URL) return null;
  const rows = await supabaseRequest<Array<{ preferred_language?: string }>>(
    `/rest/v1/user_preferences?select=preferred_language&user_id=eq.${encodeURIComponent(userId)}&limit=1`,
    {},
    readSession()?.access_token,
  );
  const language = rows[0]?.preferred_language;
  return language === 'hi' || language === 'en' ? language : null;
}

export async function saveLanguagePreference(userId: string, language: 'en' | 'hi') {
  if (!SUPABASE_URL) return;
  await supabaseRequest(`/rest/v1/user_preferences?on_conflict=user_id`, {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ user_id: userId, preferred_language: language, updated_at: new Date().toISOString() }),
  }, readSession()?.access_token);
}