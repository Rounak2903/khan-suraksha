// Unified Cross-Port Client for DGMS Master Miners Ledger
// Connects Worker App (:5173) and Admin Portal (:5174) with zero latency

const STORAGE_KEY = 'khan_suraksha_registered_miners';

const API_ENDPOINTS = [
  '/api/miners',
  'http://localhost:5174/api/miners',
  'http://localhost:5173/api/miners'
];

export async function fetchMasterMiners() {
  for (const url of API_ENDPOINTS) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch {}
        return data;
      }
    } catch {
      // try next endpoint
    }
  }

  // Fallback to localStorage if offline
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export async function postMinerAction(actionPayload) {
  let success = false;
  let result = null;

  for (const url of API_ENDPOINTS) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actionPayload)
      });
      if (res.ok) {
        result = await res.json();
        success = true;
        break;
      }
    } catch {
      // try next endpoint
    }
  }

  // Also update local cache
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const curr = stored ? JSON.parse(stored) : {};
    if (actionPayload.action === 'register' && actionPayload.worker) {
      curr[actionPayload.worker.id] = actionPayload.worker;
    } else if (actionPayload.action === 'setPin' && actionPayload.id) {
      if (curr[actionPayload.id]) {
        curr[actionPayload.id].pin = actionPayload.pin;
        curr[actionPayload.id].pinSet = true;
      }
    } else if (actionPayload.action === 'clearAll') {
      localStorage.removeItem(STORAGE_KEY);
      return { success: true };
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(curr));
  } catch {}

  return { success, result };
}
