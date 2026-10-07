// Minimal browser globals for scratch tests: an inspectable localStorage and zero latency.
process.env.NEXT_PUBLIC_MOCK_LATENCY_MS = "0";
export const backing = new Map();
export const localStorageShim = {
  getItem: (k) => (backing.has(k) ? backing.get(k) : null),
  setItem: (k, v) => void backing.set(k, String(v)),
  removeItem: (k) => void backing.delete(k),
  clear: () => backing.clear(),
};
globalThis.window = { localStorage: localStorageShim };
export const raw = (key) => backing.get("nivora:v1:" + key);
export const setRaw = (key, value) => backing.set("nivora:v1:" + key, value);
