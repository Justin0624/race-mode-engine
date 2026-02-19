// Database operations via Supabase
// Uses anon key client-side (RLS policies control access)

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("[RaceMode DB] URL:", SUPABASE_URL ? "SET" : "MISSING");
console.log("[RaceMode DB] KEY:", SUPABASE_KEY ? "SET (" + SUPABASE_KEY.substring(0,20) + "...)" : "MISSING");

function headers() {
  return {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Prefer': 'return=representation',
  };
}

function url(table, query = '') {
  return `${SUPABASE_URL}/rest/v1/${table}${query ? '?' + query : ''}`;
}

export const db = {
  // ── Profiles ──
  async createProfile(data) {
    console.log("[RaceMode DB] createProfile called with:", data);
    const r = await fetch(url('profiles'), {
      method: 'POST', headers: headers(),
      body: JSON.stringify(data),
    });
    const text = await r.text();
    console.log("[RaceMode DB] createProfile response:", r.status, text);
    try { const rows = JSON.parse(text); return rows[0] || null; } catch(e) { return null; }
  },

  async getProfile(id) {
    const r = await fetch(url('profiles', `id=eq.${id}&select=*`), { headers: headers() });
    const rows = await r.json();
    return rows[0] || null;
  },

  async updateProfile(id, data) {
    data.updated_at = new Date().toISOString();
    const r = await fetch(url('profiles', `id=eq.${id}`), {
      method: 'PATCH', headers: headers(),
      body: JSON.stringify(data),
    });
    const rows = await r.json();
    return rows[0] || null;
  },

  async getAllProfiles() {
    const r = await fetch(url('profiles', 'select=*&order=created_at.desc'), { headers: headers() });
    return await r.json();
  },

  // ── Cars ──
  async createCar(data) {
    const r = await fetch(url('cars'), {
      method: 'POST', headers: headers(),
      body: JSON.stringify(data),
    });
    const rows = await r.json();
    return rows[0] || null;
  },

  async getCars(profileId) {
    const r = await fetch(url('cars', `profile_id=eq.${profileId}&select=*&order=created_at.desc`), { headers: headers() });
    return await r.json();
  },

  async updateCar(id, data) {
    data.updated_at = new Date().toISOString();
    const r = await fetch(url('cars', `id=eq.${id}`), {
      method: 'PATCH', headers: headers(),
      body: JSON.stringify(data),
    });
    const rows = await r.json();
    return rows[0] || null;
  },

  // ── Sessions ──
  async createSession(data) {
    const r = await fetch(url('sessions'), {
      method: 'POST', headers: headers(),
      body: JSON.stringify(data),
    });
    const rows = await r.json();
    return rows[0] || null;
  },

  async getSessions(profileId, limit = 10) {
    const r = await fetch(url('sessions', `profile_id=eq.${profileId}&select=*&order=created_at.desc&limit=${limit}`), { headers: headers() });
    return await r.json();
  },

  // ── Corrections (knowledge improvements from experienced drivers) ──
  async createCorrection(data) {
    const r = await fetch(url('corrections'), {
      method: 'POST', headers: headers(),
      body: JSON.stringify(data),
    });
    const rows = await r.json();
    return rows[0] || null;
  },

  async getApprovedCorrections(limit = 20) {
    const r = await fetch(url('corrections', `status=eq.approved&select=topic,correction,reasoning,driver_name&order=created_at.desc&limit=${limit}`), { headers: headers() });
    return await r.json();
  },

  async getPendingCorrections() {
    const r = await fetch(url('corrections', `status=eq.pending&select=*&order=created_at.desc`), { headers: headers() });
    return await r.json();
  },

  // ── Track Intelligence ──
  async getTrackSetups(trackName, excludeProfileId) {
    // Get all cars from profiles that race at this track (excluding current user)
    try {
      // First get profiles at this track
      const pr = await fetch(url('profiles', `home_track=eq.${encodeURIComponent(trackName)}&id=neq.${excludeProfileId}&select=id`), { headers: headers() });
      const profiles = await pr.json();
      if (!profiles.length) return [];
      
      const ids = profiles.map(p => p.id);
      const cr = await fetch(url('cars', `profile_id=in.(${ids.join(',')})&select=brand,model,setup&is_active=eq.true`), { headers: headers() });
      return await cr.json();
    } catch (e) {
      return [];
    }
  },

  // ── Conversations ──
  async saveConversation(profileId, messages, summary = '') {
    // Check if conversation exists for this profile
    const existing = await this.getConversation(profileId);
    if (existing) {
      return await this.updateConversation(existing.id, { messages, summary });
    }
    const r = await fetch(url('conversations'), {
      method: 'POST', headers: headers(),
      body: JSON.stringify({ profile_id: profileId, messages, summary }),
    });
    const rows = await r.json();
    return rows[0] || null;
  },

  async getConversation(profileId) {
    const r = await fetch(url('conversations', `profile_id=eq.${profileId}&select=*&order=updated_at.desc&limit=1`), { headers: headers() });
    const rows = await r.json();
    return rows[0] || null;
  },

  async updateConversation(id, data) {
    data.updated_at = new Date().toISOString();
    const r = await fetch(url('conversations', `id=eq.${id}`), {
      method: 'PATCH', headers: headers(),
      body: JSON.stringify(data),
    });
    const rows = await r.json();
    return rows[0] || null;
  },
};

// Simple device-based profile ID (until we add auth)
// Stores a profile ID in localStorage so the same browser always gets the same profile
export function getDeviceProfileId() {
  return localStorage.getItem('race_mode_profile_id');
}

export function setDeviceProfileId(id) {
  localStorage.setItem('race_mode_profile_id', id);
}
