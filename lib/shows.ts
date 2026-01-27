import type { Collection } from "mongodb";

import { getMongoClient, getMongoEnv } from "./mongo";

export type ShowSong = { title: string; artist: string };

export type ShowDb = {
  id: string;
  title: string;
  image: string;
  audio_file_link: string;
  genres: string[];
  decades: string[];
  original_broadcast: Date;
  original_broadcast_display?: string;
  station: string;
  duration_seconds?: number;
  songs: ShowSong[];
  searchText: string;
  sourcePath: string;
  createdAt: Date;
  updatedAt: Date;
  upvotes: number;
};

export type ShowCard = {
  id: string;
  title: string;
  image: string;
  audio_file_link: string;
  genres: string[];
  decades?: string[];
  original_broadcast: string;
  original_broadcast_display?: string;
  station: string;
  upvotes: number;
};

const showsCollection = async (): Promise<Collection<ShowDb>> => {
  const client = await getMongoClient();
  const { dbName } = getMongoEnv();
  return client.db(dbName).collection<ShowDb>("shows");
};

const toCard = (s: ShowDb): ShowCard => {
  return {
    id: s.id,
    title: s.title,
    image: s.image,
    audio_file_link: s.audio_file_link,
    genres: s.genres,
    decades: s.decades,
    original_broadcast: s.original_broadcast.toISOString(),
    original_broadcast_display: s.original_broadcast_display,
    station: s.station,
    upvotes: s.upvotes ?? 0
  };
};

export const getGenres = async (): Promise<string[]> => {
  const col = await showsCollection();
  const genres = await col.distinct("genres");
  return genres
    .map((g) => String(g).toLowerCase())
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
};

const decadeSortKey = (d: string): number => {
  // Expected like "2000s"; sort by numeric prefix when possible.
  const m = /^\s*(\d{4})s\s*$/.exec(d);
  if (!m) return Number.POSITIVE_INFINITY;
  const n = Number.parseInt(m[1], 10);
  return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY;
};

export const getDecades = async (): Promise<string[]> => {
  const col = await showsCollection();
  const decades = await col.distinct("decades");
  return decades
    .map((d) => String(d).toLowerCase())
    .filter(Boolean)
    .sort((a, b) => {
      const ak = decadeSortKey(a);
      const bk = decadeSortKey(b);
      if (ak !== bk) return ak - bk;
      return a.localeCompare(b);
    });
};

export const getShows = async ({
  q,
  genre,
  decade,
  page,
  limit
}: {
  q: string;
  genre: string;
  decade: string;
  page: number;
  limit: number;
}): Promise<{ shows: ShowCard[]; total: number }> => {
  const col = await showsCollection();

  const filter: Record<string, unknown> = {};
  if (genre) filter.genres = genre;
  if (decade) filter.decades = decade;
  if (q) filter.$text = { $search: q };

  const cursor = col.find(filter, q ? { projection: { score: { $meta: "textScore" } } } : undefined);
  if (q) {
    cursor.sort({ score: { $meta: "textScore" }, original_broadcast: -1 });
  } else {
    cursor.sort({ original_broadcast: -1 });
  }

  const total = await col.countDocuments(filter);

  const docs = await cursor
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  return { shows: docs.map(toCard), total };
};

export const getShowById = async (id: string): Promise<ShowDb | null> => {
  const col = await showsCollection();
  return await col.findOne({ id });
};

export const getShowsByIds = async (ids: string[]): Promise<ShowCard[]> => {
  const col = await showsCollection();
  const docs = await col
    .find({ id: { $in: ids } })
    .sort({ original_broadcast: -1 })
    .toArray();
  return docs.map(toCard);
};

export const getRandomShow = async (): Promise<ShowCard | null> => {
  const col = await showsCollection();
  const docs = (await col.aggregate([{ $sample: { size: 1 } }]).toArray()) as unknown as ShowDb[];
  if (docs.length === 0) return null;
  return toCard(docs[0]);
};
