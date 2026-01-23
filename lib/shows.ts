import type { Collection } from "mongodb";

import { getMongoClient, getMongoEnv } from "./mongo";

export type ShowSong = { title: string; artist: string };

export type ShowDb = {
  id: string;
  title: string;
  image: string;
  audio_file_link: string;
  genres: string[];
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
  genres: string[];
  original_broadcast: string;
  original_broadcast_display?: string;
  station: string;
  upvotes: number;
};

async function showsCollection(): Promise<Collection<ShowDb>> {
  const client = await getMongoClient();
  const { dbName } = getMongoEnv();
  return client.db(dbName).collection<ShowDb>("shows");
}

function toCard(s: ShowDb): ShowCard {
  return {
    id: s.id,
    title: s.title,
    image: s.image,
    genres: s.genres,
    original_broadcast: s.original_broadcast.toISOString(),
    original_broadcast_display: s.original_broadcast_display,
    station: s.station,
    upvotes: s.upvotes ?? 0
  };
}

export async function getGenres(): Promise<string[]> {
  const col = await showsCollection();
  const genres = await col.distinct("genres");
  return genres
    .map((g) => String(g).toLowerCase())
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}

export async function getShows({
  q,
  genre,
  page,
  limit
}: {
  q: string;
  genre: string;
  page: number;
  limit: number;
}): Promise<{ shows: ShowCard[]; total: number }> {
  const col = await showsCollection();

  const filter: Record<string, unknown> = {};
  if (genre) filter.genres = genre;
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
}

export async function getShowById(id: string): Promise<ShowDb | null> {
  const col = await showsCollection();
  return await col.findOne({ id });
}

export async function getShowsByIds(ids: string[]): Promise<ShowCard[]> {
  const col = await showsCollection();
  const docs = await col
    .find({ id: { $in: ids } })
    .sort({ original_broadcast: -1 })
    .toArray();
  return docs.map(toCard);
}
