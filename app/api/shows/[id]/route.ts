import { NextResponse } from "next/server";

import { getShowById } from "../../../../lib/shows";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const show = await getShowById(id);
  if (!show) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ show });
}
