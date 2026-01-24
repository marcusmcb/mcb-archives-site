const KEY = "mcb:deviceId";

export const getOrCreateDeviceId = (): string => {
  if (typeof window === "undefined") return "";

  const existing = window.localStorage.getItem(KEY);
  if (existing) return existing;

  const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  window.localStorage.setItem(KEY, id);
  return id;
};
