import { NextResponse } from "next/server";

import { getShowsByIds } from "../../../../lib/shows";

export const GET = async (req: Request) => {
  const url = new URL(req.url);
  const ids = url.searchParams.getAll("id").map((s) => s.trim()).filter(Boolean);

  if (ids.length === 0) {
    return NextResponse.json({ shows: [] });
  }

  const shows = await getShowsByIds(ids);
  return NextResponse.json({ shows });
};
