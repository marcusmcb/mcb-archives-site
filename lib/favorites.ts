const KEY = "mcb:favorites";
const EVENT = "mcb:favorites:changed";

export const getFavoriteIds = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((v) => String(v)).filter(Boolean);
  } catch {
    return [];
  }
};

export const isFavorite = (showId: string): boolean => {
  return getFavoriteIds().includes(showId);
};

const setFavoriteIds = (ids: string[]): void => {
  window.localStorage.setItem(KEY, JSON.stringify(Array.from(new Set(ids))));
  window.dispatchEvent(new Event(EVENT));
};

export const toggleFavorite = (showId: string): void => {
  const ids = getFavoriteIds();
  if (ids.includes(showId)) setFavoriteIds(ids.filter((id) => id !== showId));
  else setFavoriteIds([...ids, showId]);
};

export const subscribeFavorites = (cb: () => void): () => void => {
  const handler = () => cb();
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
};
