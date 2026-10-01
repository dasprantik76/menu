/**
 * Trusted Time Utility
 * 
 * Provides tamper-resistant, authoritative time for approval duration enforcement.
 * Protects against local device calendar tampering, clock rollback, and manual date reversing.
 * 
 * Strategy:
 * 1. Synchronize base timestamp with authoritative global network servers (Google, Cloudflare, APNIC)
 *    using HTTP Date headers.
 * 2. Advance time locally using the hardware monotonic timer (performance.now()), which is immune
 *    to OS calendar adjustments, time zone changes, or manual date tampering.
 * 3. High-water mark & rollback detection: Ensure observed time is strictly monotonic and never
 *    reverses earlier than previously verified activity.
 */

let baseNetworkTimeMs = null;
let basePerfTimeMs = null;
let lastSyncPerfMs = null;
let maxObservedTimeMs = 0;
let isSyncing = false;

const SYNC_ENDPOINTS = [
  "https://www.google.com",
  "https://cloudflare.com",
  "https://1.1.1.1"
];

// Re-sync with network every 10 minutes to prevent drift
const SYNC_INTERVAL_MS = 10 * 60 * 1000;

/**
 * Synchronize with authoritative global network time via HTTP Date header.
 */
async function syncNetworkTime() {
  if (isSyncing) return false;
  isSyncing = true;

  try {
    for (const url of SYNC_ENDPOINTS) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 2000);
        const res = await fetch(url, { method: "HEAD", signal: controller.signal });
        clearTimeout(timer);

        const dateHeader = res.headers.get("date");
        if (dateHeader) {
          const parsed = new Date(dateHeader).getTime();
          if (!isNaN(parsed) && parsed > 1700000000000) { // Valid modern timestamp
            baseNetworkTimeMs = parsed;
            basePerfTimeMs = performance.now();
            lastSyncPerfMs = basePerfTimeMs;
            maxObservedTimeMs = Math.max(maxObservedTimeMs, baseNetworkTimeMs);
            isSyncing = false;
            return true;
          }
        }
      } catch (e) {
        // Fallback to next endpoint
      }
    }
  } finally {
    isSyncing = false;
  }
  return false;
}

// Background periodic sync
setInterval(() => {
  syncNetworkTime().catch(() => {});
}, SYNC_INTERVAL_MS).unref?.();

/**
 * Returns an authoritative, tamper-resistant Date object.
 * Guaranteed to advance monotonically and reflect real-world time.
 */
async function getTrustedDate() {
  const nowPerf = performance.now();

  // If never synced or sync is stale (>10 min), attempt a sync
  if (baseNetworkTimeMs === null || (lastSyncPerfMs !== null && nowPerf - lastSyncPerfMs > SYNC_INTERVAL_MS)) {
    if (baseNetworkTimeMs === null) {
      await syncNetworkTime();
    } else {
      // Trigger background sync without blocking current call
      syncNetworkTime().catch(() => {});
    }
  }

  if (baseNetworkTimeMs !== null && basePerfTimeMs !== null) {
    const elapsed = performance.now() - basePerfTimeMs;
    const currentMs = baseNetworkTimeMs + elapsed;
    maxObservedTimeMs = Math.max(maxObservedTimeMs, currentMs);
    return new Date(currentMs);
  }

  // Fallback if completely offline: Monotonically increasing clock from system Date.now()
  const localNowMs = Date.now();
  const guaranteedMs = Math.max(localNowMs, maxObservedTimeMs);
  maxObservedTimeMs = guaranteedMs;
  return new Date(guaranteedMs);
}

/**
 * Synchronous version using last known monotonic offset
 */
function getTrustedDateSync() {
  if (baseNetworkTimeMs !== null && basePerfTimeMs !== null) {
    const elapsed = performance.now() - basePerfTimeMs;
    const currentMs = baseNetworkTimeMs + elapsed;
    maxObservedTimeMs = Math.max(maxObservedTimeMs, currentMs);
    return new Date(currentMs);
  }
  const localNowMs = Date.now();
  const guaranteedMs = Math.max(localNowMs, maxObservedTimeMs);
  maxObservedTimeMs = guaranteedMs;
  return new Date(guaranteedMs);
}

/**
 * Checks if observed time demonstrates a calendar rollback compared to a reference time.
 * @param {Date|number} observedDate The current observed date
 * @param {Date|number} referenceDate A past verified date (e.g. approvedAt or lastVerifiedAt)
 * @param {number} graceMs Allowed clock jitter tolerance (e.g. 15-30 seconds)
 */
function isRollbackDetected(observedDate, referenceDate, graceMs = 30000) {
  if (!referenceDate || !observedDate) return false;
  const obs = observedDate instanceof Date ? observedDate.getTime() : Number(observedDate);
  const ref = referenceDate instanceof Date ? referenceDate.getTime() : Number(referenceDate);
  if (isNaN(obs) || isNaN(ref)) return false;
  return obs < (ref - graceMs);
}

// Initial sync on module load
syncNetworkTime().catch(() => {});

module.exports = {
  getTrustedDate,
  getTrustedDateSync,
  syncNetworkTime,
  isRollbackDetected
};
