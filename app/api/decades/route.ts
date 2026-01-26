import { NextResponse } from "next/server";

import { getDecades } from "../../../lib/shows";

export const GET = async () => {
  const decades = await getDecades();
  return NextResponse.json({ decades });
};
