import { NextResponse } from "next/server";

import { getShows } from "../../../lib/shows";

const parseSort = (value: string | null) => {
  const v = (value ?? "").trim().toLowerCase();
  if (v === "station" || v === "title" || v === "original_broadcast") return v;
  return undefined;
};

const parseDir = (value: string | null) => {
  const v = (value ?? "").trim().toLowerCase();
  if (v === "asc" || v === "desc") return v;
  return undefined;
};

export const GET = async (req: Request) => {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim();
  const genre = (url.searchParams.get("genre") ?? "").trim().toLowerCase();
  const decade = (url.searchParams.get("decade") ?? "").trim().toLowerCase();
  const station = (url.searchParams.get("station") ?? "").trim();
  const sortBy = parseSort(url.searchParams.get("sort"));
  const sortDir = parseDir(url.searchParams.get("dir"));
  const page = Math.max(1, Number.parseInt(url.searchParams.get("page") ?? "1", 10) || 1);
  const limitParam = (url.searchParams.get("limit") ?? "").trim().toLowerCase();
  const limit =
    limitParam === "all" ? "all" : Math.min(50, Math.max(1, Number.parseInt(limitParam || "6", 10) || 6));

  const data = await getShows({ q, genre, decade, station, sortBy, sortDir, page, limit });
  return NextResponse.json(data);
};
