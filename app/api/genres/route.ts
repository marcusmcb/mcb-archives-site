import { NextResponse } from "next/server";

import { getGenres } from "../../../lib/shows";

export const GET = async () => {
  const genres = await getGenres();
  return NextResponse.json({ genres });
};
