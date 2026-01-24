import type { ShowDoc, ShowYaml } from "./types.js";

const requireString = (value: unknown, label: string): string => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Missing/invalid ${label}`);
  }
  return value.trim();
};

const requireStringArray = (value: unknown, label: string): string[] => {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`Missing/invalid ${label} (expected non-empty array)`);
  }
  const result = value
    .map((v) => (typeof v === "string" ? v.trim() : ""))
    .filter((v) => v.length > 0)
    .map((v) => v.toLowerCase());

  if (result.length === 0) {
    throw new Error(`Missing/invalid ${label} (no valid strings)`);
  }

  return Array.from(new Set(result));
};

const requireIsoDate = (value: unknown, label: string): Date => {
  const raw = requireString(value, label);
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid ${label} (expected ISO date string): ${raw}`);
  }
  return date;
};

const buildSearchText = (show: {
  id: string;
  title: string;
  station: string;
  genres: string[];
  songs: { title: string; artist: string }[];
}): string => {
  const songBits = show.songs.flatMap((s) => [s.title, s.artist]);
  return [show.id, show.title, show.station, ...show.genres, ...songBits]
    .join(" ")
    .toLowerCase();
};

export const normalizeShow = (y: ShowYaml, sourcePath: string, now: Date): Omit<ShowDoc, "createdAt"> => {
  const id = requireString(y.id, "id");
  const title = requireString(y.title, "title");
  const image = requireString(y.image, "image");
  const audio_file_link = requireString(y.audio_file_link, "audio_file_link");
  const genres = requireStringArray(y.genres, "genres");
  const original_broadcast = requireIsoDate(y.original_broadcast, "original_broadcast");
  const station = requireString(y.station, "station");

  const songsRaw = y.songs;
  if (!Array.isArray(songsRaw)) throw new Error("Missing/invalid songs (expected array)");
  const songs = songsRaw
    .map((s) => ({
      title: typeof s?.title === "string" ? s.title.trim() : "",
      artist: typeof s?.artist === "string" ? s.artist.trim() : "",
    }))
    .filter((s) => s.title.length > 0 && s.artist.length > 0);

  if (songs.length === 0) throw new Error("Missing/invalid songs (no valid entries)");

  const duration_seconds =
    typeof y.duration_seconds === "number" && Number.isFinite(y.duration_seconds) && y.duration_seconds > 0
      ? Math.floor(y.duration_seconds)
      : undefined;

  const original_broadcast_display =
    typeof y.original_broadcast_display === "string" && y.original_broadcast_display.trim().length > 0
      ? y.original_broadcast_display.trim()
      : undefined;

  const searchText = buildSearchText({ id, title, station, genres, songs });

  return {
    id,
    title,
    image,
    audio_file_link,
    genres,
    original_broadcast,
    original_broadcast_display,
    station,
    duration_seconds,
    songs,
    searchText,
    sourcePath,
    updatedAt: now,
    upvotes: 0,
  };
};
